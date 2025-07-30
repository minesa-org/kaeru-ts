// src/components/modal/ping_modal.ts
import {
  ModalSubmitInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags,
} from "discord.js";
import type { BotComponent } from "@interfaces/botTypes.js";

const modal: BotComponent = {
  customId: "ping_modal",
  async execute(interaction: ModalSubmitInteraction) {
    const name = interaction.fields.getTextInputValue("name_input");
    const age = interaction.fields.getTextInputValue("age_input");

    const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("ping_select")
        .setPlaceholder("Ne yapmak istersin?")
        .addOptions([
          { label: "Kick", value: "kick" },
          { label: "Ban", value: "ban" },
          { label: "Mute", value: "mute" },
        ]),
    );

    await interaction.reply({
      content: `Adınız: **${name}**, Yaşınız: **${age}**`,
      components: [selectMenu],
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default modal;