import type { Collection } from "discord.js";
import type {
	BotCommand,
	ButtonCommand,
	SelectMenuCommand,
	ModalCommand,
	BotEventHandler,
} from "../interfaces/botTypes.js";

declare module "discord.js" {
	interface Client {
		commands: Collection<string, BotCommand>;
		buttons: Collection<string, ButtonCommand>;
		selectMenus: Collection<string, SelectMenuCommand<any>>;
		modals: Collection<string, ModalCommand>;
		events: Collection<string, BotEventHandler<keyof import("discord.js").ClientEvents>>;
	}
}
