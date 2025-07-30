import mongoose from "mongoose";
const { Schema } = mongoose;

interface IChatThread {
	threadId: string;
	messages: Array<{
		role: "user" | "model";
		content: string;
		timestamp: Date;
	}>;
	createdAt: Date;
	updatedAt: Date;
}

const chatThreadSchema = new Schema<IChatThread>({
	threadId: { type: String, required: true, unique: true },
	messages: [
		{
			role: { type: String, enum: ["user", "model"], required: true },
			content: { type: String, required: true },
			timestamp: { type: Date, default: Date.now },
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

chatThreadSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 3600 });

chatThreadSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

const ChatThread = mongoose.model<IChatThread>("ChatThread", chatThreadSchema, "chatThreads");

export default ChatThread;
