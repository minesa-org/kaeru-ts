import {
	AuditLogEvent,
	Events,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	time,
} from "discord.js";
import { emojis, getEmoji } from "@utils/emojis.js";
import { BotEventHandler } from "@interfaces/botTypes.js";

const threadUpdateEvent: BotEventHandler<Events.ThreadUpdate> = {
	name: Events.ThreadUpdate,
	once: false,
	execute: async (oldThread, newThread) => {
		if (newThread.ownerId !== newThread.client.user.id) return;

		const kaeru = await newThread.guild.members.fetch(newThread.client.user.id);
		if (!kaeru.permissions.has("ViewAuditLog")) return;

		const auditLogs = await newThread.guild.fetchAuditLogs({
			type: AuditLogEvent.ThreadUpdate,
		});
		const auditLog = auditLogs.entries.first();
		if (!auditLog) return;

		const { executor } = auditLog;
		if (!executor || executor.id === newThread.client.user.id) return;

		const formattedTime = time(new Date(), "R");

		/**
		 * Send a message to the thread
		 * @param emoji The emoji to use
		 * @param text The text to send
		 */
		const sendMessage = async (emoji: keyof typeof emojis, text: string) => {
			await newThread.send({
				components: [
					new TextDisplayBuilder().setContent(`# ${getEmoji(emoji)}`),
					new TextDisplayBuilder().setContent(`-# **<@!${executor.id}>** ${text} ${formattedTime}`),
					new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
				],
				flags: MessageFlags.IsComponentsV2,
				allowedMentions: { parse: [] },
			});
		};

		// Unlocked
		if (oldThread.locked && !newThread.locked) {
			await sendMessage(
				getEmoji("ticket.bubble.key") as keyof typeof emojis,
				"has __unlocked__ the thread",
			);
		}

		// Locked
		else if (!oldThread.locked && newThread.locked) {
			await sendMessage(
				getEmoji("ticket.bubble.lock") as keyof typeof emojis,
				"has __locked__ the thread",
			);
		}

		// Un-archived but still locked (staff-only reopen)
		else if (oldThread.archived && !newThread.archived && newThread.locked) {
			await sendMessage(
				getEmoji("ticket.bubble.reopen") as keyof typeof emojis,
				"has __re-opened__ the thread, but it is **staffs only**",
			);
		}

		// Un-archived
		else if (oldThread.archived && !newThread.archived) {
			await sendMessage(
				getEmoji("ticket.bubble.reopen") as keyof typeof emojis,
				"has __re-opened__ the thread",
			);
		}
	},
};

export default threadUpdateEvent;
