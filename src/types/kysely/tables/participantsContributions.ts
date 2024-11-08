import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."
import type { Item } from "./items"
import type { Party } from "./parties"
import type { User } from "./users"

export interface ParticipantsContributionsTable {
	contributionId: GeneratedAlways<number>
	partyId: Immutable<Party["partyId"]>
	userId: Immutable<User["userId"]>
	itemId: Immutable<Item["itemId"]>
	itemType: Immutable<Item["type"]>
}

export type ParticipantContribution = Selectable<ParticipantsContributionsTable>

export type NewParticipantContribution =
	Insertable<ParticipantsContributionsTable>

export type ParticipantContributionUpdate =
	Updateable<ParticipantsContributionsTable>
