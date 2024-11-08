import type { Insertable, Selectable } from "kysely"
import type { Immutable } from "../.."
import type { VideoGameMode } from "../videoGameModes"
import type { VideoGame } from "../videoGames"

export interface VideoGamesAndVideoGameModesJunctionTable {
	videoGameId: Immutable<VideoGame["videoGameId"]>
	videoGameModeId: Immutable<VideoGameMode["videoGameModeId"]>
}

export type VideoGameAndVideoGameModeJunction =
	Selectable<VideoGamesAndVideoGameModesJunctionTable>

export type NewVideoGameAndVideoGameModeJunction =
	Insertable<VideoGamesAndVideoGameModesJunctionTable>
