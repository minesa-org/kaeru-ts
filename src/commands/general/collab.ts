import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MessageFlags,
	SectionBuilder,
	SeparatorBuilder,
	SlashCommandBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
	UserSelectMenuBuilder,
} from "discord.js";
import { BotCommand } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";
import { getEmoji } from "../../utils/emojis.js";

const SUPPORTED_EXTENSIONS = [".txt", ".js", ".ts", ".py", ".json", ".css", ".html", ".md"];

const collabTogether: BotCommand = {
	data: new SlashCommandBuilder()
		.setName("collab")
		.setDescription("Share your file to collab with specific people")
		.addAttachmentOption(option =>
			option
				.setName("file")
				.setDescription("Text based files are supported (BETA)")
				.setRequired(true),
		)
		.addBooleanOption(option =>
			option
				.setName("view")
				.setDescription("Is it viewable by non-collaborators?")
				.setRequired(false),
		) as SlashCommandBuilder,

	execute: async (interaction: ChatInputCommandInteraction) => {
		const { options } = interaction;

		const file = options.getAttachment("file");
		const ext = SUPPORTED_EXTENSIONS.find(e => file?.name.endsWith(e));

		const isViewable = options.getBoolean("view");

		if (!ext) {
			return sendErrorMessage(
				interaction,
				`Unsupported file type. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`,
			);
		}

		const response = await fetch(file!.url);
		const text = await response.text();

		if (text.length > 4000) {
			return sendErrorMessage(interaction, "File too large. Max **4000** characters for now.");
		}

		interaction.client.fileCache.set(interaction.user.id, { text, ext, name: file!.name });

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(`-# ${getEmoji("people")} Collaborate with People`),
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								`# Welcome to collab onboarding!`,
								`Here you can select members to collab with your file. Other's will not able to edit or view file.`,
							].join("\n"),
						),
					)
					.setThumbnailAccessory(
						new ThumbnailBuilder().setURL(
							"https://media.discordapp.net/attachments/736571695170584576/1407664558323007518/Frame_15.png?ex=68a6ed47&is=68a59bc7&hm=40e37f945a9bbbb7d65870c2010648548b25bd552ea182b8065162386945e8b6&=&format=webp&quality=lossless&width=614&height=610",
						),
					),
			)
			.addActionRowComponents(
				new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
					new UserSelectMenuBuilder()
						.setCustomId("collab_menu")
						.setPlaceholder("Select members to collaborate with...")
						.setMaxValues(10)
						.setMinValues(1),
				),
			);

		return interaction.reply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
		});
	},
};

export default collabTogether;
