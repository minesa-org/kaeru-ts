import fs from "fs";
import path from "path";
import type { Client, Awaitable } from "discord.js";

interface EventModule {
	name: string;
	once: boolean;
	execute: (...args: any[]) => Awaitable<void>;
}

export async function loadEvents(client: Client) {
	const eventsPath = path.join(process.cwd(), "src", "events");
	const files = fs
		.readdirSync(eventsPath)
		.filter(file => file.endsWith(".ts") || file.endsWith(".js"));

	for (const file of files) {
		const filePath = path.join(eventsPath, file);
		const eventModule: EventModule = (await import(filePath)).default ?? (await import(filePath));

		if (!eventModule.name || typeof eventModule.execute !== "function") {
			console.warn(`[SKIP] Invalid event module: ${file}`);
			continue;
		}

		const listener = (...args: any[]) => {
			if (eventModule.name === "interactionCreate") {
				eventModule.execute({ interaction: args[0] });
			} else {
				eventModule.execute(...args);
			}
		};

		if (eventModule.once) {
			client.once(eventModule.name, listener);
		} else {
			client.on(eventModule.name, listener);
		}

		console.log(`[EVENT LOADED] ${eventModule.name}`);
	}
}
