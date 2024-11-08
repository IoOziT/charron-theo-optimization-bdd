import type { Insertable, Selectable } from "kysely"
import type { Immutable } from "../.."
import type { Allergen } from "../allergens"
import type { Food } from "../foods"

export interface FoodsAndAllergensJunctionTable {
	foodId: Immutable<Food["foodId"]>
	allergenId: Immutable<Allergen["allergenId"]>
}

export type FoodAndAllergenJunction = Selectable<FoodsAndAllergensJunctionTable>

export type NewFoodAndAllergenJunction =
	Insertable<FoodsAndAllergensJunctionTable>
