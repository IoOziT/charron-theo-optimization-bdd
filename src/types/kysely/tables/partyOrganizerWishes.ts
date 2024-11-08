import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."
import type { Item } from "./items"
import type { Party } from "./parties"

export interface PartyOrganizerWishesTable {
	wishId: GeneratedAlways<number>
	partyId: Immutable<Party["partyId"]>
	itemId: Immutable<Item["itemId"]>
	itemType: Immutable<Item["type"]>
}

export type PartyOrganizerWish = Selectable<PartyOrganizerWishesTable>

export type NewPartyOrganizerWish = Insertable<PartyOrganizerWishesTable>

export type PartyOrganizerWishUpdate = Updateable<PartyOrganizerWishesTable>
