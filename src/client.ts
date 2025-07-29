import {
	ActivityType,
	Client,
	GatewayIntentBits,
	Partials,
	PresenceUpdateStatus,
} from "discord.js";
import { loadCommands, loadEvents, registerCommandsGlobally } from "export.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.Message, Partials.Channel],
	presence: {
		activities: [{ name: "with fire", type: ActivityType.Playing, state: "with fire" }],
		status: PresenceUpdateStatus.Idle,
		afk: false,
	},
});

await loadCommands(client);
await loadEvents(client);
await registerCommandsGlobally(
	client,
	process.env.DISCORD_CLIENT_TOKEN!,
	process.env.DISCORD_CLIENT_ID!,
);

export default client;
