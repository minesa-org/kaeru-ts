import {
	AnySelectMenuInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MessageContextMenuCommandInteraction,
	MessageFlags,
	ModalSubmitInteraction,
	TextDisplayBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { emojis, getEmoji, RecursiveKeyOf } from "./emojis.js";

/**
 * Sends a styled ephemeral error message with accent color
 * @param interaction The interaction object
 * @param content Main error text
 * @param reactionKey Emoji key for getEmoji (e.g., "reactions.kaeru.emphasize")
 * @param accentColor Optional hex color for container (default red)
 */
export async function sendErrorMessage(
	interaction:
		| ChatInputCommandInteraction
		| MessageContextMenuCommandInteraction
		| UserContextMenuCommandInteraction
		| ButtonInteraction
		| AnySelectMenuInteraction
		| ModalSubmitInteraction,
	content: string,
	reactionKey: RecursiveKeyOf<typeof emojis> = "reactions.kaeru.emphasize",
	accentColor: number | undefined = undefined,
) {
	const reaction = new TextDisplayBuilder().setContent(`# ${getEmoji(reactionKey)}`);

	const text = new TextDisplayBuilder().setContent(content);

	const container = new ContainerBuilder()
		.addTextDisplayComponents(text)
		.setAccentColor(accentColor);

	await interaction.reply({
		components: [reaction, container],
		flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
	});
}
