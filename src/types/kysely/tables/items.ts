import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface ItemsTable {
	itemId: GeneratedAlways<number>
	type: Immutable<string>
	name: Immutable<string>
	itemDetailsId: Immutable<number>
}

export type Item = Selectable<ItemsTable>

export type NewItem = Insertable<ItemsTable>

export type Itemupdate = Updateable<ItemsTable>
