import {
	AnySelectMenuInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageContextMenuCommandInteraction,
	MessageFlags,
	ModalSubmitInteraction,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	ThumbnailBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { emojis, RecursiveKeyOf } from "./export.js";

type AlertType = "error" | "info";

/**
 * Parameters for sending an alert message.
 */
interface SendAlertMessageParams {
	/** The Discord interaction (command, context menu, button, select menu, or modal) */
	interaction:
		| ChatInputCommandInteraction
		| MessageContextMenuCommandInteraction
		| UserContextMenuCommandInteraction
		| ButtonInteraction
		| AnySelectMenuInteraction
		| ModalSubmitInteraction;
	/** The main content of the message */
	content: string;
	/** The tag or category of the message, default "Alert" */
	tag?: string;
	/** Optional title of the message, default "Notification" */
	title?: string;
	/** Whether the message is ephemeral, default true */
	ephemeral?: boolean;
	/** Alert type to determine color and thumbnail, default "info" */
	type?: AlertType;
	/** Optional reaction or emoji from the emojis object */
	alertReaction?: RecursiveKeyOf<typeof emojis>;
}

/** Predefined thumbnails for each alert type */
const ALERT_THUMBNAILS: Record<AlertType, string> = {
	error:
		"https://media.discordapp.net/attachments/736571695170584576/1408502320312090664/Error.png?ex=68a9f981&is=68a8a801&hm=425eebd8135735b15a2f7d1eb0ec7af1f73c7c8dcdb80ab0d6268ce8d243e3cd&=&format=webp&quality=lossless&width=1224&height=1224",
	info: "https://media.discordapp.net/attachments/736571695170584576/1408502320660221992/Info.png?ex=68a9f981&is=68a8a801&hm=f5c6c3b118c81993e5dd81ff0c4f99790aa77229a750868a7244773d2c62f39e&=&format=webp&quality=lossless&width=1224&height=1224",
};

/** Predefined colors for each alert type */
const ALERT_COLORS: Record<AlertType, number> = {
	error: 0xff5353,
	info: 0x0a84ff,
};

/**
 * Sends an alert message with optional reaction.
 * If a reaction is provided, it is sent together with the container in the same message.
 * @param {SendAlertMessageParams} params - Parameters for the alert message
 * @returns {Promise<void>} Resolves when the message is sent
 */
async function sendAlertMessage({
	interaction,
	content,
	tag = "Alert",
	title = "Notification",
	ephemeral = true,
	type = "info",
	alertReaction,
}: SendAlertMessageParams): Promise<void> {
	const thumbnail = ALERT_THUMBNAILS[type];
	const container = containerTemplate({ tag, description: content, thumbnail, title });

	container.setAccentColor(ALERT_COLORS[type]);

	const components = [];
	if (alertReaction) {
		const reaction = new TextDisplayBuilder().setContent(alertReaction);
		components.push(reaction);
	}

	components.push(container);

	const messagePayload = {
		components,
		flags: [MessageFlags.IsComponentsV2] as number[],
	};

	if (ephemeral) messagePayload.flags.push(MessageFlags.Ephemeral);

	if (interaction.deferred && !interaction.replied) {
		await interaction.editReply(messagePayload);
	} else if (interaction.replied) {
		await interaction.followUp(messagePayload);
	} else {
		await interaction.reply(messagePayload);
	}
}

/**
 * Parameters for building a container
 */
interface ContainerTemplateParams {
	/** Tag or category of the message */
	tag: string;
	/** Main description content */
	description: string | string[];
	/** Optional title for the container */
	title?: string;
	/** Optional thumbnail URL */
	thumbnail?: string;
	/** Optional array of media URLs (max 10) */
	images?: string[];
}

/**
 * Creates a ContainerBuilder with optional thumbnail and media galleries.
 * @param {ContainerTemplateParams} params - Container parameters
 * @returns {ContainerBuilder} The configured container
 */
function containerTemplate({
	tag,
	description,
	title,
	thumbnail,
	images,
}: ContainerTemplateParams): ContainerBuilder {
	const container = new ContainerBuilder()
		.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${tag}`))
		.addSeparatorComponents(
			new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small),
		);

	const lines: string[] = [];
	if (title) lines.push(`# ${title}`);

	if (description) {
		if (Array.isArray(description)) {
			lines.push(description.join("\n"));
		} else {
			lines.push(description);
		}
	}

	const textDisplay = new TextDisplayBuilder().setContent(lines.join("\n"));

	if (thumbnail) {
		const section = new SectionBuilder()
			.addTextDisplayComponents(textDisplay)
			.setThumbnailAccessory(new ThumbnailBuilder().setURL(thumbnail));

		container.addSectionComponents(section);
	} else {
		container.addTextDisplayComponents(textDisplay);
	}

	if (images && images.length > 0) {
		const chunks = [];
		for (let i = 0; i < images.length; i += 10) {
			chunks.push(images.slice(i, i + 10));
		}

		for (const chunk of chunks) {
			const gallery = new MediaGalleryBuilder();
			for (const url of chunk) {
				gallery.addItems(new MediaGalleryItemBuilder().setURL(url));
			}
			container.addMediaGalleryComponents(gallery);
		}
	}

	return container;
}

export { containerTemplate, sendAlertMessage };
