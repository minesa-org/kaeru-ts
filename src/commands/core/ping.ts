import {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	MessageFlags,
} from "discord.js";
import type { BotCommand } from "@interfaces/botTypes.js";

const pingCommand: BotCommand = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Ping butonunu gösterir."),

	execute: async (interaction: CommandInteraction) => {
		const button = new ButtonBuilder()
			.setCustomId("ping_button")
			.setLabel("Ping")
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.reply({
			content: "Butona tıklarsan bir modal açılacak.",
			components: [row],
			flags: MessageFlags.Ephemeral,
		});
	},
};

export default pingCommand;
