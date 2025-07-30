import {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	ButtonInteraction,
} from "discord.js";
import type { BotComponent } from "@interfaces/botTypes.js";

const button: BotComponent = {
	customId: "ping_button",
	async execute(interaction: ButtonInteraction) {
		const modal = new ModalBuilder().setCustomId("ping_modal").setTitle("Üye Bilgileri");

		const nameInput = new TextInputBuilder()
			.setCustomId("name_input")
			.setLabel("Adınız")
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const ageInput = new TextInputBuilder()
			.setCustomId("age_input")
			.setLabel("Yaşınız")
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
		const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(ageInput);

		modal.addComponents(row1, row2);

		await interaction.showModal(modal);
	},
};

export default button;
