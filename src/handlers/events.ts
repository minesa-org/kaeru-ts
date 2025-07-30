// src/handlers/events.ts
import fs from "fs";
import path from "path";
import type { Client, ClientEvents } from "discord.js";
import { log, separator, header } from "../utils/colors.js";
import type { EventModule } from "@interfaces/botTypes.js";
import chalk from "chalk";

export async function loadEvents(client: Client) {
	console.log("\n");
	header("Loading Events");
	const eventsPath = path.join(process.cwd(), "src", "events");
	const files = fs
		.readdirSync(eventsPath)
		.filter(file => file.endsWith(".ts") || file.endsWith(".js"));

	const loadedEvents: { type: string; name: string; path: string }[] = [];

	for (const file of files) {
		const filePath = path.join(eventsPath, file);
		try {
			const eventModule = (await import(filePath)).default as EventModule;

			if (!eventModule || typeof eventModule.execute !== "function") {
				log("warning", `Invalid event module: ${file}`);
				continue;
			}

			const eventName = eventModule.name as keyof ClientEvents;

			const handler = async (...args: ClientEvents[typeof eventName]) => {
				try {
					await eventModule.execute(...args);
				} catch (error) {
					log("error", `Failed to execute event ${eventName}`, error);
				}
			};

			if (eventModule.once) {
				client.once(eventName, handler);
				log("event", `${chalk.dim.underline("one-time")}	${eventName}`);
			} else {
				client.on(eventName, handler);
				log("event", `${chalk.dim.underline("recurring")}	${eventName}`);
			}
			loadedEvents.push({ type: "event", name: eventName, path: filePath });
		} catch (error) {
			log("error", `Failed to load event at ${filePath}`, error);
		}
	}
	separator();
}
