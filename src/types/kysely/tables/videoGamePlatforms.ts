import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface VideoGamePlatformsTable {
	platformId: GeneratedAlways<number>
	category: Immutable<"console" | "portable_console" | "computer">
	name: Immutable<string>
	abbreviatedName: Immutable<string>
	alternativeNames: Immutable<string[]>
}

export type VideoGamePlatform = Selectable<VideoGamePlatformsTable>

export type NewVideoGamePlatform = Insertable<VideoGamePlatformsTable>

export type VideoGamePlatformUpdate = Updateable<VideoGamePlatformsTable>
