import { StringSelectMenuInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import type { BotComponent } from "@interfaces/botTypes.js";

const selectMenu: BotComponent = {
	customId: "ping_select",
	async execute(interaction: StringSelectMenuInteraction) {
		const choice = interaction.values[0];

		const embed = new EmbedBuilder()
			.setTitle("Seçimin")
			.setDescription(`Sen **${choice.toUpperCase()}** seçtin.`)
			.setColor("Blurple");

		await interaction.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	},
};

export default selectMenu;
