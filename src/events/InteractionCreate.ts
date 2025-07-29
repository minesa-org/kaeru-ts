import { MessageFlags, type Interaction } from "discord.js";

export const name = "interactionCreate";
export const once = false;

export async function execute({ interaction }: { interaction: Interaction }) {
	if (
		!interaction.isCommand() &&
		!interaction.isButton() &&
		!interaction.isStringSelectMenu() &&
		!interaction.isModalSubmit()
	) {
		return;
	}

	const commandName = interaction.isCommand() ? interaction.commandName : interaction.customId;
	const command = interaction.client.commands?.get(commandName);

	if (!command) {
		console.warn(`[WARN] No command handler found for interaction: ${commandName}`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`[ERROR] Failed executing ${commandName}:`, error);
		if (interaction.isRepliable() && !interaction.replied) {
			await interaction.reply({
				content: "Something went wrong while executing this command.",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
}
