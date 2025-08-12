import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	StringSelectMenuInteraction,
} from "discord.js";
import type { BotComponent } from "../../interfaces/botTypes.js";

const createTicketSelectMenu: BotComponent = {
	customId: "ticket-create",

	execute: async (interaction: StringSelectMenuInteraction): Promise<void> => {
		const label = interaction.values[0] || "bug";

		const modal = new ModalBuilder()
			.setCustomId(`ticket-create-modal|label-${label}`)
			.setTitle("Ticket creation");

		const messageInput = new TextInputBuilder()
			.setCustomId("message")
			.setLabel("Please describe your issue in detail")
			.setRequired(true)
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder("I am trying to tap the '+' icon, but I can't upload files?")
			.setMinLength(20)
			.setMaxLength(800);

		modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput));

		await interaction.showModal(modal).catch(console.error);
	},
};

export default createTicketSelectMenu;
