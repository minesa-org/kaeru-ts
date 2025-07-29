import fs from "fs";
import path from "path";
import {
	Client,
	Collection,
	CommandInteraction,
	ButtonInteraction,
	StringSelectMenuInteraction,
	ModalSubmitInteraction,
	Interaction,
	REST,
	Routes,
} from "discord.js";

export type BotInteraction =
	| CommandInteraction
	| ButtonInteraction
	| StringSelectMenuInteraction
	| ModalSubmitInteraction
	| Interaction;

export interface BotCommand {
	data: { name: string; toJSON: () => any };
	execute: (interaction: BotInteraction) => Promise<void>;
}

/**
 * Recursively get all files in a directory.
 */
async function getCommandFiles(dir: string): Promise<string[]> {
	let results: string[] = [];
	const list = fs.readdirSync(dir);

	for (const file of list) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			const nestedFiles = await getCommandFiles(filePath);
			results = results.concat(nestedFiles);
		} else if (file.endsWith(".ts") || file.endsWith(".js")) {
			results.push(filePath);
		}
	}

	return results;
}

/**
 * Load all commands from the `src/commands` directory and store them in the client's `commands` collection.
 */
export async function loadCommands(client: Client & { commands?: Collection<string, BotCommand> }) {
	client.commands = new Collection<string, BotCommand>();

	const commandsPath = path.join(process.cwd(), "src", "commands");
	const commandFiles = await getCommandFiles(commandsPath);

	for (const filePath of commandFiles) {
		try {
			const commandModule = await import(filePath);
			const command: BotCommand = commandModule.default ?? commandModule;

			if ("data" in command && "execute" in command) {
				client.commands.set(command.data.name, command);
				console.log(`[COMMAND LOADED] ${command.data.name} from ${filePath}`);
			} else {
				console.warn(`[WARNING] Invalid command at ${filePath}`);
			}
		} catch (error) {
			console.error(`[ERROR] Failed to load command at ${filePath}`, error);
		}
	}
}

/**
 * Register all commands globally.
 */
export async function registerCommandsGlobally(
	client: Client & { commands?: Collection<string, BotCommand> },
	token: string,
	clientId: string,
) {
	if (!client.commands) {
		throw new Error("Commands not loaded yet.");
	}

	const rest = new REST({ version: "10" }).setToken(token);
	const commandsPayload = client.commands.map(cmd => cmd.data.toJSON());

	try {
		console.log("Registering global commands...");
		await rest.put(Routes.applicationCommands(clientId), { body: commandsPayload });
		console.log("Successfully registered all global commands.");
	} catch (error) {
		console.error("Failed to register commands:", error);
	}
}
