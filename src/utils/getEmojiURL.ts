import { log } from "../utils/colors.js";

export enum EmojiSize {
	Small = 16,
	Medium = 32,
	Large = 64,
	Max = 128,
}

/**
 * Extracts the emoji ID from a Discord emoji string and returns the CDN URL.
 * @param {string} emojiString - The emoji string (e.g., "<:bubblelock:1398380591300218881>")
 * @param {number} [size=64] - The size of the emoji image (default: 64)
 * @returns {string} The Discord CDN URL for the emoji image
 */
export function getEmojiURL(emojiString: string, size: EmojiSize = EmojiSize.Large): string {
	const fallbackEmojiId = "1353817612525637734";
	if (!emojiString || typeof emojiString !== "string") {
		log("warning", "getEmojiURL: Invalid emoji string, using fallback");
		return `https://cdn.discordapp.com/emojis/${fallbackEmojiId}.png?size=${size}`;
	}

	const emojiId = emojiString.match(/:(\d+)>/)?.[1];
	if (!emojiId) {
		log("warning", "getEmojiURL: Emoji ID not found, using fallback");
		return `https://cdn.discordapp.com/emojis/${fallbackEmojiId}.png?size=${size}`;
	}

	const url = `https://cdn.discordapp.com/emojis/${emojiId}.png?size=${size}`;
	return url;
}
