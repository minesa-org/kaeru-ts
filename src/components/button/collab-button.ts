import {
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	MessageFlags,
} from "discord.js";
import { BotComponent } from "../../interfaces/botTypes.js";
import { sendErrorMessage } from "../../utils/sendErrorMessage.js";

const collabButton: BotComponent = {
	customId: /^collab_(edit|view)_/,
	execute: async (interaction: ButtonInteraction) => {
		const [action, type, collabKey] = interaction.customId.split("_", 3);

		const fileData = interaction.client.fileCache.get(collabKey);
		if (!fileData) {
			return sendErrorMessage(interaction, "File data not found.");
		}

		const isOwner = interaction.user.id === fileData.owner;
		const isCollaborator = fileData.collaborators.includes(interaction.user.id);

		if (type === "edit") {
			if (!isOwner && !isCollaborator) {
				return sendErrorMessage(interaction, "You don't have permission to edit this file.");
			}

			const modal = new ModalBuilder()
				.setCustomId(`collab_modal_${collabKey}`)
				.setTitle(`Edit: ${fileData.name}`)
				.addComponents(
					new ActionRowBuilder<TextInputBuilder>().addComponents(
						new TextInputBuilder()
							.setCustomId("file_content")
							.setLabel("File Content")
							.setStyle(TextInputStyle.Paragraph)
							.setValue(fileData.text)
							.setMaxLength(4000)
							.setRequired(true)
							.setPlaceholder("Please write down your changes."),
					),
				);

			return interaction.showModal(modal);
		}

		if (type === "view") {
			if (!fileData.isViewable && !isOwner && !isCollaborator) {
				return sendErrorMessage(interaction, "You don't have permission to view this file.");
			}

			return interaction.reply({
				content: `\`\`\`${fileData.ext.slice(1)}\n${fileData.text}\n\`\`\``,
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};

export default collabButton;
