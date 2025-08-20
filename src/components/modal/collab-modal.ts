import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";
import { getEmoji } from "../../utils/emojis.js";

const collabModal: BotComponent = {
	customId: /^collab_modal_/,
	execute: async (interaction: ModalSubmitInteraction) => {
		const [action, type, collabKey] = interaction.customId.split("_", 3);

		if (action !== "collab" || type !== "modal") return;

		const fileData = interaction.client.fileCache.get(collabKey);
		if (!fileData) {
			return sendErrorMessage(interaction, "File data not found.");
		}

		const isOwner = interaction.user.id === fileData.owner;
		const isCollaborator = fileData.collaborators.includes(interaction.user.id);

		if (!isOwner && !isCollaborator) {
			return sendErrorMessage(interaction, "You don't have permission to edit this file.");
		}

		const newContent = interaction.fields.getTextInputValue("file_content");
		fileData.text = newContent;
		interaction.client.fileCache.set(collabKey, fileData);

		if (fileData.threadId) {
			const thread = interaction.guild?.channels.cache.get(fileData.threadId);
			if (thread && thread.isThread()) {
				await thread.send({
					content: `${getEmoji("reactions.user.thumbsup")} **${fileData.name}** was updated by <@${interaction.user.id}>`,
				});
			}
		}

		return interaction.reply({
			content: `${getEmoji("ticket.circle.done")} File **${fileData.name}** has been updated successfully!`,
			flags: MessageFlags.Ephemeral,
		});
	},
};

export default collabModal;
