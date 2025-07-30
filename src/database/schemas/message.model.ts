import mongoose from "mongoose";
const { Schema } = mongoose;

interface IMessage {
	userId: string;
	guildId: string;
	threadId?: string;
	content: string;
	timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
	userId: { type: String, required: true },
	guildId: { type: String, required: true },
	threadId: { type: String },
	content: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 3600 });

const Message = mongoose.model<IMessage>("Message", messageSchema, "messages");

export default Message;
