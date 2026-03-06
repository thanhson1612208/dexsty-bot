const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const ADMIN_ID = "1105058130246770758";

client.once("ready", () => {
  console.log(`Bot đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  
  // ORDER
  if (message.content.startsWith("!order")) {

    const order = message.content.replace("!order", "").trim();

    if (!order) {
      return message.reply("❌ Hãy nhập: `!order tên dịch vụ`");
    }

    message.reply("✅ Đã gửi đơn cho admin.");

    message.channel.send(
`📢 <@${ADMIN_ID}> có đơn mới!

👤 Khách: ${message.author}
🛒 Dịch vụ: ${order}`
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "order") {
    interaction.reply("📩 Nhập: `!order tên dịch vụ` để đặt.");
  }

  if (interaction.customId === "pay") {
    interaction.reply(
`💳 Thanh toán

🏦 Ngân hàng: VCB
👤 Tên: Bui Thanh Son
🔢 STK: 1044627277`
    );
  }

  if (interaction.customId === "huongdan") {
    interaction.reply(
`📖 Hướng dẫn

!menu → mở menu
!order → đặt dịch vụ
!pay → thanh toán`
    );
  }
});

client.login(process.env.TOKEN);
