import { Schema, model, Document } from "mongoose";

export interface IGuild extends Document {
	guildId: string;
	staffRoleId?: string | null;
	loggingChannelId?: string | null;
	hubChannelId?: string | null;
	imageChannelId?: string | null;
	warnings: Map<string, number>;
}

const guildSchema = new Schema<IGuild>({
	guildId: { type: String, required: true, unique: true },
	staffRoleId: { type: String, default: null },
	loggingChannelId: { type: String, default: null },
	hubChannelId: { type: String, default: null },
	imageChannelId: { type: String, default: null },
	warnings: {
		type: Map,
		of: Number,
		default: new Map<string, number>(),
	},
});

export const Guild = model<IGuild>("Guild", guildSchema);
