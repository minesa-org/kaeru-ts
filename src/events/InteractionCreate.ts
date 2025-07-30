import { MessageFlags, type Interaction } from "discord.js";
import type { BotEventHandler } from "@interfaces/botTypes.js";
import { log } from "@utils/colors.js";

const interactionCreate: BotEventHandler<"interactionCreate"> = {
	name: "interactionCreate",
	once: false,
	execute: async (interaction: Interaction) => {
		try {
			if (interaction.isContextMenuCommand()) {
				// Context menu commands handler
				const command = interaction.client.commands?.get(interaction.commandName);
				if (!command) {
					log("warning", `No context menu command handler found for: ${interaction.commandName}`);
					return;
				}
				await command.execute(interaction);
				return;
			}

			if (interaction.isCommand()) {
				// Slash commands handler
				const command = interaction.client.commands?.get(interaction.commandName);
				if (!command) {
					log("warning", `No slash command handler found for: ${interaction.commandName}`);
					return;
				}
				await command.execute(interaction);
				return;
			}

			if (interaction.isButton()) {
				// Button components handler
				const buttonHandler = interaction.client.buttons.get(interaction.customId);
				if (!buttonHandler) {
					log("warning", `No button handler found for button: ${interaction.customId}`);
					return;
				}
				await buttonHandler.execute(interaction);
				return;
			}

			if (interaction.isStringSelectMenu()) {
				// Select menu handler
				const selectHandler = interaction.client.selectMenus.get(interaction.customId);
				if (!selectHandler) {
					log("warning", `No select menu handler found for select menu: ${interaction.customId}`);
					return;
				}
				await selectHandler.execute(interaction);
				return;
			}

			if (interaction.isModalSubmit()) {
				// Modal submit handler
				const modalHandler = interaction.client.modals.get(interaction.customId);
				if (!modalHandler) {
					log("warning", `No modal handler found for modal: ${interaction.customId}`);
					return;
				}
				await modalHandler.execute(interaction);
				return;
			}
		} catch (error) {
			log("error", `Failed executing interaction:`, error);
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
