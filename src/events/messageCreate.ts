import { Events, Message, TextChannel, ThreadChannel } from "discord.js";
import { EventModule } from "../interfaces/botTypes.js";
import { karu } from "../config/karu.js";
import { handleKaruMessage } from "../utils/karuHandleMessage.js";
import { getMongooseConnection } from "../database/mongoose.js";
import MessageModel from "../database/schemas/message.model.js";
import { log } from "../utils/colors.js";

const messageCreateEvent: EventModule<Events.MessageCreate> = {
	name: Events.MessageCreate,
	once: false,
	async execute(message: Message): Promise<void> {
		if (!message.guild) return;
		if (message.author.bot) return;
		if (!message.guild.members.me?.permissions.has("CreatePrivateThreads")) return;

		const isKaruThread = message.channel.isThread() && message.channel.name.startsWith("💭");

		let userPrompt = message.content?.trim() || "";
		userPrompt = userPrompt.replace(/<@!?\d+>/g, "").trim();

		if (!userPrompt && message.attachments.size > 0) {
			userPrompt = `Attachment: ${message.attachments.first()?.name || "file"}`;
		}

		if (!userPrompt) return;

		if (isKaruThread) {
			const connection = getMongooseConnection();
			if (connection) {
				try {
					await MessageModel.create({
						userId: message.author.id,
						guildId: message.guild.id,
						threadId: message.channel.id,
						content: userPrompt,
						timestamp: new Date(),
					});
				} catch (error) {
					log("error", "Failed to log message to MongoDB:", error);
				}
			} else {
				log("error", "Mongoose connection is not established. Cannot log message.");
			}

			await handleKaruMessage(message, message.channel as ThreadChannel, userPrompt);
			return;
		}

		if (message.channel instanceof TextChannel) {
			if (!message.mentions.has(message.client.user)) return;

			const summaryModel = karu.getGenerativeModel({
				model: "gemma-3n-e4b-it",
				generationConfig: {
					temperature: 0.2,
					maxOutputTokens: 32,
				},
			});

			const summaryPrompt = `Summarize the following user message in under 5 words for use as a thread title:\n"${userPrompt}"`;

			const summaryResult = await summaryModel.generateContent(summaryPrompt);
			let threadName = summaryResult.response
				.text()
				?.replace(/[*_~`>#\n\r]/g, "")
				.trim()
				.slice(0, 80);

			if (!threadName) threadName = `💭 Kāru & ${message.author.username}`;

			const thread = await message.startThread({
				name: `💭 ${threadName}`,
				autoArchiveDuration: 60,
			});

			await handleKaruMessage(message, thread, userPrompt);
		}
	},
};

export default messageCreateEvent;
