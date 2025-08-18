import {
	ButtonInteraction,
	MessageFlags,
	PermissionFlagsBits,
	SeparatorBuilder,
	TextDisplayBuilder,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";
import { getEmoji } from "../../utils/emojis.js";

const vcLock: BotComponent = {
	customId: /^vc-lock-\d+$/,
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

		const everyoneRole = interaction.guild!.roles.everyone;
		const currentPerms = channel.permissionOverwrites.cache.get(everyoneRole.id);
		const isLocked = currentPerms?.deny.has(PermissionFlagsBits.Connect);

		await channel.permissionOverwrites.edit(everyoneRole, {
			Connect: isLocked ? null : false,
		});

		const text = new TextDisplayBuilder().setContent(
			`# ${isLocked ? getEmoji("ticket.bubble.key") : getEmoji("ticket.bubble.lock")}\n### Channel ${isLocked ? "unlocked" : "locked"}.`,
		);

		await interaction.reply({
			components: [text],
			flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
		});
	},
};

export default vcLock;
