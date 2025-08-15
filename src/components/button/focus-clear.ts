import {
	ButtonInteraction,
	GuildMember,
	MessageFlags,
	PermissionFlagsBits,
	PermissionsBitField,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { getEmoji } from "../../utils/export.js";
import { RULE_NAME } from "../../commands/general/focus.js";

const focusClear: BotComponent = {
	customId: "focus-list-clear",

	execute: async (interaction: ButtonInteraction) => {
		const { member, guild } = interaction;

		if (!guild || !member) {
			return await interaction.reply({
				content: `${getEmoji("error")}`,
				flags: MessageFlags.Ephemeral,
			});
		}

		let rules = await guild.autoModerationRules.fetch();
		let rule = rules.find(r => r.name === RULE_NAME);

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
	},
};

export default focusClear;
