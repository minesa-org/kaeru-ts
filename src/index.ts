import "dotenv/config";
import client from "./client.js";

client.login(process.env.DISCORD_CLIENT_TOKEN);
