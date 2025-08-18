import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	ContainerBuilder,
	Events,
	MessageFlags,
	PermissionFlagsBits,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";
import type { BotEventHandler } from "../interfaces/botTypes.js";
import { getHubChannel } from "../utils/guildManager.js";

const voiceStateUpdateEvent: BotEventHandler<Events.VoiceStateUpdate> = {
	name: Events.VoiceStateUpdate,
	once: false,
	execute: async (oldState, newState) => {
		try {
			const member = newState.member;
			if (!member) return;

			const guild = newState.guild;
			const hubChannelId = await getHubChannel(guild.id);
			if (!hubChannelId) return;

			if (newState.channelId !== hubChannelId) return;
			if (oldState.channelId === hubChannelId) return;

			const botMember = guild.members.me;
			if (
				!botMember?.permissions.has([
					PermissionFlagsBits.ManageChannels,
					PermissionFlagsBits.MoveMembers,
				])
			)
				return;

			// Create the personal VC with text channel
			const personalVC = await guild.channels.create({
				name: `⭐ ${member.user.username}'s Channel`,
				type: ChannelType.GuildVoice,
				parent: newState.channel?.parent ?? undefined,
				permissionOverwrites: [
					{
						id: member.id,
						allow: [
							PermissionFlagsBits.Connect,
							PermissionFlagsBits.Speak,
							PermissionFlagsBits.ManageChannels,
						],
					},
					{
						id: guild.roles.everyone,
						deny: [PermissionFlagsBits.Connect],
					},
				],
			});

			await member.voice.setChannel(personalVC);

			const container = new ContainerBuilder()
				.addTextDisplayComponents(new TextDisplayBuilder().setContent("-# Voice Channel Control"))
				.addSectionComponents(
					new SectionBuilder()
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								`# Welcome to your private VC!\nOnly admins can access it.`,
							),
						)
						.setThumbnailAccessory(
							new ThumbnailBuilder().setURL(
								"https://media.discordapp.net/attachments/1280177632192888904/1403379856653287544/b916d69f-0491-4e09-be26-3f85e46a9ef2.png?ex=68a485d7&is=68a33457&hm=4ab3c27d506fb607184d750f4d00545b36987389dc6747b98edf4d8f005df192&=&width=700&height=700",
							),
						),
				)
				.addActionRowComponents(
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setCustomId(`vc-lock-${personalVC.id}`)
							.setLabel("Lock/Unlock")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId(`vc-kick-${personalVC.id}`)
							.setLabel("Kick Member")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId(`vc-limit-${personalVC.id}`)
							.setLabel("Set User Limit")
							.setStyle(ButtonStyle.Secondary),
					),
				);

			await personalVC.send({
				components: [container],
				flags: MessageFlags.IsComponentsV2,
			});

			const deleteChecker = async () => {
				try {
					if (!personalVC.guild) return;
					if (personalVC.members.size === 0) {
						await personalVC.delete().catch(() => null);
					} else {
						setTimeout(deleteChecker, 5000);
					}
				} catch (err) {
					console.error("Delete checker error:", err);
				}
			};
			setTimeout(deleteChecker, 5000);
		} catch (err) {
			console.error("VoiceStateUpdate error:", err);
		}
	},
};

export default voiceStateUpdateEvent;
