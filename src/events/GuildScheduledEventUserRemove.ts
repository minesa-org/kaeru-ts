import { Events } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";

const guildScheduledUserRemoveEvent: BotEventHandler<Events.GuildScheduledEventUserRemove> = {
	name: Events.GuildScheduledEventUserRemove,
	once: false,
	execute: async (guildScheduledEvent, user) => {},
};

export default guildScheduledUserRemoveEvent;
