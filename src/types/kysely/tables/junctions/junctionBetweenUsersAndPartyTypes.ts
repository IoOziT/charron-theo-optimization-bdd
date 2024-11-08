import type { Insertable, Selectable } from "kysely"
import type { Immutable } from "../.."
import type { PartyType } from "../partyTypes"
import type { User } from "../users"

export interface UsersAndPartyTypesJunctionTable {
	partyTypeId: Immutable<PartyType["partyTypeId"]>
	userId: Immutable<User["userId"]>
}

export type UserAndPartyTypeJunction =
	Selectable<UsersAndPartyTypesJunctionTable>

export type NewUserAndPartyTypeJunction =
	Insertable<UsersAndPartyTypesJunctionTable>
