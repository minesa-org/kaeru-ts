import { Events } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";

const guildScheduledUserAddEvent: BotEventHandler<Events.GuildScheduledEventUserAdd> = {
	name: Events.GuildScheduledEventUserAdd,
	once: false,
	execute: async (guildScheduledEvent, user) => {},
};

export default guildScheduledUserAddEvent;
