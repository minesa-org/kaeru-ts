import {
	ContainerBuilder,
	Events,
	MessageFlags,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
	PermissionsBitField,
} from "discord.js";
import type { BotEventHandler } from "../interfaces/botTypes.js";
import { EmojiSize, getEmojiURL, getEmoji } from "../utils/export.js";
import { log } from "../utils/colors.js";

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

const guildMemberAddEvent: BotEventHandler<Events.GuildMemberAdd> = {
	name: Events.GuildMemberAdd,
	once: false,
	execute: async member => {
		const guild = member.guild;
		const accountAge = Date.now() - member.user.createdTimestamp;

		const timeoutReason = "Account is younger than 7 days.";
		const timeoutDuration = new Date(Date.now() + ONE_WEEK);

		try {
			await member.send({
				components: [
					new ContainerBuilder().addSectionComponents(
						new SectionBuilder()
							.addTextDisplayComponents(
								new TextDisplayBuilder().setContent(
									[
										`# Time-outed!`,
										`Your account is younger than 7 days, so you have been temporarily restricted.`,
										`-# Server: ${guild.name}`,
									].join("\n"),
								),
							)
							.setThumbnailAccessory(
								new ThumbnailBuilder().setURL(getEmojiURL(getEmoji("timeout"), EmojiSize.Large)),
							),
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
		} catch (err) {
			log("warning", `Could not DM user ${member.user.tag}: ${err}`);
		}

		try {
			await member.disableCommunicationUntil(timeoutDuration, timeoutReason);
			log("info", `Timed out ${member.user.tag} for 7 days (account too new).`);
		} catch (err) {
			log("error", `Failed to timeout ${member.user.tag}: ${err}`);
		}

		const container = new ContainerBuilder().addSectionComponents(
			new SectionBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							`# ${getEmoji("timeout")} Time-outed a new account`,
							`User <@${member.user.id}> (${member.user.tag}) joined.`,
							`Account too new → timeouted for 1 week.`,
						].join("\n"),
					),
				)
				.setThumbnailAccessory(new ThumbnailBuilder().setURL(member.user.displayAvatarURL())),
		);

		const systemChannel = guild.systemChannel;
		if (systemChannel?.isTextBased() && systemChannel.viewable) {
			if (
				systemChannel.permissionsFor(guild.members.me!)?.has(PermissionsBitField.Flags.SendMessages)
			) {
				try {
					await systemChannel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
				} catch (err) {
					log("error", `Failed to send system message in ${guild.name}: ${err}`);
				}
			} else {
				log("warning", `Missing permissions to send system message in ${guild.name}.`);
			}
		}
	},
};

export default guildMemberAddEvent;
