import { StringSelectMenuInteraction } from "discord.js";
import type { BotComponent } from "../../interfaces/botTypes.js";
import { setLockedAndUpdateMessage } from "../../utils/export.js";

const ticketLockReason: BotComponent = {
	customId: "ticket-lock-reason",

	execute: async (interaction: StringSelectMenuInteraction): Promise<void> => {
		let value = interaction.values[0];

		switch (value) {
			case "ticket-lock-reason-other":
				setLockedAndUpdateMessage(interaction);
				break;
			case "ticket-lock-reason-off-topic":
				setLockedAndUpdateMessage(interaction, "as **off-topic**");
				break;
			case "ticket-lock-reason-too-heated":
				setLockedAndUpdateMessage(interaction, "as **too heated**");
				break;
			case "ticket-lock-reason-resolved":
				setLockedAndUpdateMessage(interaction, "as **resolved**");
				break;
			case "ticket-lock-reason-spam":
				setLockedAndUpdateMessage(interaction, "as **spam**");
				break;
			default:
				break;
		}
	},
};

export default ticketLockReason;
