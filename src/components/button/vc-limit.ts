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

const vcLimit: BotComponent = {
	customId: /^vc-limit-\d+$/,
	execute: async (interaction: ButtonInteraction) => {
		const channelId = interaction.customId.split("-")[2];
		const channel = interaction.guild?.channels.cache.get(channelId);

		if (!channel?.isVoiceBased()) {
			return interaction.reply({
				content: "Voice channel not found.",
				flags: MessageFlags.Ephemeral,
			});
		}

		if (!channel.permissionsFor(interaction.user)?.has(PermissionFlagsBits.ManageChannels)) {
			return interaction.reply({
				content: "You don't have permission to control this channel.",
				flags: MessageFlags.Ephemeral,
			});
		}

		const modal = new ModalBuilder()
			.setCustomId(`vc_limit_modal_${channelId}`)
			.setTitle("Set User Limit");

		const limitInput = new TextInputBuilder()
			.setCustomId("limit")
			.setLabel("User Limit (0-99, 0 = unlimited)")
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
