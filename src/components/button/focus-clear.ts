import {
	ButtonInteraction,
	GuildMember,
	MessageFlags,
	PermissionFlagsBits,
	PermissionsBitField,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { containerTemplate, getEmoji, sendAlertMessage } from "../../utils/export.js";
import { RULE_NAME } from "../../commands/general/focus.js";

const focusClear: BotComponent = {
	customId: "focus-list-clear",

	execute: async (interaction: ButtonInteraction) => {
		const { member, guild } = interaction;

		if (!guild || !member) {
			return await sendAlertMessage({
				interaction,
				content: getEmoji("error"),
				tag: "???",
			});
		}

		let rules = await guild.autoModerationRules.fetch();
		let rule = rules.find(r => r.name === RULE_NAME);

		const perms =
			member instanceof GuildMember
				? member.permissions
				: new PermissionsBitField(BigInt(member.permissions as string));

		if (!perms.has(PermissionFlagsBits.ManageGuild)) {
			return sendAlertMessage({
				interaction,
				content: `You, simply, cannot.`,
				type: "error",
				tag: "Missing Permission",
			});
		}

		await rule?.edit({ triggerMetadata: { keywordFilter: [] } });
		return await interaction.reply({
			components: [
				containerTemplate({
					tag: "Cleared Focused People",
					description: "Focus mode cleared for everyone. Happy!",
					title: getEmoji("reactions.kaeru.thumbsdown"),
				}),
			],
			flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
		});
	},
};

export default focusClear;
