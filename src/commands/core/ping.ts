import {
	SlashCommandBuilder,
	CommandInteraction,
	InteractionContextType,
	ApplicationIntegrationType,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!")
		.setContexts(InteractionContextType.Guild)
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

	execute: async (interaction: CommandInteraction) => {
		await interaction.reply("Pong!");
	},
};
