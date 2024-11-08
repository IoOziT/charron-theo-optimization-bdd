import { Hono } from "hono"

export const app = new Hono()
	.get("/hello", (ctx) => ctx.text("World!"))
	.route("/parties", new Hono())
	.route("/users", new Hono())
	.route(
		"/items",
		new Hono()
			.route("/foods", new Hono())
			.route("/drinks", new Hono())
			.route("/board-games", new Hono())
			.route("/video-games", new Hono())
	)
