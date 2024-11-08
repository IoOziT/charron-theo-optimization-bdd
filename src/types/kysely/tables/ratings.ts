import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Party } from "./parties"
import type { User } from "./users"

export interface RatingsTable {
	ratingId: GeneratedAlways<number>
	partyId: Party["partyId"] | null
	authorId: User["userId"]
	userId: User["userId"]
	note: number
	comment: string
}

export type Rating = Selectable<RatingsTable>

export type NewRating = Insertable<RatingsTable>

export type RatingUpdate = Updateable<RatingsTable>
