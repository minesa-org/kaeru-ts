import fs from "fs";
import path from "path";
import {
	Client,
	Collection,
	CommandInteraction,
	ButtonInteraction,
	StringSelectMenuInteraction,
	ModalSubmitInteraction,
	REST,
	Routes,
} from "discord.js";
import type { BotCommand, BotComponent } from "@interfaces/botTypes.js";

export type BotInteraction =
	| CommandInteraction
	| ButtonInteraction
	| StringSelectMenuInteraction
	| ModalSubmitInteraction;

/**
 * Recursively get all files in a directory
 */
export async function getFiles(dir: string): Promise<string[]> {
	let results: string[] = [];
	const list = fs.readdirSync(dir);

	for (const file of list) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			results = results.concat(await getFiles(filePath));
		} else if (file.endsWith(".ts") || file.endsWith(".js")) {
			results.push(filePath);
		}
	}
	return results;
}

/**
 * Load all commands and components
 */
export async function loadCommands(client: Client) {
	client.commands = new Collection();
	client.buttons = new Collection();
	client.selectMenus = new Collection();
	client.modals = new Collection();

	// Loading commands
	const commandsPath = path.join(process.cwd(), "src", "commands");
	const commandFiles = await getFiles(commandsPath);

	for (const filePath of commandFiles) {
		try {
			const module = await import(filePath);
			const component: BotCommand | BotComponent = module.default ?? module;

			if ("data" in component && "execute" in component) {
				client.commands.set(component.data.name, component);
				console.log(`[COMMAND LOADED] : ${component.data.name}`);
			} else {
				console.warn(`[SKIP] Invalid command at ${filePath}`);
			}
		} catch (err) {
			console.error(`[ERROR] Failed to load command at ${filePath}`, err);
		} finally {
			console.log(`------------------------------------------`);
		}
	}

	// Loading components - Buttons
	const buttonPath = path.join(process.cwd(), "src", "components", "button");
	const buttonFiles = await getFiles(buttonPath);

	for (const filePath of buttonFiles) {
		try {
			const module = await import(filePath);
			const component: BotComponent = module.default ?? module;

			if ("customId" in component && "execute" in component) {
				client.buttons.set(component.customId, component);
				console.log(`[COMPONENT LOADED] Button: ${component.customId}`);
			} else {
				console.warn(`[SKIP] Invalid button at ${filePath}`);
			}
		} catch (err) {
			console.error(`[ERROR] Failed to load button at ${filePath}`, err);
		} finally {
			console.log(`------------------------------------------`);
		}
	}

	// Loading components - modals
	const modalPath = path.join(process.cwd(), "src", "components", "modal");
	const modalFiles = await getFiles(modalPath);

	for (const filePath of modalFiles) {
		try {
			const module = await import(filePath);
			const component: BotComponent = module.default ?? module;

			if ("customId" in component && "execute" in component) {
				client.modals.set(component.customId, component);
				console.log(`[COMPONENT LOADED] Modal: ${component.customId}`);
			} else {
				console.warn(`[SKIP] Invalid modal at ${filePath}`);
			}
		} catch (err) {
			console.error(`[ERROR] Failed to load modal at ${filePath}`, err);
		} finally {
			console.log(`------------------------------------------`);
		}
	}

	// Loading components - select menus
	const selectMenuPath = path.join(process.cwd(), "src", "components", "select-menu");
	const selectMenuFiles = await getFiles(selectMenuPath);

	for (const filePath of selectMenuFiles) {
		try {
			const module = await import(filePath);
			const component: BotComponent = module.default ?? module;

			if ("customId" in component && "execute" in component) {
				client.selectMenus.set(component.customId, component);
				console.log(`[COMPONENT LOADED] Select Menu: ${component.customId}`);
			} else {
				console.warn(`[SKIP] Invalid select menu at ${filePath}`);
			}
		} catch (err) {
			console.error(`[ERROR] Failed to load select menu at ${filePath}`, err);
		} finally {
			console.log(`------------------------------------------`);
		}
	}
}

/**
 * Register all commands globally
 */
export async function registerCommandsGlobally(client: Client, token: string, clientId: string) {
	if (!client.commands) throw new Error("client.commands not initialized");

	const rest = new REST({ version: "10" }).setToken(token);
	const payload = client.commands.map(cmd => cmd.data.toJSON());

	try {
		console.log("Registering global commands...");
		await rest.put(Routes.applicationCommands(clientId), { body: payload });
		console.log("Successfully registered all global commands.");
	} catch (err) {
		console.error("[ERROR] Failed to register global commands:", err);
	}
}
