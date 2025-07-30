import { Events, Client } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";
import chalk from "chalk";
import { getMongooseConnection } from "@database/mongoose.js";
import { log } from "@utils/colors.js";

const readyEvent: BotEventHandler<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		chalk.hex("#A1887F").bold(`Kaeru is ready! Logged in as ${client.user?.tag}`);

		const connection = getMongooseConnection();
		if (connection) {
			log("info", "Mongoose is connected and ready for use.");
		} else {
			log("error", "Mongoose connection is not established.");
		}
	},
};

export default readyEvent;
