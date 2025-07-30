import {
	ActivityType,
	Client,
	GatewayIntentBits,
	Partials,
	PresenceUpdateStatus,
} from "discord.js";
import { loadCommands, registerCommandsGlobally } from "@handlers/commands.js";
import { loadEvents } from "@handlers/events.js";
import { printLogo } from "@utils/colors.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [Partials.GuildMember, Partials.Message, Partials.Channel],
	presence: {
		status: PresenceUpdateStatus.Idle,
		activities: [
			{
				name: "Pro & A.I. features for free",
				type: ActivityType.Watching,
				state: "Serving free pro features for your community.",
			},
		],
	},
});

async function initialize() {
	await loadCommands(client);
	await loadEvents(client);
	await registerCommandsGlobally(
		client,
		process.env.DISCORD_CLIENT_TOKEN!,
		process.env.DISCORD_CLIENT_ID!,
	);
}

initialize();

printLogo();

export default client;
