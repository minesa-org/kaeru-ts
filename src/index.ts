import "dotenv/config";
import client from "@config/client.js";

client.login(process.env.DISCORD_CLIENT_TOKEN);
