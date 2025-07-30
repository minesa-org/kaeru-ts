import type {
	CommandInteraction,
	ButtonInteraction,
	StringSelectMenuInteraction,
	ModalSubmitInteraction,
	ClientEvents,
	Awaitable,
} from "discord.js";

// Command Interfaces
interface BaseCommand {
	data: {
		name: string;
		description?: string;
		toJSON: () => any;
	};
	execute: (interaction: CommandInteraction) => Promise<void>;
}

interface SlashCommand extends BaseCommand {}
interface UserCommand extends BaseCommand {}
interface MessageCommand extends BaseCommand {}

// Component Interfaces
interface BaseComponent<TInteraction> {
	customId: string;
	execute: (interaction: TInteraction) => Promise<void>;
}

interface ButtonCommand extends BaseComponent<ButtonInteraction> {}
interface SelectMenuCommand extends BaseComponent<StringSelectMenuInteraction> {}
interface ModalCommand extends BaseComponent<ModalSubmitInteraction> {}

// Event Handler Interface
export interface EventModule<K extends keyof ClientEvents = keyof ClientEvents> {
	name: K extends keyof ClientEvents ? K : keyof ClientEvents;
	once?: boolean;
	execute: (...args: ClientEvents[K]) => Awaitable<void>;
}

export type BotCommand = SlashCommand | UserCommand | MessageCommand;
export type BotComponent = ButtonCommand | SelectMenuCommand | ModalCommand;
export type BotEventHandler<K extends keyof ClientEvents> = EventModule<K>;
