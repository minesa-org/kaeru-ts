import type { Client, Collection, Events, CommandInteraction, Interaction } from "discord.js";

declare module "discord.js" {
	interface Client {
		commands: Collection<string, any>;
		events: Collection<string, any>;
	}
}
