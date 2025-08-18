import {
	ActionRowBuilder,
	ButtonInteraction,
	UserSelectMenuBuilder,
	PermissionFlagsBits,
	MessageFlags,
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SectionBuilder,
	ThumbnailBuilder,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";

export const vcKickButton: BotComponent = {
	customId: /^vc-kick-\d+$/,
	execute: async (interaction: ButtonInteraction) => {
		try {
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

			const members = Array.from(channel.members.values());

			if (members.length === 0 || members.length === 1) {
				return sendErrorMessage(
					interaction,
					"Umm... are you trying to... kick Natalia, lol\n> Nice one asdkalsjd, Natalia from MLBB haha",
					"reactions.kaeru.haha",
					0xac8e68,
				);
			}

			const selectMenu = new UserSelectMenuBuilder()
				.setCustomId(`vc_kick_select`)
				.setPlaceholder("Select members to kick")
				.setMinValues(1)
				.setMaxValues(Math.min(members.length, 25));

			const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(selectMenu);

			const container = new ContainerBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(`-# Kicking Member Out of Channel`),
				)
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addSectionComponents(
					new SectionBuilder()
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								"Select members from menu to **kick** and **blacklist** for this private chat",
							),
						)
						.setThumbnailAccessory(
							new ThumbnailBuilder().setURL(
								"https://media.discordapp.net/attachments/736571695170584576/1407092130215887040/Frame_15.png?ex=68a4d82a&is=68a386aa&hm=2ea7073543f643e9ce96fd6a54bd9b5bc9005234fe76fbf09fbf4d759fb7a15c&=&width=614&height=610",
							),
						),
				);

			return interaction.reply({
				components: [container, row],
				flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
			});
		} catch (err) {
			console.error("vcKickButton error:", err);
			return interaction.reply({
				content: "An error occurred.",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};

export default vcKickButton;
