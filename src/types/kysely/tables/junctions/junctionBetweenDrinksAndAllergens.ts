import type { Insertable, Selectable } from "kysely"
import type { Immutable } from "../.."
import type { Allergen } from "../allergens"
import type { Drink } from "../drinks"

export interface DrinksAndAllergensJunctionTable {
	drinkId: Immutable<Drink["drinkId"]>
	allergenId: Immutable<Allergen["allergenId"]>
}

export type DrinkAndAllergenJunction =
	Selectable<DrinksAndAllergensJunctionTable>

export type NewDrinkAndAllergenJunction =
	Insertable<DrinksAndAllergensJunctionTable>
