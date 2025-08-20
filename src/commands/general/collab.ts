import {
	ActionRowBuilder,
	ApplicationIntegrationType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	InteractionContextType,
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

const SUPPORTED_EXTENSIONS = [
	".txt",
	".js",
	".ts",
	".py",
	".json",
	".css",
	".html",
	".md",
	".cpp",
	".rs",
];

const collabTogether: BotCommand = {
	data: new SlashCommandBuilder()
		.setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		.setName("collab")
		.setNameLocalizations({
			tr: "işbirliği",
			"zh-CN": "协作",
			it: "collabora",
			"pt-BR": "colaborar",
		})
		.setDescription("Share your file to collab with specific people")
		.setDescriptionLocalizations({
			tr: "Belirli kişilerle işbirliği yapmak için dosyanı paylaş",
			"zh-CN": "与特定人员协作共享你的文件",
			it: "Condividi il tuo file per collaborare con persone specifiche",
			"pt-BR": "Compartilhe seu arquivo para colaborar com pessoas específicas",
		})

		.addAttachmentOption(option =>
			option
				.setName("file")
				.setNameLocalizations({
					tr: "dosya",
					"zh-CN": "文件",
					it: "file",
					"pt-BR": "arquivo",
				})
				.setDescription("Text based files are supported (BETA)")
				.setDescriptionLocalizations({
					tr: "Metin tabanlı dosyalar desteklenir (BETA)",
					"zh-CN": "支持基于文本的文件（测试版）",
					it: "Sono supportati i file di testo (BETA)",
					"pt-BR": "Arquivos de texto são suportados (BETA)",
				})
				.setRequired(true),
		)
		.addBooleanOption(option =>
			option
				.setName("view")
				.setNameLocalizations({
					tr: "görünür",
					"zh-CN": "可见",
					it: "visibile",
					"pt-BR": "visível",
				})
				.setDescription("Is it viewable by non-collaborators?")
				.setDescriptionLocalizations({
					tr: "İşbirliği yapmayanlar tarafından görülebilir mi?",
					"zh-CN": "非协作者可以查看吗？",
					it: "È visibile ai non collaboratori?",
					"pt-BR": "É visível para não colaboradores?",
				})
				.setRequired(false),
		) as SlashCommandBuilder,

	execute: async (interaction: ChatInputCommandInteraction) => {
		const { options } = interaction;

		const file = options.getAttachment("file");
		const ext = SUPPORTED_EXTENSIONS.find(e => file?.name.endsWith(e));
		const isViewable = options.getBoolean("view") ?? false;

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

		interaction.client.fileCache.set(interaction.user.id, {
			text,
			ext,
			name: file!.name,
			isViewable,
			collaborators: [],
			owner: interaction.user.id,
		});

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
