import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface DrinksTable {
	drinkId: GeneratedAlways<number>
	name: Immutable<string>
	alcoholLevel: Immutable<number>
	imageUrl: string | null
}

export type Drink = Selectable<DrinksTable>

export type NewDrink = Insertable<DrinksTable>

export type DrinkUpdate = Updateable<DrinksTable>
