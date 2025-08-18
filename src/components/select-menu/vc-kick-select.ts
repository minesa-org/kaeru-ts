import {
	UserSelectMenuInteraction,
	PermissionFlagsBits,
	MessageFlags,
	GuildMember,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";

const vcKickSelect: BotComponent = {
	customId: "vc_kick_select",
	execute: async (interaction: UserSelectMenuInteraction) => {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const member = interaction.member as GuildMember;
		const channel = member.voice.channel;
		if (!channel) {
			await interaction.editReply({
				content: "You are not in a voice channel.",
			});
			return;
		}

		if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) {
			await interaction.editReply({
				content: "Bot doesn't have permission to manage channel permissions.",
			});
			return;
		}

		const kickedMembers: string[] = [];

		for (const userId of interaction.values) {
			try {
				const target = await interaction.guild.members.fetch(userId);
				if (!target || target.voice.channelId !== channel.id) continue;

				await target.voice.setChannel(null);

				await channel.permissionOverwrites.edit(target, {
					Connect: false,
				});

				kickedMembers.push(target.displayName);
			} catch (err) {
				console.error(`Failed to kick/blacklist ${userId}:`, err);
			}
		}

		await interaction.editReply({
			content:
				kickedMembers.length > 0
					? `Kicked & blacklisted: ${kickedMembers.join(", ")}`
					: "No members were kicked.",
		});
	},
};

export default vcKickSelect;
