import {
	time,
	TextDisplayBuilder,
	SeparatorSpacingSize,
	SeparatorBuilder,
	MessageFlags,
	ModalSubmitInteraction,
	PermissionFlagsBits,
} from "discord.js";
import { getEmoji, sendAlertMessage } from "../../utils/export.js";
import { BotComponent } from "../../interfaces/botTypes.js";

const createTicketModal: BotComponent = {
	customId: "ticket-close-modal",

	execute: async (interaction: ModalSubmitInteraction): Promise<void> => {
		if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageThreads)) {
			return sendAlertMessage({
				interaction,
				content: `I cannot manage threads aka no closing.`,
				type: "error",
				tag: "Missing Permission",
				alertReaction: "danger",
			});
		}

		await interaction.deferReply();

		const closeReason = interaction.fields.getTextInputValue("close-reason");

		const formattedTime = time(new Date(), "R");

		await interaction.editReply({
			components: [
				new TextDisplayBuilder().setContent(`# ${getEmoji("ticket.bubble.close")}`),
				new TextDisplayBuilder().setContent(
					`-# **<@!${interaction.user.id}>** has __force closed__ the thread as completed ${formattedTime}`,
				),
				new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(false),
				new TextDisplayBuilder().setContent(["### Comment", `>>> ${closeReason}`].join("\n")),
				new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
			],
			flags: MessageFlags.IsComponentsV2,
			allowedMentions: {
				parse: [],
			},
		});

		if (!interaction.channel?.isThread()) {
			throw new Error(); // For condition
		}

		await interaction.channel.setLocked(true);
		await interaction.channel.setArchived(
			true,
			`${interaction.user.username} marked the ticket as completed with reason: ${closeReason}`,
		);
	},
};

export default createTicketModal;
