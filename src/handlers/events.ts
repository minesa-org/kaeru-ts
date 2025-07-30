import fs from "fs";
import path from "path";
import type { Client, ClientEvents } from "discord.js";
import type { EventModule } from "@interfaces/botTypes.js";

export async function loadEvents(client: Client) {
	const eventsPath = path.join(process.cwd(), "src", "events");
	const files = fs
		.readdirSync(eventsPath)
		.filter(file => file.endsWith(".ts") || file.endsWith(".js"));

	for (const file of files) {
		const filePath = path.join(eventsPath, file);
		const eventModule = (await import(filePath)).default as EventModule;

		if (!eventModule || typeof eventModule.execute !== "function") {
			console.warn(`[SKIP] Invalid event module: ${file}`);
			continue;
		}

		const eventName = eventModule.name as keyof ClientEvents;

		const handler = async (...args: ClientEvents[typeof eventName]) => {
			try {
				await eventModule.execute(...args);
			} catch (error) {
				console.error(`Error in event ${eventName}:`, error);
			}
		};

		if (eventModule.once) {
			client.once(eventName, handler);
		} else {
			client.on(eventName, handler);
		}

		console.log(`[EVENT LOADED] ${eventName}`);
	}

	console.log(`------------------------------------------`);
}
