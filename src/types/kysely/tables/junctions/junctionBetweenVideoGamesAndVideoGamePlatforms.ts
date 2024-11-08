import type { Insertable, Selectable } from "kysely"
import type { Immutable } from "../.."
import type { VideoGamePlatform } from "../videoGamePlatforms"
import type { VideoGame } from "../videoGames"

export interface VideoGamesAndVideoGamePlaformsJunctionTable {
	videoGameId: Immutable<VideoGame["videoGameId"]>
	platformId: Immutable<VideoGamePlatform["platformId"]>
}

export type VideoGameAndVideoGamePlaformJunction =
	Selectable<VideoGamesAndVideoGamePlaformsJunctionTable>

export type NewVideoGameAndVideoGamePlaformJunction =
	Insertable<VideoGamesAndVideoGamePlaformsJunctionTable>
