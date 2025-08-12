import { SlashCommandBuilder } from "discord.js";
import { EmojiSize, getEmojiURL } from "../../utils/getEmojiURL.js";
import { emojis, getEmoji } from "../../utils/emojis.js";
const pingCommand = {
    data: new SlashCommandBuilder()
        .setName("emoji-url")
        .setDescription("Get emoji URL.")
        .addStringOption(option => option.setName("emoji").setDescription("Emoji to get URL for").setRequired(true))
        .addIntegerOption(option => option
        .setName("size")
        .setDescription("Size of the emoji (in pixels)")
        .setRequired(false)
        .addChoices({ name: "Small", value: EmojiSize.Small }, { name: "Medium", value: EmojiSize.Medium }, { name: "Large", value: EmojiSize.Large }, { name: "Maximum", value: EmojiSize.Max })),
    execute: async (interaction) => {
        const emoji = interaction.options.getString("emoji");
        const size = interaction.options.getInteger("size")?.valueOf();
        if (!emoji || !emoji.includes(":")) {
            return interaction.reply({
                content: `${emojis.error} Invalid emoji format. Please use a Discord emoji.`,
            });
        }
        try {
            const url = getEmojiURL(emoji, size ?? EmojiSize.Large);
            await interaction.reply({
                content: `# ${getEmoji("brain")} Here is your emoji URL:\n> ${url}`,
            });
        }
        catch (error) {
            await interaction.reply({ content: `${emojis.error} Failed to get emoji URL.` });
        }
    },
};
export default pingCommand;
