import ChatThread from "../models/ChatThread.js";
import { karu } from "../config/karu.js";
import { log } from "../utils/colors.js";
import { emojis, getEmoji } from "../utils/emojis.js";
import { Message as DiscordMessage, TextChannel, ThreadChannel } from "discord.js";

type SendableChannel = TextChannel | ThreadChannel;

/**
 * Handle a message sent to Kāru
 */
export async function handleKaruMessage(
	message: DiscordMessage,
	channel: SendableChannel,
	userPrompt: string,
) {
	try {
		if (!userPrompt) return;

		let chatThread = await ChatThread.findOne({ threadId: channel.id });
		if (!chatThread) {
			chatThread = new ChatThread({
				threadId: channel.id,
				messages: [],
			});
		}

		chatThread.messages.push({
			role: "user",
			content: userPrompt,
			timestamp: new Date(),
		});

		const history = chatThread.messages.slice(-10);
		const historyText = history
			.map(m => `${m.role === "user" ? "User" : "Kāru"}: ${m.content}`)
			.join("\n");

		const systemPrompt = `
You are Kāru — a friendly, emotionally intelligent AI companion running on the Discord platform.  
You communicate through Discord threads and messages.  

Keep replies brief and actionable — max 3 sentences.  
No greetings, sign-offs, or filler. No repetition of user input.  
Provide concrete advice or clear answers only.  

Adapt tone to user’s emotional cues: empathetic if frustrated, energetic if excited, professional if confused.  
Maintain consistent personality and facts throughout the conversation.  

If unsure, admit it clearly and suggest alternatives or clarifications.  
Prioritize recent messages and user questions; use history only for context, not repetition.  

Use language and references suitable for Discord users.  
Encourage users to ask follow-ups without being pushy.  

Never request, store, or share personal or sensitive information.  

Never reveal internal model names or AI configurations (you are "Kāru", not Gemini, OpenAI, etc.).`.trim();

		const fullPrompt = `${systemPrompt}\n${historyText}\nUser: ${userPrompt}`;

		const model = karu.getGenerativeModel({
			model: "gemma-3n-e4b-it",
			generationConfig: {
				temperature: 0.2,
				topK: 1,
				topP: 1,
				maxOutputTokens: 800,
			},
		});

		const result = await model.generateContent(fullPrompt);
		const rawText = result.response.text();

		let botResponse = rawText
			.replace(/^Kaeru[:,\s]*/i, "")
			.replace(/^Kāru[:,\s]*/i, "")
			.replace(/^Bot[:,\s]*/i, "");

		const content = `${getEmoji("intelligence")} ${botResponse}`;

		await channel.send({
			content,
			allowedMentions: { repliedUser: false, parse: [] },
		});

		chatThread.messages.push({
			role: "model",
			content: botResponse,
			timestamp: new Date(),
		});
		await chatThread.save();
	} catch (error: any) {
		log("error", `Error: ${error}`);
		await message.reply(`${emojis.error} Something went wrong: ${error.message}`);
	}
}
