import { type CreateTableBuilder, type Kysely, sql } from "kysely"

export enum PARTITION_TYPES {
	LIST = "LIST",
	RANGE = "RANGE",
	HASH = "HASH",
}

interface PartitionValues {
	[PARTITION_TYPES.LIST]: Array<string | number>
	[PARTITION_TYPES.RANGE]: [Array<string | number>, Array<string | number>]
	[PARTITION_TYPES.HASH]: [number, number]
}

export const partitionBy = <Columns extends string>(
	partitionType: PARTITION_TYPES,
	columns: Columns[]
) => {
	return (tableBuilder: CreateTableBuilder<string, Columns>) =>
		tableBuilder.modifyEnd(
			sql`PARTITION BY ${sql.raw(partitionType)} (${sql.join(columns.map(sql.ref))})`
		)
}

export const createPartitionTable = <P extends PARTITION_TYPES>(
	db: Kysely<any>,
	parentTable: string,
	tableName: string,
	partitionType: P,
	partitionValues: PartitionValues[P] | "DEFAULT"
) => {
	let partitionValuesClause =
		partitionValues === "DEFAULT" ? sql.raw("DEFAULT") : sql.raw("FOR VALUES")

	if (partitionValues !== "DEFAULT") {
		switch (partitionType) {
			case PARTITION_TYPES.LIST:
				partitionValuesClause = sql`${partitionValuesClause} IN (${sql.join(partitionValues.map(sql.lit))})`

				break

			case PARTITION_TYPES.RANGE:
				partitionValuesClause = sql`${partitionValuesClause} FROM (${sql.join((partitionValues[0] as Array<string | number>).map(sql.lit))}) TO (${sql.join((partitionValues[1] as Array<string | number>).map(sql.lit))})`

				break

			case PARTITION_TYPES.HASH:
				partitionValuesClause = sql`${partitionValuesClause} WITH (modulus ${sql.lit(partitionValues[0])}, remainder ${sql.lit(partitionValues[1])})`

				break
		}
	}

	return sql`CREATE TABLE ${sql.table(tableName)} PARTITION OF ${sql.table(parentTable)} ${partitionValuesClause}`.execute(
		db
	)
}
