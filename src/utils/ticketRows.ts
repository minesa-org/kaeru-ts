import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";
import { emojis } from "@utils/emojis.js";

let ticketMenu = new StringSelectMenuBuilder()
	.setCustomId("ticket-select-menu")
	.setDisabled(false)
	.setMaxValues(1)
	.setPlaceholder("Action to close ticket")
	.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel("Close as completed")
			.setValue("ticket-menu-done")
			.setDescription("Done, closed, fixed, resolved")
			.setEmoji(emojis.ticket.circle.done)
			.setDefault(false),
		new StringSelectMenuOptionBuilder()
			.setLabel("Close as not planned")
			.setValue("ticket-menu-duplicate")
			.setDescription("Won’t fix, can’t repo, duplicate, stale")
			.setEmoji(emojis.ticket.circle.stale)
			.setDefault(false),
		new StringSelectMenuOptionBuilder()
			.setLabel("Close with comment")
			.setValue("ticket-menu-close")
			.setEmoji(emojis.ticket.circle.close)
			.setDefault(false),
	);

let lockButton = new ButtonBuilder()
	.setCustomId("ticket-lock-conversation")
	.setLabel("Lock Ticket")
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(false)
	.setEmoji(emojis.ticket.bubble.lock);

let karuButton = new ButtonBuilder()
	.setCustomId("ticket-karu-button")
	.setLabel("Kāru AI (Beta)")
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(false)
	.setEmoji(emojis.intelligence);

const lockButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(lockButton, karuButton);

const ticketMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(ticketMenu);

export { lockButtonRow, ticketMenuRow };
