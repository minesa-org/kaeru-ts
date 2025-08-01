import {
	StringSelectMenuInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} from "discord.js";
import type { BotComponent } from "@interfaces/botTypes.js";

const selectMenu: BotComponent = {
	customId: "create-ticket",
	async execute(interaction: StringSelectMenuInteraction) {
		const label = interaction.values[0] || "bug";

		const modal = new ModalBuilder()
			.setCustomId(`create-ticket-modal`)
			.setTitle(`Create a ${label.toUpperCase()} ticket`);

		const input = new TextInputBuilder()
			.setCustomId("ticket-title")
			.setLabel("Please explain your issue with a few words.")
			.setRequired(true)
			.setStyle(TextInputStyle.Short)
			.setPlaceholder("Cannot post memes")
			.setMinLength(5)
			.setMaxLength(80);

		modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
		await interaction.showModal(modal).catch(console.error);
	},
};

export default selectMenu;
