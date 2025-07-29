import { Events, Client } from "discord.js";

export const name = Events.ClientReady;
export const once = true;

export function execute(client: Client) {
	console.log(`Kaeru is online as ${client.user?.tag}!`);
}
