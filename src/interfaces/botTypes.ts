import type {
	CommandInteraction,
	ButtonInteraction,
	StringSelectMenuInteraction,
	ModalSubmitInteraction,
	ClientEvents,
	Awaitable,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	ChatInputCommandInteraction,
} from "discord.js";

// Command Interfaces
interface BaseCommand<I, D> {
	data: D;
	execute: (interaction: I) => Promise<any>;
}

export type SlashCommand = BaseCommand<ChatInputCommandInteraction, SlashCommandBuilder>;

export type MessageContextMenuCommand = BaseCommand<
	MessageContextMenuCommandInteraction,
	ContextMenuCommandBuilder
>;
export type UserContextMenuCommand = BaseCommand<
	UserContextMenuCommandInteraction,
	ContextMenuCommandBuilder
>;

export type BotCommand = SlashCommand | MessageContextMenuCommand | UserContextMenuCommand;

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

export type BotComponent = ButtonCommand | SelectMenuCommand | ModalCommand;
export type BotEventHandler<K extends keyof ClientEvents> = EventModule<K>;
