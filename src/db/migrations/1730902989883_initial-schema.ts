import { type Kysely, sql } from "kysely"

import {
	PARTITION_TYPES,
	createPartitionTable,
	partitionBy,
} from "./helpers/partitioning"

const noteCheck = (column: string) => sql`${sql.ref(column)} BETWEEN 0 AND 5`

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("addresses")
		.addColumn("address_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("city", "text", (col) => col.notNull())
		.addColumn("details", "text")
		.execute()

	await db.schema
		.createTable("users")
		.addColumn("user_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("first_name", "text", (col) => col.notNull())
		.addColumn("last_name", "text", (col) => col.notNull())
		.addColumn("email", "text", (col) => col.unique().notNull())
		.addColumn("password", "text", (col) => col.notNull())
		.addColumn("address_id", "integer", (col) =>
			col.references("addresses.address_id").onDelete("restrict").notNull()
		)
		.addColumn("age", "smallint", (col) => col.notNull().check(sql`age > 15`))
		.addColumn("note", "smallint", (col) => col.check(noteCheck("note")))
		.execute()

	await db.schema
		.createTable("party_types")
		.addColumn("party_type_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.execute()

	await db.schema
		.createTable("user_preferred_party_types")
		.addColumn("party_type_id", "integer", (col) =>
			col.references("party_types.party_type_id").onDelete("cascade").notNull()
		)
		.addColumn("user_id", "integer", (col) =>
			col.references("users.user_id").onDelete("cascade").notNull()
		)
		.addPrimaryKeyConstraint("pk_user_preferred_party_types", [
			"party_type_id",
			"user_id",
		])
		.execute()

	await db.schema
		.createTable("parties")
		.addColumn("party_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("organizer_id", "integer", (col) =>
			col.references("users.user_id").onDelete("set null")
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("theme", "text", (col) => col.notNull())
		.addColumn("address_id", "integer", (col) =>
			col.references("addresses.address_id").onDelete("restrict").notNull()
		)
		.addColumn("start_date", "timestamptz", (col) =>
			col.check(sql`start_date >= CURRENT_DATE`)
		)
		.addColumn("end_date", "timestamptz", (col) =>
			col.check(sql`end_date > start_date`)
		)
		.addColumn("fee", "numeric", (col) => col.defaultTo(0).notNull())
		.addColumn("capacity", "smallint", (col) =>
			col.check(sql`capacity >= 1`).notNull()
		)
		.execute()

	await db.schema
		.createTable("participants")
		.addColumn("user_id", "integer", (col) =>
			col.references("users.user_id").onDelete("set null")
		)
		.addColumn("party_id", "integer", (col) =>
			col.references("parties.party_id").onDelete("cascade").notNull()
		)
		.addColumn("is_accepted", "boolean", (col) =>
			col.notNull().defaultTo(false)
		)
		.addColumn("has_paid", "boolean", (col) => col.notNull().defaultTo(false))
		.addPrimaryKeyConstraint("pk_participants", ["party_id", "user_id"])
		.execute()

	await db.schema
		.createTable("ratings")
		.addColumn("rating_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("party_id", "integer", (col) =>
			col.references("parties.party_id").onDelete("set null")
		)
		.addColumn("author_id", "integer", (col) =>
			col.references("users.user_id").onDelete("cascade").notNull()
		)
		.addColumn("user_id", "integer", (col) =>
			col
				.references("users.user_id")
				.onDelete("cascade")
				.check(sql`author_id != user_id`)
				.notNull()
		)
		.addColumn("note", "smallint", (col) =>
			col.check(noteCheck("note")).notNull()
		)
		.addColumn("comment", "text", (col) => col.notNull())
		.addUniqueConstraint("uk__ratings__author_id__user_id", [
			"author_id",
			"user_id",
		])
		.addForeignKeyConstraint(
			"fk_ratings__user__participants",
			["user_id", "party_id"],
			"participants",
			["user_id", "party_id"]
		)
		.addForeignKeyConstraint(
			"fk_ratings__author__participants",
			["author_id", "party_id"],
			"participants",
			["user_id", "party_id"]
		)
		.execute()

	await sql`CREATE FUNCTION update_user_rating() RETURNS TRIGGER AS $body$
		DECLARE
			user_id integer;
		BEGIN
			IF TG_OP IN ('INSERT', 'UPDATE') THEN
				user_id := NEW.user_id;
			ELSIF TG_OP = 'DELETE' THEN
				user_id := OLD.user_id;
			END IF;

			UPDATE users SET note = (
				SELECT avg(ratings.note) FROM ratings
				WHERE ratings.user_id = user_id
			);

			RETURN NULL;
		END;
	$body$ LANGUAGE plpgsql`.execute(db)

	await sql`
		CREATE TRIGGER update_user_rating_after_insert_or_delete 
		AFTER INSERT OR DELETE ON ratings
		FOR EACH ROW
		EXECUTE FUNCTION update_user_rating()
	`.execute(db)

	await sql`
		CREATE TRIGGER update_user_rating_after_update 
		AFTER UPDATE OF note ON ratings
		FOR EACH ROW
		EXECUTE FUNCTION update_user_rating()
	`.execute(db)

	await db.schema
		.createTable("foods")
		.addColumn("food_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.addColumn("image_url", "text")
		.execute()

	await db.schema
		.createTable("drinks")
		.addColumn("drink_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.addColumn("alcohol_level", "float4", (col) => col.notNull().defaultTo(0))
		.addColumn("image_url", "text")
		.execute()

	await db.schema
		.createTable("allergens")
		.addColumn("allergen_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.execute()

	await db.schema
		.createTable("foods_allergens")
		.addColumn("food_id", "integer", (col) =>
			col.references("foods.food_id").onDelete("cascade")
		)
		.addColumn("allergen_id", "integer", (col) =>
			col.references("allergens.allergen_id").onDelete("restrict")
		)
		.addPrimaryKeyConstraint("pk_food_allergens", ["food_id", "allergen_id"])
		.execute()

	await db.schema
		.createTable("drinks_allergens")
		.addColumn("drink_id", "integer", (col) =>
			col.references("drinks.drink_id").onDelete("cascade")
		)
		.addColumn("allergen_id", "integer", (col) =>
			col.references("allergens.allergen_id").onDelete("restrict")
		)
		.addPrimaryKeyConstraint("pk_drink_allergens", ["drink_id", "allergen_id"])
		.execute()

	await db.schema
		.createTable("video_games")
		.addColumn("video_game_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.addColumn("release_date", "timestamptz", (col) => col.notNull())
		.addColumn("description", "text", (col) => col.notNull().defaultTo(""))
		.execute()

	await db.schema
		.createTable("video_game_platforms")
		.addColumn("platform_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("category", "text", (col) =>
			col
				.check(sql`category IN ('console', 'portable_console', 'computer')`)
				.notNull()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.addColumn("abbreviated_name", "text", (col) => col.notNull())
		.addColumn("alternative_names", sql`text[]`, (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("video_games__video_game_platforms")
		.addColumn("video_game_id", "integer", (col) =>
			col.references("video_games.video_game_id").onDelete("cascade").notNull()
		)
		.addColumn("platform_id", "integer", (col) =>
			col
				.references("video_game_platforms.platform_id")
				.onDelete("cascade")
				.notNull()
		)
		.execute()

	await db.schema
		.createTable("video_game_modes")
		.addColumn("video_game_mode_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.execute()

	await db.schema
		.createTable("video_games__video_game_modes")
		.addColumn("video_game_id", "integer", (col) =>
			col.references("video_games.video_game_id").onDelete("cascade").notNull()
		)
		.addColumn("video_game_mode_id", "integer", (col) =>
			col
				.references("video_game_modes.video_game_mode_id")
				.onDelete("cascade")
				.notNull()
		)
		.execute()

	await db.schema
		.createTable("video_game_multiplayer_modes")
		.addColumn("video_game_multiplayer_mode_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("video_game_id", "integer", (col) =>
			col.references("video_games.video_game_id").onDelete("cascade").notNull()
		)
		.addColumn("platform_id", "integer", (col) =>
			col
				.references("video_game_platforms.platform_id")
				.onDelete("cascade")
				.notNull()
		)
		.addColumn("lancoop", "boolean", (col) => col.notNull())
		.addColumn("offlinecoop", "boolean", (col) => col.notNull())
		.addColumn("splitscreen", "boolean", (col) => col.notNull())
		.addColumn("offlinecoopmax", "integer", (col) =>
			col.check(sql`offlinecoopmax > 1`).notNull()
		)
		.addColumn("offlinemax", "integer", (col) =>
			col.check(sql`offlinecoopmax > 1`).notNull()
		)
		.execute()

	await db.schema
		.createTable("video_game_genres")
		.addColumn("video_game_genre_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.unique().notNull())
		.execute()

	await db.schema
		.createTable("video_games__video_game_genres")
		.addColumn("video_game_id", "integer", (col) =>
			col.references("video_games.video_game_id").onDelete("cascade").notNull()
		)
		.addColumn("video_game_genre_id", "integer", (col) =>
			col
				.references("video_game_genres.video_game_genre_id")
				.onDelete("cascade")
				.notNull()
		)
		.execute()

	await db.schema
		.createView("video_games_with_infos")
		.as(
			db
				.selectFrom("video_games as games")
				.leftJoin(
					"video_games__video_game_genres as genres_junction",
					"genres_junction.video_game_genre_id",
					"games.video_game_id"
				)
				.leftJoin(
					"video_game_genres as genres",
					"genres_junction.video_game_genre_id",
					"genres.video_game_genre_id"
				)
				.leftJoin(
					"video_games__video_game_platforms as platforms_junction",
					"platforms_junction.video_game_id",
					"games.video_game_id"
				)
				.leftJoin(
					"video_game_platforms as platforms",
					"platforms_junction.platform_id",
					"platforms.platform_id"
				)
				.leftJoin(
					"video_games__video_game_modes as modes_junction",
					"modes_junction.video_game_mode_id",
					"games.video_game_id"
				)
				.leftJoin(
					"video_game_modes as modes",
					"modes_junction.video_game_mode_id",
					"modes.video_game_mode_id"
				)
				.leftJoin(
					"video_game_multiplayer_modes as multiplayer_modes",
					"multiplayer_modes.video_game_id",
					"games.video_game_id"
				)
				.selectAll("games")
				.select((eb) => [
					eb.fn
						.coalesce(
							eb.fn
								/* @ts-expect-error TS2345: No typing from kysely */
								.agg<string[]>("array_agg", "genres.name")
								.filterWhere("genres.name", "is not", null),
							eb.val("{}")
						)
						.as("genres"),
					eb.fn
						.coalesce(
							eb.fn
								/* @ts-expect-error TS2345: No typing from kysely */
								.agg<string[]>("array_agg", "platforms.name")
								.filterWhere("platforms.name", "is not", null),
							eb.val('{"Unknown"}')
						)
						.as("platforms"),
					eb.fn
						.coalesce(
							eb.fn
								/* @ts-expect-error TS2345: No typing from kysely */
								.agg<string[]>("array_agg", "modes.name")
								.filterWhere("modes.name", "is not", null),
							eb.val('{"Unknown"}')
						)
						.as("modes"),
					eb
						/* @ts-expect-error TS2345: No typing from kysely */
						.fn("to_json", sql.raw("multiplayer_modes.*"))
						.as("multiplayer_modes"),
				])
				.groupBy([
					"games.video_game_id",
					"multiplayer_modes.video_game_multiplayer_mode_id",
				])
		)
		.execute()

	await db.schema
		.createTable("board_games")
		.addColumn("board_game_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("description", "text")
		.execute()

	await db.schema
		.createTable("items")
		.addColumn("item_id", "integer", (col) => col.generatedAlwaysAsIdentity())
		.addColumn("type", "text", (col) => col.notNull())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("item_details_id", "integer", (col) => col.notNull())
		.addPrimaryKeyConstraint("pk_items", ["item_id", "type"])
		.$call(partitionBy(PARTITION_TYPES.LIST, ["type"]))
		.execute()

	const itemPartitions = {
		food_items: {
			type: "food",
			tableName: "foods",
			primaryKey: "food_id",
		},
		drink_items: { type: "drink", tableName: "drinks", primaryKey: "drink_id" },
		video_game_items: {
			type: "video_game",
			tableName: "video_games",
			primaryKey: "video_game_id",
		},
		board_game_items: {
			type: "board_game",
			tableName: "board_games",
			primaryKey: "board_game_id",
		},
	}

	await Promise.all(
		Object.entries(itemPartitions).map(
			([partitionName, { type: itemType, tableName, primaryKey }]) =>
				createPartitionTable(db, "items", partitionName, PARTITION_TYPES.LIST, [
					itemType,
				]).then(() =>
					db.schema
						.alterTable(partitionName)
						.addForeignKeyConstraint(
							`fk_${partitionName}__${tableName}`,
							["item_details_id"],
							tableName,
							[primaryKey]
						)
						.execute()
				)
		)
	)

	await db.schema
		.createView("detailed_items")
		.as(
			db
				.selectFrom("food_items")
				.innerJoin("foods", "foods.food_id", "food_items.item_details_id")
				.select(["food_items.item_id", "food_items.type", "food_items.name"])
				.select((eb) => eb.fn.toJson("foods").as("details"))
				.unionAll(
					db
						.selectFrom("drink_items")
						.innerJoin(
							"drinks",
							"drinks.drink_id",
							"drink_items.item_details_id"
						)
						.select([
							"drink_items.item_id",
							"drink_items.type",
							"drink_items.name",
						])
						.select((eb) => eb.fn.toJson("drinks").as("details"))
				)
				.unionAll(
					db
						.selectFrom("board_game_items")
						.innerJoin(
							"board_games",
							"board_games.board_game_id",
							"board_game_items.item_details_id"
						)
						.select([
							"board_game_items.item_id",
							"board_game_items.type",
							"board_game_items.name",
						])
						.select((eb) => eb.fn.toJson("board_games").as("details"))
				)
				.unionAll(
					db
						.selectFrom("video_game_items")
						.innerJoin(
							"video_games_with_infos as video_games",
							"video_games.video_game_id",
							"video_game_items.item_details_id"
						)
						.select([
							"video_game_items.item_id",
							"video_game_items.type",
							"video_game_items.name",
						])
						.select((eb) => eb.fn.toJson("video_games").as("details"))
				)
		)
		.execute()

	await db.schema
		.createTable("party_organizer_wishes")
		.addColumn("wish_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("party_id", "integer", (col) =>
			col.references("parties.party_id").onDelete("cascade").notNull()
		)
		.addColumn("item_id", "integer", (col) => col.notNull())
		.addColumn("item_type", "text", (col) => col.notNull())
		.addForeignKeyConstraint(
			"fk_party_organizer_wishes__items",
			["item_id", "item_type"],
			"items",
			["item_id", "type"],
			(fkBuiler) => fkBuiler.onDelete("cascade")
		)
		.execute()

	await db.schema
		.createTable("particpants_contributions")
		.addColumn("contribution_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("party_id", "integer", (col) => col.notNull())
		.addColumn("user_id", "integer")
		.addColumn("item_id", "integer", (col) => col.notNull())
		.addColumn("item_type", "text", (col) => col.notNull())
		.addUniqueConstraint("uk_participants_contributions__ref_tuple", [
			"contribution_id",
			"party_id",
			"user_id",
		])
		.addForeignKeyConstraint(
			"fk_participants_contributions__parties",
			["party_id"],
			"parties",
			["party_id"],
			(fkBuilder) => fkBuilder.onDelete("cascade")
		)
		.addForeignKeyConstraint(
			"fk_participant_contributions__participants",
			["user_id", "party_id"],
			"participants",
			["user_id", "party_id"],
			(fkBuilder) => fkBuilder.onDelete("set null")
		)
		.addForeignKeyConstraint(
			"fk_particpants_contributions__items",
			["item_id", "item_type"],
			"items",
			["item_id", "type"],
			(fkBuilder) => fkBuilder.onDelete("cascade")
		)
		.execute()

	await db.schema
		.createTable("participants_contributions_votes")
		.addColumn("contribution_vote_id", "integer", (col) =>
			col.generatedAlwaysAsIdentity().primaryKey()
		)
		.addColumn("contribution_id", "integer", (col) => col.notNull())
		.addColumn("party_id", "integer", (col) => col.notNull())
		.addColumn("user_id", "integer", (col) => col.notNull())
		.addColumn("type", "text", (col) =>
			col.check(sql`type IN ('for', 'against')`)
		)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("participants_contributions_votes").execute()
	await db.schema.dropTable("particpants_contributions").execute()
	await db.schema.dropTable("party_organizer_wishes").execute()
	await db.schema.dropTable("items").cascade().execute()
	await db.schema.dropTable("board_games").execute()
	await db.schema.dropTable("video_games__video_game_genres").execute()
	await db.schema.dropTable("video_game_genres").execute()
	await db.schema.dropTable("video_game_multiplayer_modes").execute()
	await db.schema.dropTable("video_games__videos_game_modes").execute()
	await db.schema.dropTable("video_game_modes").execute()
	await db.schema.dropTable("video_games__video_game_modes").execute()
	await db.schema.dropTable("video_game_platforms").execute()
	await db.schema.dropTable("video_games").execute()
	await db.schema.dropTable("drink_allergens").execute()
	await db.schema.dropTable("food_allergens").execute()
	await db.schema.dropTable("allergens").execute()
	await db.schema.dropTable("drinks").execute()
	await db.schema.dropTable("foods").execute()
	await db.schema.dropTable("ratings").execute()
	await db.schema.dropTable("participants").execute()
	await db.schema.dropTable("user_preferred_party_types").execute()
	await db.schema.dropTable("party_types").execute()
	await db.schema.dropTable("users").execute()
	await db.schema.dropTable("addresses").execute()

	await sql`DROP FUNCTION update_user_rating();`.execute(db)
}
