import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";

const vcLimit: BotComponent = {
	customId: /^vc-limit-\d+$/,
	execute: async (interaction: ButtonInteraction) => {
		const channelId = interaction.customId.split("-")[2];
		const channel = interaction.guild?.channels.cache.get(channelId);

		if (!channel?.isVoiceBased()) {
			return sendErrorMessage(interaction, "Voice channel is not found, impossible!", "error");
		}

		if (!channel.permissionsFor(interaction.user)?.has(PermissionFlagsBits.ManageChannels)) {
			return sendErrorMessage(
				interaction,
				"Is your name channel's name? yeah it's not.\n-# Don't do something crazy to change your name to channel's name. :D",
				"reactions.kaeru.question",
			);
		}

		const modal = new ModalBuilder()
			.setCustomId(`vc_limit_modal_${channelId}`)
			.setTitle("Set User Limit");

		const limitInput = new TextInputBuilder()
			.setCustomId("limit")
			.setLabel("✦ Please enter user limit")
			.setPlaceholder("Between 1-99, 0 for unlimited")
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(2)
			.setRequired(true);

		const row = new ActionRowBuilder<TextInputBuilder>().addComponents(limitInput);
		modal.addComponents(row);

		await interaction.showModal(modal);
	},
};

export default vcLimit;
