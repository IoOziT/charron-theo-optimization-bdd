import type { Selectable } from "kysely"
import type { Immutable, ViewBase } from ".."
import type { VideoGameGenre } from "../tables/videoGameGenres"
import type { VideoGameMode } from "../tables/videoGameModes"
import type { VideoGameMultiplayerMode } from "../tables/videoGameMultiplayerModes"
import type { VideoGamePlatform } from "../tables/videoGamePlatforms"
import type { VideoGamesTable } from "../tables/videoGames"

export interface VideoGamesWithInfosView extends ViewBase<VideoGamesTable> {
	genres: Immutable<Array<VideoGameGenre["name"]>>
	platforms: Immutable<Array<VideoGamePlatform["name"]>>
	modes: Immutable<Array<VideoGameMode["name"]>>
	multiplayerModes: VideoGameMultiplayerMode | null
}

export type VideoGameWithInfos = Selectable<VideoGamesWithInfosView>
