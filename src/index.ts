import "dotenv/config";
import client from "./config/client.js";
import { log } from "./utils/colors.js";

async function startBot() {
	try {
		await client.login(process.env.DISCORD_CLIENT_TOKEN);

		// RAM kullanımını izlemek
		setInterval(() => {
			const used = process.memoryUsage();
			const rss = (used.rss / 1024 / 1024).toFixed(2);
			const heap = (used.heapUsed / 1024 / 1024).toFixed(2);
			log("info", `RAM → RSS: ${rss} MB | Heap: ${heap} MB`);
		}, 5000);
	} catch (error) {
		log("error", "Failed to login:", error);
		process.exit(1);
	}
}

startBot();
