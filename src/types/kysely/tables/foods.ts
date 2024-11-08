import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface FoodsTable {
	foodId: GeneratedAlways<number>
	name: Immutable<string>
	imageUrl: string | null
}

export type Food = Selectable<FoodsTable>

export type NewFood = Insertable<FoodsTable>

export type FoodUpdate = Updateable<FoodsTable>
