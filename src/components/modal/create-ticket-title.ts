import {
	ModalSubmitInteraction,
	ChannelType,
	TextChannel,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import type { BotComponent } from "@interfaces/botTypes.js";
import { emojis } from "@utils/emojis.js";
import { ticketContainerData } from "@utils/ticketContainerData.js";
import { ticketMenuRow } from "@utils/ticketMenus.js";
import { ticketButtonRow } from "@utils/ticketButtons.js";

const modal: BotComponent = {
	customId: "create-ticket-modal",
	execute: async (interaction: ModalSubmitInteraction) => {
		const labelKey = interaction.fields.getTextInputValue(
			"ticket-label",
		) as keyof typeof emojis.ticket.label;
		const label = labelKey.toUpperCase();
		const emoji = emojis.ticket.label[labelKey] ?? emojis.ticket.label.bug;
		const allowedLabels = Object.keys(emojis.ticket.label);

		if (!allowedLabels.includes(labelKey)) {
			return interaction.reply({
				content: "Invalid ticket label provided. Please select a valid category.",
				flags: MessageFlags.Ephemeral,
			});
		}

		const ticketTitle = interaction.fields.getTextInputValue("ticket-title");
		const threadName = `[${label}] ${ticketTitle}`;

		if (!(interaction.channel instanceof TextChannel)) {
			return interaction.reply({
				content:
					"This command must be used in a thread-supporting text channel (not announcement channel).",
				ephemeral: true,
			});
		}

		const thread = await interaction.channel.threads.create({
			name: threadName,
			autoArchiveDuration: 1440,
			type: ChannelType.PrivateThread,
			reason: `${interaction.user.username} opened a thread for support`,
			invitable: false,
		});

		await interaction.reply({
			content: `# ${emoji} Created <#${thread.id}>\nNow, you can talk about your issue with our staff members.`,
			flags: MessageFlags.Ephemeral,
		});

		const container = await ticketContainerData(interaction);

		const pinMessage = await thread.send({
			components: [container, ticketMenuRow, ticketButtonRow],
			flags: MessageFlags.IsComponentsV2,
		});

		await thread.members.add(interaction.user);

		if (interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) {
			await pinMessage.pin();
		}
	},
};

export default modal;
