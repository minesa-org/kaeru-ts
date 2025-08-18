import {
	ActionRowBuilder,
	ButtonInteraction,
	UserSelectMenuBuilder,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";

export const vcKickButton: BotComponent = {
	customId: /^vc-kick-\d+$/,
	execute: async (interaction: ButtonInteraction) => {
		try {
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

			const members = Array.from(channel.members.values());

			if (members.length === 0) {
				return interaction.reply({
					content: "No members to kick.",
					flags: MessageFlags.Ephemeral,
				});
			}

			const selectMenu = new UserSelectMenuBuilder()
				.setCustomId(`vc_kick_select`)
				.setPlaceholder("Select members to kick")
				.setMinValues(1)
				.setMaxValues(Math.min(members.length, 25));

			const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(selectMenu);

			await interaction.reply({
				content: "Select members to kick:",
				components: [row],
				flags: MessageFlags.Ephemeral,
			});
		} catch (err) {
			console.error("vcKickButton error:", err);
			if (!interaction.replied && !interaction.deferred) {
				await interaction.reply({
					content: "An error occurred.",
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.followUp({
					content: "An error occurred.",
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};

export default vcKickButton;
