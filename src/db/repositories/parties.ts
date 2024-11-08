import { type Kysely, sql } from "kysely"
import type { ResolvableExpression } from "../../types/kysely"
import type { Database } from "../../types/kysely/database"
import type { Party } from "../../types/kysely/tables/parties"
import type { User } from "../../types/kysely/tables/users"

export const findAllParties = (db: Kysely<Database>) => db.selectFrom("parties")

export const findAllPartiesWithDetails = (db: Kysely<Database>) =>
	findAllParties(db)
		.innerJoin("users as organizer", "organizer.userId", "parties.organizerId")
		.innerJoin("addresses", "addresses.addressId", "parties.addressId")
		.innerJoin("participants", "participants.partyId", "parties.partyId")
		.select([
			"parties.partyId",
			"parties.name",
			"parties.theme",
			"parties.startDate",
			"parties.endDate",
			"parties.capacity",
			"parties.fee",
			"addresses.city",
		])
		.select(({ fn, val, eb, ref, not }) => [
			eb(
				fn.toJson("organizer"),
				"-",
				// @ts-expect-error TS2345: weird typing
				sql.raw(`{"password", "addressId"}::text[]`)
			)
				.$castTo<Omit<User, "password" | "addressId">>()
				.as("organizer"),
			fn<Record<"confirmed" | "pending", number>>("json_build_object", [
				val("confirmed"),
				fn
					.count("participants.userId")
					.filterWhere(
						eb
							.ref("participants.hasPaid")
							.and(eb.ref("participants.isAccepted"))
					),
				val("pending"),
				fn
					.count("participants.userId")
					.filterWhere(
						not(ref("participants.hasPaid").and(ref("participants.isAccepted")))
					),
			]).as("participants"),
		])

export const findAllParticipantsOfParty = (
	db: Kysely<Database>,
	partyId: ResolvableExpression<Party["partyId"]>
) => db.selectFrom("participants").where("participants.partyId", "=", partyId)

export const findAllConfirmedParticipantsOfParty = (
	db: Kysely<Database>,
	partyId: ResolvableExpression<Party["partyId"]>
) =>
	findAllParticipantsOfParty(db, partyId).where(({ ref, and }) =>
		and([ref("participants.hasPaid"), ref("participants.isAccepted")])
	)

export const findAllPendingParticipantsOfParty = (
	db: Kysely<Database>,
	partyId: ResolvableExpression<Party["partyId"]>
) =>
	findAllParticipantsOfParty(db, partyId).where(({ ref, and, not }) =>
		not(and([ref("participants.hasPaid"), ref("participants.isAccepted")]))
	)

export const findAllPartyItems = (
	db: Kysely<Database>,
	partyId: ResolvableExpression<Party["partyId"]>
) =>
	db
		.with("itemIds", (db) =>
			db
				.selectFrom("partyOrganizerWishes")
				.select("itemId")
				.where("partyId", "=", partyId)
				.unionAll(db.selectFrom("participantsContributions").select("itemId"))
		)
		.selectFrom("detailedItems")
		.innerJoin("itemIds", "itemIds.itemId", "detailedItems.itemId")
		.selectAll("detailedItems")

export const findAllRequestedPartyItems = (db: Kysely<Database>) =>
	db
		.selectFrom("detailedItems")
		.innerJoin(
			"partyOrganizerWishes as wishes",
			"wishes.itemId",
			"detailedItems.itemId"
		)
		.selectAll("detailedItems")

export const findAllRequestedPartyItemsOfParty = (
	db: Kysely<Database>,
	partyId: ResolvableExpression<Party["partyId"]>
) => findAllRequestedPartyItems(db).where("wishes.partyId", "=", partyId)

export const findAllProposedPartyItems = (db: Kysely<Database>) =>
	db
		.selectFrom("detailedItems")
		.innerJoin(
			"partyOrganizerWishes as wishes",
			"wishes.itemId",
			"detailedItems.itemId"
		)
		.selectAll("detailedItems")

export const findAllProposedPartyItemsOfParty = (
	db: Kysely<Database>,
	partyId: ResolvableExpression<Party["partyId"]>
) => findAllProposedPartyItems(db).where("wishes.partyId", "=", partyId)
