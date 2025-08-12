# Kaeru Bot — Simple. Powerful. Time-Saving.

Kaeru is a streamlined Discord bot designed to cut down your server management time while boosting communication clarity and efficiency.  
Core features include ticketing, real-time translation, slang normalization, and AI-driven summarization and key point extraction.

---

## Key Features

- **Ticket System:** Manage support and requests smoothly with customizable tickets.  
- **Translation:** Bridge language gaps instantly across multiple languages.  
- **Slang Fix:** Automatically normalize slang and informal language for clearer communication.  
- **AI Summarization:** Generate concise summaries and extract key points from lengthy discussions.  
- **Fast & Lightweight:** Built to run efficiently and keep your server responsive.

---

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
DISCORD_CLIENT_ID=  
DISCORD_CLIENT_TOKEN=  
DISCORD_CLIENT_SECRET=  
EMBED_COLOR="#ac8e68"  
COOKIE_SECRET=  
REDIRECT_URI=  
MONGO_URI=  
KARU_API_KEY=
```


> [!NOTE]  
> Make sure to fill in each variable with your actual credentials and secrets. Keep this file secure and **do not** commit it to version control.

---

## Scripts

The main npm scripts you’ll use:

| Script       | Description                                 |
|--------------|---------------------------------------------|
| `clean`      | Removes the `dist` directory                 |
| `build`      | Cleans and compiles TypeScript to `dist`    |
| `start`      | Runs the compiled bot from the `dist` folder |

Example commands:

```sh
npm run build  
npm start
```

---

## Dependencies & Requirements

- Requires **Node.js v18+**  
- Uses [discord.js](https://discord.js.org/) for Discord API interaction  
- AI features powered by `@google/generative-ai`  
- MongoDB used for persistence (`MONGO_URI` required)

---

> [!WARNING]  
> Before running, ensure all environment variables are properly set, especially tokens and API keys, or the bot will fail to start.

---

## Author

Developed and maintained by Neodevils (İbrahim).

---

###### If you want me to add installation instructions, usage examples, or contribution guidelines next, just say.
