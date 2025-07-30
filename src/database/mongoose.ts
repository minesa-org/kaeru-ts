import mongoose, { connect, Connection } from "mongoose";
import { log, separator } from "@utils/colors.js";

let connection: Connection | null = null;

export async function initializeMongoose(): Promise<Connection> {
	if (connection) {
		log("info", "Reusing existing MongoDB connection");
		return connection;
	}

	try {
		const uri = process.env.MONGO_URI;
		if (!uri) {
			throw new Error("MONGO_URI is not defined in environment variables");
		}

		await connect(uri);
		connection = mongoose.connection;
		log("info", "MongoDB connected successfully\n");
		return connection;
	} catch (error) {
		log("error", "Failed to connect to MongoDB:", error);
		throw error;
	}
}

export function getMongooseConnection(): Connection | null {
	return connection;
}
