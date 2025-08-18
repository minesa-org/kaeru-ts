import { MessageFlags, ModalSubmitInteraction, PermissionFlagsBits } from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";

const vcLimitModal: BotComponent = {
	customId: /^vc_limit_modal_\d+$/,
	execute: async (interaction: ModalSubmitInteraction) => {
		const channelId = interaction.customId.split("_")[3];
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

		const limitStr = interaction.fields.getTextInputValue("limit");
		const limit = parseInt(limitStr);

		if (isNaN(limit) || limit < 0 || limit > 99) {
			return interaction.reply({
				content: "Invalid limit. Must be 0-99.",
				flags: MessageFlags.Ephemeral,
			});
		}

		await channel.setUserLimit(limit);

		await interaction.reply({
			content: `User limit set to ${limit === 0 ? "unlimited" : limit}.`,
			flags: MessageFlags.Ephemeral,
		});
	},
};

export default vcLimitModal;
