const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("Dexsty Bot đã online!");
});

client.on("messageCreate", message => {

  if (message.author.bot) return;

  if (message.content === "!shop") {
    message.reply("👋 Chào mừng đến với DEXSTY SHOP!");
  }

  if (message.content === "!gia") {

    const embed = new EmbedBuilder()
      .setTitle("🛒 BẢNG GIÁ DỊCH VỤ BLOX FRUIT")
      .addFields(
        { name: "⚔️ Cày Level", value: "20k / 700 level", inline: true },
        { name: "💎 Fragment", value: "1k / 1000 fragment", inline: true }
      )
      .setColor("Purple");

    message.channel.send({ embeds: [embed] });
  }

});

client.login(process.env.TOKEN);
