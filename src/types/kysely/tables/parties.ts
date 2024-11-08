import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Address } from "./addresses"
import type { User } from "./users"

export interface PartiesTable {
	partyId: GeneratedAlways<number>
	organizerId: User["userId"]
	name: string
	theme: string
	addressId: Address["addressId"]
	startDate: Date
	endDate: Date
	fee: number
	capacity: number
}

export type Party = Selectable<PartiesTable>

export type NewParty = Insertable<PartiesTable>

export type PartyUpdate = Updateable<PartiesTable>
