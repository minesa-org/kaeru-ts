import {
	MessageFlags,
	ModalSubmitInteraction,
	PermissionFlagsBits,
	TextDisplayBuilder,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";
import { getEmoji } from "../../utils/emojis.js";

const vcLimitModal: BotComponent = {
	customId: /^vc_limit_modal_\d+$/,
	execute: async (interaction: ModalSubmitInteraction) => {
		const channelId = interaction.customId.split("_")[3];
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

		const limitStr = interaction.fields.getTextInputValue("limit");
		const limit = parseInt(limitStr);

		if (isNaN(limit) || limit < 0 || limit > 99) {
			return sendErrorMessage(
				interaction,
				"Invalid. Between 1-99 or 0 for unlimited... Didn't you read placeholder?",
			);
		}

		await channel.setUserLimit(limit);
		const text = new TextDisplayBuilder().setContent(
			`# ${getEmoji("number_point")} Updated user limit\nUser limit set to ${limit === 0 ? "unlimited" : limit}.`,
		);

		await interaction.reply({
			components: [text],
			flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
		});
	},
};

export default vcLimitModal;
