import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."
import type { VideoGamePlatform } from "./videoGamePlatforms"
import type { VideoGame } from "./videoGames"

export interface VideoGameMultiplayerModesTable {
	videoGameMultiplayerModeId: GeneratedAlways<number>
	videoGameId: Immutable<VideoGame["videoGameId"]>
	platformId: Immutable<VideoGamePlatform["platformId"]>
	lancoop: Immutable<boolean>
	splitScreen: Immutable<boolean>
	offlinecoop: Immutable<boolean>
	offlinecoopmax: number
	offlinemax: number
}

export type VideoGameMultiplayerMode =
	Selectable<VideoGameMultiplayerModesTable>

export type NewVideoGameMultiplayerMode =
	Insertable<VideoGameMultiplayerModesTable>

export type VideoGameMultiplayerModeUpdate =
	Updateable<VideoGameMultiplayerModesTable>
