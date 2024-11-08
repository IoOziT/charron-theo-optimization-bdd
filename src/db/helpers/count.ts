import type { SelectQueryBuilder } from "kysely"

export const countResults = async <F extends string = "count">(
	query: SelectQueryBuilder<Record<string, unknown>, string, unknown>,
	fieldName: F = "count" as F
) =>
	query
		.clearSelect()
		.clearOrderBy()
		.clearLimit()
		.select((eb) => eb.fn.countAll<number>().as(fieldName))
		.$castTo<Record<F, number>>()
		.executeTakeFirstOrThrow()
		.then((r) => r[fieldName])
