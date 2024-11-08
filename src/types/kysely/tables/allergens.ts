import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface AllergensTable {
	allergenId: GeneratedAlways<number>
	name: Immutable<string>
}

export type Allergen = Selectable<AllergensTable>

export type NewAllergen = Insertable<AllergensTable>

export type AllergenUpdate = Updateable<AllergensTable>
