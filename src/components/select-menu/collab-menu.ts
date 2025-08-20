import {
	UserSelectMenuInteraction,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SectionBuilder,
	ThumbnailBuilder,
	MessageFlags,
	SeparatorSpacingSize,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";
import { emojis, getEmoji } from "../../utils/emojis.js";

const collabSelectMenu: BotComponent = {
	customId: "collab_menu",
	execute: async (interaction: UserSelectMenuInteraction) => {
		const fileData = interaction.client.fileCache.get(interaction.user.id);
		if (!fileData) {
			return sendErrorMessage(interaction, "File data not found. Please try again.");
		}

		const collaborators = interaction.values;
		fileData.collaborators = collaborators;

		const collabKey = `${interaction.user.id}_${Date.now()}`;
		interaction.client.fileCache.set(collabKey, fileData);

		const collaboratorMentions = collaborators.map(id => `- <@${id}>`).join("\n");

		const buttons = [
			new ButtonBuilder()
				.setCustomId(`collab_edit_${collabKey}`)
				.setLabel("Edit File")
				.setStyle(ButtonStyle.Secondary)
				.setEmoji(emojis.pencil),
			new ButtonBuilder()
				.setCustomId(`collab_view_${collabKey}`)
				.setLabel("View File")
				.setStyle(ButtonStyle.Secondary)
				.setEmoji(emojis.eye),
		];

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(`-# ${getEmoji("people")} Collaboration+`),
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								`## Collaboration Setup Complete!`,
								`File shared by <@${fileData.owner}>.`,
								`### File:\n\`${fileData.name}\``,
								`### Viewable by everyone:\n${fileData.isViewable ? "Yes" : "No"}`,
								`### Collaborators:\n${collaboratorMentions}`,
								``,
								fileData.isViewable
									? `-# ${getEmoji("reactions.user.emphasize")} Everyone can view this file, but only collaborators can edit it.`
									: `-# ${getEmoji("reactions.user.emphasize")} Only collaborators can view and edit this file.`,
							].join("\n"),
						),
					)
					.setThumbnailAccessory(
						new ThumbnailBuilder().setURL(
							"https://media.discordapp.net/attachments/736571695170584576/1407664558323007518/Frame_15.png?ex=68a6ed47&is=68a59bc7&hm=40e37f945a9bbbb7d65870c2010648548b25bd552ea182b8065162386945e8b6&=&format=webp&quality=lossless&width=614&height=610",
						),
					),
			);

		await interaction.update({
			components: [
				new TextDisplayBuilder().setContent(
					`# ${getEmoji("reactions.kaeru.heart")}\n-# ${getEmoji("document")} Collaboration thread created for **${fileData.name}** file.`,
				),
			],
		});

		const channel = interaction.channel;
		if (!channel || !channel.isTextBased() || channel.isDMBased()) {
			return sendErrorMessage(interaction, "Cannot create thread in this channel.");
		}
		if (channel.type !== 0) {
			return sendErrorMessage(interaction, "You can only collaborate in text channels");
		}

		const followUpMessage = await interaction.followUp({
			components: [container, actionRow],
			flags: MessageFlags.IsComponentsV2,
			allowedMentions: {
				parse: [],
			},
		});

		const thread = await followUpMessage.startThread({
			name: `✎ ${fileData.name} - Collaboration`,
			autoArchiveDuration: 60,
			reason: `Collaboration thread for ${fileData.name}`,
		});

		fileData.threadId = thread.id;
		interaction.client.fileCache.set(collabKey, fileData);

		await thread.members.add(fileData.owner);
		for (const userId of collaborators) {
			try {
				await thread.members.add(userId);
			} catch (error) {
				console.log(`Failed to add user ${userId} to thread:`, error);
			}
		}

		await thread.send({
			components: [
				new TextDisplayBuilder().setContent(`-# All file changes will be logged here.`),
				new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large),
				new TextDisplayBuilder().setContent(
					`## ${getEmoji("banner")} Collaboration logs starts at here for **${fileData.name}**!`,
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};

export default collabSelectMenu;
