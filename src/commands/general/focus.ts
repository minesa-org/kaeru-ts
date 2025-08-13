import {
	ApplicationIntegrationType,
	AutoModerationActionType,
	AutoModerationRuleEventType,
	AutoModerationRuleTriggerType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextDisplayBuilder,
	GuildMember,
	PermissionsBitField,
} from "discord.js";
import { BotCommand } from "../../interfaces/botTypes.js";
import { getEmoji } from "../../utils/emojis.js";

const RULE_NAME = "Focused People";

const focusMode: BotCommand = {
	data: new SlashCommandBuilder()
		.setContexts(InteractionContextType.Guild)
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		.setName("focus")
		.setNameLocalizations({
			tr: "odak",
			"zh-CN": "专注",
			it: "concentrazione",
			"pt-BR": "foco",
		})
		.setDescription("Manage your focus mode")
		.setDescriptionLocalizations({
			tr: "Rahatsız edilmemek için odak modunu ayarla",
			"zh-CN": "设置免打扰模式",
			it: "Imposta la modalità di concentrazione",
			"pt-BR": "Ative o modo de foco para não ser mencionado",
		})
		.addSubcommand(sub =>
			sub
				.setName("set")
				.setNameLocalizations({
					tr: "ayarla",
					"zh-CN": "设置",
					it: "imposta",
					"pt-BR": "configurar",
				})
				.setDescription("Set focus mode on or off")
				.setDescriptionLocalizations({
					tr: "Odak modunu aç veya kapat",
					"zh-CN": "启用或禁用专注模式",
					it: "Attiva o disattiva la modalità concentrazione",
					"pt-BR": "Ativar ou desativar o modo foco",
				})
				.addBooleanOption(option =>
					option
						.setName("value")
						.setNameLocalizations({
							tr: "değer",
							"zh-CN": "值",
							it: "valore",
							"pt-BR": "valor",
						})
						.setDescription("Enable or disable")
						.setDescriptionLocalizations({
							tr: "Etkinleştir veya devre dışı bırak",
							"zh-CN": "启用或禁用",
							it: "Abilita o disabilita",
							"pt-BR": "Ativar ou desativar",
						})
						.setRequired(true),
				),
		)
		.addSubcommand(sub =>
			sub
				.setName("list")
				.setNameLocalizations({
					tr: "liste",
					"zh-CN": "列表",
					it: "lista",
					"pt-BR": "listar",
				})
				.setDescription("Show users in focus mode")
				.setDescriptionLocalizations({
					tr: "Odak modundaki kullanıcıları göster",
					"zh-CN": "显示正在专注模式的用户",
					it: "Mostra gli utenti in modalità concentrazione",
					"pt-BR": "Mostrar usuários no modo foco",
				}),
		)
		.addSubcommand(sub =>
			sub
				.setName("clear")
				.setNameLocalizations({
					tr: "temizle",
					"zh-CN": "清除",
					it: "pulisci",
					"pt-BR": "limpar",
				})
				.setDescription("Clear all users from focus mode")
				.setDescriptionLocalizations({
					tr: "Tüm kullanıcıları odak modundan çıkar",
					"zh-CN": "将所有用户移出专注模式",
					it: "Rimuovi tutti gli utenti dalla modalità concentrazione",
					"pt-BR": "Remover todos do modo foco",
				}),
		),

	execute: async (interaction: ChatInputCommandInteraction) => {
		const { guild, member, options, user } = interaction;
		const subcommand = options.getSubcommand();
		const mention = `<@${user.id}>`;

		// This command can be used in guild only but yeah
		if (!guild || !member) {
			return await interaction.reply({
				content: `${getEmoji("error")}`,
				flags: MessageFlags.Ephemeral,
			});
		}

		let rules = await guild.autoModerationRules.fetch();
		let rule = rules.find(r => r.name === RULE_NAME);

		if (!rule) {
			rule = await guild.autoModerationRules.create({
				name: RULE_NAME,
				eventType: AutoModerationRuleEventType.MessageSend,
				triggerType: AutoModerationRuleTriggerType.Keyword,
				triggerMetadata: { keywordFilter: [] },
				actions: [
					{
						type: AutoModerationActionType.BlockMessage,
						metadata: {
							customMessage: "⏾⋆.˚ This user is currently focusing. Please do not disturb.",
						},
					},
				],
				enabled: true,
				reason: "Initialized by focus system",
			});
		}

		const keywords = rule.triggerMetadata.keywordFilter || [];

		switch (subcommand) {
			case "set":
				const enable = options.getBoolean("value", true);
				const alreadySet = keywords.includes(mention);

				if (enable && alreadySet) {
					return await interaction.reply({
						content: `${getEmoji("info")} You're already in focus mode.`,
						flags: MessageFlags.Ephemeral,
					});
				}

				if (!enable && !alreadySet) {
					return await interaction.reply({
						content: `${getEmoji("info")} You're not in focus mode.`,
						flags: MessageFlags.Ephemeral,
					});
				}

				const updatedKeywords = enable
					? [...keywords, mention]
					: keywords.filter(k => k !== mention);

				await rule.edit({
					triggerMetadata: { keywordFilter: updatedKeywords },
				});

				return await interaction.reply({
					content: enable
						? `${getEmoji("reactions.kaeru.emphasize")} You’re now in focus mode.`
						: `${getEmoji("reactions.kaeru.emphasize")} Focus mode disabled.`,
					flags: MessageFlags.Ephemeral,
				});

			case "list":
				if (keywords.length === 0) {
					return await interaction.reply({
						content: "Nobody is focused right now.",
						flags: MessageFlags.Ephemeral,
					});
				}

				const usersList = keywords.map((m, i) => `${i + 1}. ${m}`).join("\n");

				const container = new ContainerBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(`# ${getEmoji("dnd")} Focused Users`),
						new TextDisplayBuilder().setContent(usersList),
					)
					.setAccentColor(0x5e5cde);

				return await interaction.reply({
					components: [container],
					flags: MessageFlags.IsComponentsV2,
					allowedMentions: {
						parse: [],
					},
				});

			case "clear":
				const perms =
					member instanceof GuildMember
						? member.permissions
						: new PermissionsBitField(BigInt(member.permissions as string));

				if (!perms.has(PermissionFlagsBits.ManageGuild)) {
					return await interaction.reply({
						content: `${getEmoji("error")} No, no, no... you don't have permission to use this command dear.`,
						flags: MessageFlags.Ephemeral,
					});
				}

				await rule?.edit({ triggerMetadata: { keywordFilter: [] } });
				return await interaction.reply({
					content: `${getEmoji("reactions.kaeru.thumbsup")} Focus mode cleared for everyone. Happy!`,
					flags: MessageFlags.Ephemeral,
				});
		}
	},
};

export default focusMode;
