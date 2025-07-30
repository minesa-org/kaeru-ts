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
import { header, log, separator } from "@utils/colors.js";
import type { BotCommand, BotComponent } from "@interfaces/botTypes.js";

export type BotInteraction =
	| CommandInteraction
	| ButtonInteraction
	| StringSelectMenuInteraction
	| ModalSubmitInteraction;

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

export async function loadCommands(client: Client) {
	client.commands = new Collection();
	client.buttons = new Collection();
	client.selectMenus = new Collection();
	client.modals = new Collection();

	header("Loading Commands and Components");
	// Slash commands
	const commandsPath = path.join(process.cwd(), "src", "commands");
	const commandFiles = await getFiles(commandsPath);

	for (const filePath of commandFiles) {
		try {
			const module = await import(filePath);
			const component: BotCommand | BotComponent = module.default ?? module;

			if ("data" in component && "execute" in component) {
				client.commands.set(component.data.name, component);
				log("command", `		${component.data.name.toLowerCase()}`);
			} else {
				log("warning", `Invalid command at ${filePath}`);
			}
		} catch (err) {
			log("error", `Failed to load command at ${filePath}`, err);
		}
	}
	separator();

	// Buttons
	const buttonPath = path.join(process.cwd(), "src", "components", "button");
	const buttonFiles = await getFiles(buttonPath);

	for (const filePath of buttonFiles) {
		try {
			const module = await import(filePath);
			const component: BotComponent = module.default ?? module;

			if ("customId" in component && "execute" in component) {
				client.buttons.set(component.customId, component);
				log("button", `		${component.customId}`);
			} else {
				log("warning", `Invalid button at ${filePath}`);
			}
		} catch (err) {
			log("error", `Failed to load button at ${filePath}`, err);
		}
	}
	separator();

	// Modals
	const modalPath = path.join(process.cwd(), "src", "components", "modal");
	const modalFiles = await getFiles(modalPath);

	for (const filePath of modalFiles) {
		try {
			const module = await import(filePath);
			const component: BotComponent = module.default ?? module;

			if ("customId" in component && "execute" in component) {
				client.modals.set(component.customId, component);
				log("modal", `		${component.customId}`);
			} else {
				log("warning", `Invalid modal at ${filePath}`);
			}
		} catch (err) {
			log("error", `Failed to load modal at ${filePath}`, err);
		}
	}
	separator();

	// Select menus
	const selectMenuPath = path.join(process.cwd(), "src", "components", "select-menu");
	const selectMenuFiles = await getFiles(selectMenuPath);

	for (const filePath of selectMenuFiles) {
		try {
			const module = await import(filePath);
			const component: BotComponent = module.default ?? module;

			if ("customId" in component && "execute" in component) {
				client.selectMenus.set(component.customId, component);
				log("selectMenu", `	${component.customId}`);
			} else {
				log("warning", `Invalid select menu at ${filePath}`);
			}
		} catch (err) {
			log("error", `Failed to load select menu at ${filePath}`, err);
		}
	}
}

/**
 * Register all global commands
 */
export async function registerCommandsGlobally(client: Client, token: string, clientId: string) {
	if (!client.commands) throw new Error("client.commands not initialized");

	const rest = new REST({ version: "10" }).setToken(token);
	const payload = client.commands.map(cmd => cmd.data.toJSON());

	try {
		await rest.put(Routes.applicationCommands(clientId), { body: payload });
		log("info", "Successfully registered all global commands.");
	} catch (err) {
		log("error", "Failed to register global commands", err);
	}

	separator();
}
