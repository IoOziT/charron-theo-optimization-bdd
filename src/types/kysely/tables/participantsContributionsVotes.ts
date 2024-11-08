import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."
import type { Party } from "./parties"
import type { User } from "./users"

export interface ParticipantsContributionsVotesTable {
	contributionVoteId: GeneratedAlways<number>
	partyId: Immutable<Party["partyId"]>
	userId: Immutable<User["userId"]>
	type: "for" | "against"
}

export type ParticipantsContributionVote =
	Selectable<ParticipantsContributionsVotesTable>

export type NewParticipantsContributionVote =
	Insertable<ParticipantsContributionsVotesTable>

export type ParticipantsContributionVoteUpdate =
	Updateable<ParticipantsContributionsVotesTable>
