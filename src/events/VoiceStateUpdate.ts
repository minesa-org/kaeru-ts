import { Events } from "discord.js";
import type { BotEventHandler } from "../interfaces/botTypes.js";

const readyEvent: BotEventHandler<Events.VoiceStateUpdate> = {
	name: Events.VoiceStateUpdate,
	once: false,
	execute: async (oldState, newState) => {
		
	},
};

export default readyEvent;
