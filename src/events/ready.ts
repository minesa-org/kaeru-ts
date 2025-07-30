import { Events, Client } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";

const readyEvent: BotEventHandler<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		console.log(`${client.user?.tag} hazır!`);
	},
};

export default readyEvent;
