import {
	UserSelectMenuInteraction,
	PermissionFlagsBits,
	MessageFlags,
	GuildMember,
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";

const vcKickSelect: BotComponent = {
	customId: "vc_kick_select",
	execute: async (interaction: UserSelectMenuInteraction) => {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const member = interaction.member as GuildMember;
		const channel = member.voice.channel;
		if (!channel) {
			await sendErrorMessage(
				interaction,
				"Voice channel! Where are you!?",
				"reactions.user.question",
			);
			return;
		}

		if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) {
			await sendErrorMessage(interaction, "No permission, give me permission!");
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

		const container = new ContainerBuilder()
			.addTextDisplayComponents(new TextDisplayBuilder().setContent("-# Kicked && Blacklisted"))
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					kickedMembers.length > 0
						? [`# Bye bye...`, `- ${kickedMembers.join("\n- ")}`].join("\n")
						: [
								`# No members were kicked`,
								`Did you just try to kick someone not in the channel?`,
							].join("\n"),
				),
			);

		await interaction.editReply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
		});

		return;
	},
};

export default vcKickSelect;
