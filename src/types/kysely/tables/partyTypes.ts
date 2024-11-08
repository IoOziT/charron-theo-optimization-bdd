import type { GeneratedAlways, Insertable, Selectable } from "kysely"
import type { Immutable } from ".."

export interface PartyTypesTable {
	partyTypeId: GeneratedAlways<number>
	name: Immutable<string>
}

export type PartyType = Selectable<PartyTypesTable>

export type NewPartyType = Insertable<PartyTypesTable>
