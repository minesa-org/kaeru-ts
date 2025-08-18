import { Guild } from "../models/guild.model.js";

/**
 * Sets the hub voice channel for a guild.
 * If the guild does not exist in the database, it will be created.
 *
 * @param {string} guildId - The ID of the guild.
 * @param {string} channelId - The ID of the channel to set as the hub.
 * @returns {Promise<import("../models/guild.model.js").IGuild>} The updated or newly created guild document.
 */
export async function setHubChannel(
	guildId: string,
	channelId: string,
): Promise<import("../models/guild.model.js").IGuild> {
	let guild = await Guild.findOne({ guildId });
	if (!guild) {
		guild = new Guild({ guildId, hubChannelId: channelId, warnings: new Map() });
	} else {
		guild.hubChannelId = channelId;
	}
	await guild.save();
	return guild;
}

/**
 * Retrieves the hub voice channel ID for a guild.
 *
 * @param {string} guildId - The ID of the guild.
 * @returns {Promise<string | null>} The hub channel ID, or null if not set.
 */
export async function getHubChannel(guildId: string): Promise<string | null> {
	const guild = await Guild.findOne({ guildId });
	return guild?.hubChannelId || null;
}

/**
 * Save the logging channel ID for a guild
 * @param guildId The guild ID
 * @param channelId The channel ID
 */
export async function setupLoggingChannel(guildId: string, channelId: string): Promise<void> {
	await Guild.findOneAndUpdate({ guildId }, { loggingChannelId: channelId }, { upsert: true });
}

/**
 * Get the logging channel ID for a guild
 * @param guildId The guild ID
 * @returns The channel ID
 */
export async function checkLoggingChannel(guildId: string): Promise<string | null> {
	const guild = await Guild.findOne({ guildId });
	return guild?.loggingChannelId ?? null;
}

/**
 * Save the staff role ID for a guild
 * @param guildId The guild ID
 * @param roleId The role ID
 */
export async function saveStaffRoleId(guildId: string, roleId: string): Promise<void> {
	await Guild.findOneAndUpdate({ guildId }, { staffRoleId: roleId }, { upsert: true });
}

/**
 * Get the staff role ID for a guild
 * @param guildId The guild ID
 * @returns The role ID
 */
export async function getStaffRoleId(guildId: string): Promise<string | null> {
	const guild = await Guild.findOne({ guildId });
	return guild?.staffRoleId ?? null;
}

/**
 * Add a warning to a user
 * @param guildId The guild ID
 * @param userId The user ID
 * @returns The number of warnings the user has
 */
export async function addWarning(guildId: string, userId: string): Promise<number> {
	const update = { $inc: { [`warnings.${userId}`]: 1 } };

	const guild = await Guild.findOneAndUpdate({ guildId }, update, {
		upsert: true,
		new: true,
	});

	return guild?.warnings.get(userId) ?? 0;
}

/**
 * Check the number of warnings a user has
 * @param guildId The guild ID
 * @param userId The user ID
 * @returns The number of warnings the user has
 */
export async function checkWarnings(guildId: string, userId: string): Promise<number> {
	try {
		const guild = await Guild.findOne({ guildId });
		if (!guild || !guild.warnings) return 0;
		return guild.warnings.get(userId) ?? 0;
	} catch (error) {
		console.error("Error checking warnings:", error);
		return 0;
	}
}
