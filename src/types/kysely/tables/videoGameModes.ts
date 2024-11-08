import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface VideoGameModesTable {
	videoGameModeId: GeneratedAlways<number>
	name: Immutable<string>
}

export type VideoGameMode = Selectable<VideoGameModesTable>

export type NewVideoGameMode = Insertable<VideoGameModesTable>

export type VideoGameModeUpdate = Updateable<VideoGameModesTable>
