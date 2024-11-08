import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface VideoGamesTable {
	videoGameId: GeneratedAlways<number>
	name: Immutable<string>
	releaseDate: Immutable<Date>
	description: Immutable<string>
}

export type VideoGame = Selectable<VideoGamesTable>

export type NewVideoGame = Insertable<VideoGamesTable>

export type VideoGameUpdate = Updateable<VideoGamesTable>
