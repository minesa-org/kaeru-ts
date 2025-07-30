import { Events, Client } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";
import chalk from "chalk";

const readyEvent: BotEventHandler<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		chalk.hex("#A1887F").bold(`Kaeru is ready! Logged in as ${client.user?.tag}`);
	},
};

export default readyEvent;
