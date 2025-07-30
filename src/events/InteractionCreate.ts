import { MessageFlags, type Interaction } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";

const interactionCreate: BotEventHandler<"interactionCreate"> = {
	name: "interactionCreate",
	once: false,
	async execute(interaction: Interaction) {
		try {
			if (interaction.isCommand()) {
				// Slash commands handler
				const command = interaction.client.commands?.get(interaction.commandName);
				if (!command) {
					console.warn(`[WARN] No command handler found for command: ${interaction.commandName}`);
					return;
				}
				await command.execute(interaction);
				return;
			}

			if (interaction.isButton()) {
				// Button components handler
				const buttonHandler = interaction.client.buttons.get(interaction.customId);
				if (!buttonHandler) {
					console.warn(`[WARN] No button handler found for button: ${interaction.customId}`);
					return;
				}
				await buttonHandler.execute(interaction);
				return;
			}

			if (interaction.isStringSelectMenu()) {
				// Select menu handler
				const selectHandler = interaction.client.selectMenus.get(interaction.customId);
				if (!selectHandler) {
					console.warn(`[WARN] No select menu handler found for menu: ${interaction.customId}`);
					return;
				}
				await selectHandler.execute(interaction);
				return;
			}

			if (interaction.isModalSubmit()) {
				// Modal submit handler
				const modalHandler = interaction.client.modals.get(interaction.customId);
				if (!modalHandler) {
					console.warn(`[WARN] No modal handler found for modal: ${interaction.customId}`);
					return;
				}
				await modalHandler.execute(interaction);
				return;
			}
		} catch (error) {
			console.error(`[ERROR] Failed executing interaction:`, error);
			if (interaction.isRepliable() && !interaction.replied) {
				await interaction.reply({
					content: "Something went wrong while executing your interaction.",
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};

export default interactionCreate;
