import type { AddressesTable } from "./tables/addresses"
import type { AllergensTable } from "./tables/allergens"
import type { BoardGamesTable } from "./tables/boardGames"
import type { DrinksTable } from "./tables/drinks"
import type { FoodsTable } from "./tables/foods"
import type { ItemsTable } from "./tables/items"
import type { DrinksAndAllergensJunctionTable } from "./tables/junctions/junctionBetweenDrinksAndAllergens"
import type { FoodsAndAllergensJunctionTable } from "./tables/junctions/junctionBetweenFoodsAndAllergens"
import type { UsersAndPartyTypesJunctionTable } from "./tables/junctions/junctionBetweenUsersAndPartyTypes"
import type { VideoGamesAndVideoGameGenresJunctionTable } from "./tables/junctions/junctionBetweenVideoGamesAndVideoGameGenres"
import type { VideoGamesAndVideoGameModesJunctionTable } from "./tables/junctions/junctionBetweenVideoGamesAndVideoGameModes"
import type { VideoGamesAndVideoGamePlaformsJunctionTable } from "./tables/junctions/junctionBetweenVideoGamesAndVideoGamePlatforms"
import type { ParticipantsTable } from "./tables/participants"
import type { ParticipantsContributionsTable } from "./tables/participantsContributions"
import type { ParticipantsContributionsVotesTable } from "./tables/participantsContributionsVotes"
import type { PartiesTable } from "./tables/parties"
import type { PartyOrganizerWishesTable } from "./tables/partyOrganizerWishes"
import type { PartyTypesTable } from "./tables/partyTypes"
import type { RatingsTable } from "./tables/ratings"
import type { UsersTable } from "./tables/users"
import type { VideoGameGenresTable } from "./tables/videoGameGenres"
import type { VideoGameModesTable } from "./tables/videoGameModes"
import type { VideoGameMultiplayerModesTable } from "./tables/videoGameMultiplayerModes"
import type { VideoGamePlatformsTable } from "./tables/videoGamePlatforms"
import type { VideoGamesTable } from "./tables/videoGames"
import type { DetailedItemsView } from "./views/detailedItems"
import type { VideoGamesWithInfosView } from "./views/videoGamesWithInfos"

export interface Database {
	addresses: AddressesTable
	users: UsersTable
	partyTypes: PartyTypesTable
	userPreferredPartyTypes: UsersAndPartyTypesJunctionTable
	parties: PartiesTable
	participants: ParticipantsTable
	ratings: RatingsTable
	foods: FoodsTable
	drinks: DrinksTable
	allergens: AllergensTable
	foodsAllergens: FoodsAndAllergensJunctionTable
	drinksAllergens: DrinksAndAllergensJunctionTable
	videoGames: VideoGamesTable
	videoGamesPlatform: VideoGamePlatformsTable
	videoGamesVideoGamePlatform: VideoGamesAndVideoGamePlaformsJunctionTable
	videoGameModes: VideoGameModesTable
	videoGamesVideoGameModes: VideoGamesAndVideoGameModesJunctionTable
	videoGameMultiplayerModes: VideoGameMultiplayerModesTable
	videoGameGenres: VideoGameGenresTable
	videoGamesVideoGameGenres: VideoGamesAndVideoGameGenresJunctionTable
	videoGamesWithInfos: VideoGamesWithInfosView
	boardGames: BoardGamesTable
	items: ItemsTable
	detailedItems: DetailedItemsView
	partyOrganizerWishes: PartyOrganizerWishesTable
	participantsContributions: ParticipantsContributionsTable
	participantsContributionsVotes: ParticipantsContributionsVotesTable
}
