const { SlashCommandBuilder } = require("discord.js");
const { runAI } = require("../core/ai");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("AI-ს სთხოვე დახმარება ან ბოტის არსებული ბრძანების გაშვება")
    .addStringOption(option => option
      .setName("prompt")
      .setDescription("რა გინდა რომ AI-მ გააკეთოს ან გიპასუხოს?")
      .setMaxLength(1200)
      .setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    return runAI(interaction, client, interaction.options.getString("prompt", true));
  }
};
