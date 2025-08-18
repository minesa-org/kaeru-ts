import { ButtonInteraction, MessageFlags, PermissionFlagsBits } from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";

const vcLock: BotComponent = {
	customId: /^vc-lock-\d+$/,
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

		const everyoneRole = interaction.guild!.roles.everyone;
		const currentPerms = channel.permissionOverwrites.cache.get(everyoneRole.id);
		const isLocked = currentPerms?.deny.has(PermissionFlagsBits.Connect);

		await channel.permissionOverwrites.edit(everyoneRole, {
			Connect: isLocked ? null : false,
		});

		await interaction.reply({
			content: `Channel ${isLocked ? "unlocked" : "locked"}.`,
			flags: MessageFlags.Ephemeral,
		});
	},
};

export default vcLock;
