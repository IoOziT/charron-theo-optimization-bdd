import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface VideoGameGenresTable {
	videoGameGenreId: GeneratedAlways<number>
	name: Immutable<string>
}

export type VideoGameGenre = Selectable<VideoGameGenresTable>

export type NewVideoGameGenre = Insertable<VideoGameGenresTable>

export type VideoGameGenreUpdate = Updateable<VideoGameGenresTable>
