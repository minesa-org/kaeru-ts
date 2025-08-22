import { Events, Client } from "discord.js";
import type { BotEventHandler } from "../interfaces/botTypes.js";
import chalk from "chalk";
import { log } from "../utils/export.js";
import { getMongooseConnection } from "../database/mongoose.js";

const readyEvent: BotEventHandler<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	execute: async (client: Client) => {
		log("info", chalk.hex("#A1887F").bold(`Kāru is ready! Logged in as ${client.user?.tag}`));

		const connection = getMongooseConnection();
		if (connection) {
			log("info", "Mongoose is connected and ready for use.");
		} else {
			log("error", "Mongoose connection is not established.");
		}
	},
};

export default readyEvent;
