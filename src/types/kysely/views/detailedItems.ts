import type { Immutable, PolymorphicViewDefinition, ViewBase } from ".."
import type { BoardGame } from "../tables/boardGames"
import type { Drink } from "../tables/drinks"
import type { Food } from "../tables/foods"
import type { ItemsTable } from "../tables/items"
import type { VideoGameWithInfos } from "./videoGamesWithInfos"

type Base = ViewBase<Omit<ItemsTable, "itemDetailsId" | "type">>

type DetailedFoodItem = Base & {
	type: Immutable<"food">
	details: Food
}

type DetailedDrinkItem = Base & {
	type: Immutable<"drink">
	details: Immutable<Drink>
}

type DetailedVideoGameItem = Base & {
	type: Immutable<"video_game">
	details: Immutable<VideoGameWithInfos>
}

type DetailedBoardGameItem = Base & {
	type: Immutable<"board_game">
	details: Immutable<BoardGame>
}

export type DetailedItemsView = PolymorphicViewDefinition<
	| DetailedBoardGameItem
	| DetailedDrinkItem
	| DetailedFoodItem
	| DetailedVideoGameItem
>

export type DetailedItem = PolymorphicViewDefinition<
	DetailedItemsView,
	"select"
>
