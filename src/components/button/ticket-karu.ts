import { ButtonInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import type { BotComponent } from "../../interfaces/botTypes.js";
import { getEmoji, sendAlertMessage } from "../../utils/export.js";

const ticketKaruButton: BotComponent = {
	customId: "ticket-karu-button",

	execute: async (interaction: ButtonInteraction) => {
		if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageThreads)) {
			return sendAlertMessage({
				interaction,
				content: `Hmm... I don't have permission to change thread's name to AI support.`,
				type: "error",
				tag: "Missing Permission",
			});
		}

		if (!interaction.channel?.isThread()) {
			throw new Error();
		}

		const thread = interaction.channel;
		const currentName = thread.name;
		const aiEmoji = "💭 ";

		let newName;
		let actionMessage;

		if (currentName.startsWith(aiEmoji)) {
			newName = currentName.substring(aiEmoji.length);
			actionMessage = `# ${getEmoji("info")}\n-# AI support has been **disabled** for this ticket.`;
		} else {
			newName = aiEmoji + currentName;
			actionMessage = `# ${getEmoji("info")}\n-# AI support has been **enabled** for this ticket.`;
		}

		try {
			await thread.setName(newName);

			await interaction.reply({
				content: actionMessage,
				flags: MessageFlags.Ephemeral,
			});
		} catch (error) {
			console.error("Error updating thread name:", error);
			await interaction.reply({
				content: `${getEmoji("error")} I couldn't update the thread name... maybe next time, hehe... :/`,
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};

export default ticketKaruButton;
