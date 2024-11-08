import type { Insertable, Selectable } from "kysely"
import type { Immutable } from "../.."
import type { VideoGameGenre } from "../videoGameGenres"
import type { VideoGame } from "../videoGames"

export interface VideoGamesAndVideoGameGenresJunctionTable {
	videoGameId: Immutable<VideoGame["videoGameId"]>
	videoGameGenreId: Immutable<VideoGameGenre["videoGameGenreId"]>
}

export type VideoGameAndVideoGameGenreJunction =
	Selectable<VideoGamesAndVideoGameGenresJunctionTable>

export type NewVideoGameAndVideoGameGenreJunction =
	Insertable<VideoGamesAndVideoGameGenresJunctionTable>
