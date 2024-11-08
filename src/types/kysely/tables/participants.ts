import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Party } from "./parties"
import type { User } from "./users"

export interface ParticipantsTable {
	participantId: GeneratedAlways<number>
	partyId: Party["partyId"]
	userId: User["userId"] | null
	isAccepted: boolean
	hasPaid: boolean
}

export type Participant = Selectable<ParticipantsTable>

export type NewParticipant = Insertable<ParticipantsTable>

export type ParticipantUpdate = Updateable<ParticipantsTable>
