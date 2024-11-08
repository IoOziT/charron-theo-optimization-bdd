import type { SelectQueryBuilder } from "kysely"

import { countResults } from "./count"

export const paginate = async <DB extends Database, TB extends keyof DB, O>(
	query: SelectQueryBuilder<DB, TB, O>,
	page = 1,
	pageSize = 20
) => {
	const total = await countResults(query, "total")
	const results = await query
		.limit(pageSize)
		.offset((page - 1) * pageSize)
		.execute()

	return { results, total }
}
