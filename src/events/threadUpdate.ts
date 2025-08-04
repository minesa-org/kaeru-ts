import {
	AuditLogEvent,
	Events,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	time,
	ThreadChannel,
	GuildAuditLogsEntry,
	GuildMember,
} from "discord.js";
import { emojis, getEmoji } from "@utils/emojis.js";
import { BotEventHandler } from "@interfaces/botTypes.js";

const threadUpdateEvent: BotEventHandler<Events.ThreadUpdate> = {
	name: Events.ThreadUpdate,
	once: false,
	execute: async (oldThread: ThreadChannel, newThread: ThreadChannel) => {
		const clientUserId = newThread.client.user?.id;
		if (!clientUserId || newThread.ownerId !== clientUserId) return;

		const guild = newThread.guild;
		const botMember: GuildMember = await guild.members.fetch(clientUserId);
		if (!botMember.permissions.has("ViewAuditLog")) return;

		const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.ThreadUpdate });
		const auditLog: GuildAuditLogsEntry | undefined = auditLogs.entries.first();
		if (!auditLog || !auditLog.executor || auditLog.executor.id === clientUserId) return;

		const formattedTime = time(new Date(), "R");

		const sendMessage = async (
			emojiKey: keyof (typeof emojis)["ticket"]["bubble"],
			text: string,
		): Promise<void> => {
			const emoji = getEmoji(`ticket.bubble.${emojiKey}`) as string;

			await newThread.send({
				components: [
					new TextDisplayBuilder().setContent(`# ${emoji}`),
					new TextDisplayBuilder().setContent(
						`-# **<@!${auditLog.executor!.id}>** ${text} ${formattedTime}`,
					),
					new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
				],
				flags: MessageFlags.IsComponentsV2,
				allowedMentions: { parse: [] },
			});
		};

		if (oldThread.locked && !newThread.locked) {
			await sendMessage("key", "has __unlocked__ the thread");
		} else if (!oldThread.locked && newThread.locked) {
			await sendMessage("lock", "has __locked__ the thread");
		} else if (oldThread.archived && !newThread.archived && newThread.locked) {
			await sendMessage("reopen", "has __re-opened__ the thread, but it is **staffs only**");
		} else if (oldThread.archived && !newThread.archived) {
			await sendMessage("reopen", "has __re-opened__ the thread");
		}
	},
};

export default threadUpdateEvent;
