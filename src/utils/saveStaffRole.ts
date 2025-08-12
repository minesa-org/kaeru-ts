import { Guild } from "../database/schemas/guild.model.js";

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
