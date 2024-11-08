import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Immutable } from ".."

export interface BoardGamesTable {
	boardGameId: GeneratedAlways<number>
	name: Immutable<string>
	description: string | null
}

export type BoardGame = Selectable<BoardGamesTable>

export type NewBoardGame = Insertable<BoardGamesTable>

export type BoardGameUpdate = Updateable<BoardGamesTable>
