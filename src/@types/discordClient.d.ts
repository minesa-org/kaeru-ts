import type { Client, Collection } from "discord.js";
import type {
	BaseCommand,
	ButtonCommand,
	SelectMenuCommand,
	ModalCommand,
	EventHandler,
} from "@interfaces/botTypes.ts";

declare module "discord.js" {
	interface Client {
		commands: Collection<string, BaseCommand>;
		buttons: Collection<string, ButtonCommand>;
		selectMenus: Collection<string, SelectMenuCommand>;
		modals: Collection<string, ModalCommand>;
		events: Collection<string, EventHandler<keyof import("discord.js").ClientEvents>>;
	}
}
