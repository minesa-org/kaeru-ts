import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ChannelType,
	ContainerBuilder,
	ContextMenuCommandBuilder,
	InteractionContextType,
	MessageContextMenuCommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
	TextChannel,
	TextDisplayBuilder,
} from "discord.js";
import type { BotCommand } from "../../interfaces/botTypes.js";
import { getEmoji } from "../../utils/emojis.js";
import {
	containerTemplate,
	lockButtonRow,
	sendAlertMessage,
	ticketMenuRow,
} from "../../utils/export.js";

const quickTicket: BotCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Quick Ticket")
		.setNameLocalizations({
			it: "Biglietto Rapido",
			tr: "Hızlı Talep Formu",
			ro: "Bilet Rapid",
			el: "Γρήγορο Εισιτήριο",
			"zh-CN": "快速票证",
			"pt-BR": "Ingresso Rápido",
		})
		.setType(ApplicationCommandType.Message)
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
		.setContexts([InteractionContextType.Guild]),

	execute: async (interaction: MessageContextMenuCommandInteraction) => {
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});

		if (
			!interaction.guild?.members.me?.permissions.has([
				PermissionFlagsBits.ManageThreads,
				PermissionFlagsBits.CreatePrivateThreads,
			])
		) {
			return sendAlertMessage({
				interaction,
				content: `Let's be sure I have permission to __create private threads__.`,
				type: "error",
				tag: "Emoji Getting",
			});
		}

		const message = interaction.targetMessage;

		if (message.channel.isThread()) {
			return sendAlertMessage({
				interaction,
				content: `You can't create thread inside thread. Huh... w-what is going on?`,
				type: "error",
				tag: "Wait, what?",
				alertReaction: "reactions.kaeru.haha",
			});
		}

		if (!(interaction.channel instanceof TextChannel)) {
			throw new Error("This command must be used in a standard text channel.");
		}

		const textChannel = interaction.channel;

		const thread = await textChannel.threads.create({
			name: `— Quick-ticket by ${interaction.user.username}`,
			autoArchiveDuration: 60,
			type: ChannelType.PrivateThread,
			reason: `${interaction.user.username} opened a thread for support`,
			invitable: true,
		});

		await thread.send({
			components: [
				containerTemplate({
					tag: "Quick Ticket",
					description: [
						`<@${interaction.user.id}>, you have opened a quick-action for this message`,
						`> ${message.content}`,
						`> -# Jump to [message](${message.url})`,
						`- Message sent by __@${message.author?.username ?? "Unknown"}__`,
					],
					title: `${getEmoji("ticket.create")} Quick-Ticket Created`,
				}),
				ticketMenuRow,
				lockButtonRow,
			],
			flags: MessageFlags.IsComponentsV2,
		});

		return await interaction.editReply({
			content: `# ${getEmoji("ticket.created")} Created <#${thread.id}>\nNow, you can talk about your issue with our staff members or server members.`,
		});
	},
};

export default quickTicket;
