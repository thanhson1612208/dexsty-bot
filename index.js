const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const ADMIN_ID = "1105058130246770758";

client.once("ready", () => {
  console.log(`Bot đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  
if (message.content.startsWith("!done")) {

if (!message.member.permissions.has("Administrator")) {
return message.reply("❌ Chỉ admin mới dùng được lệnh này");
}

let user = message.mentions.users.first();

if (!user){
return message.reply("Vui lòng tag khách hàng. Ví dụ: !done @user");
}

message.channel.send(`✅ Đơn của ${user} đã **hoàn thành**!
Cảm ơn bạn đã sử dụng dịch vụ tại **DEXSTY BLOX FRUITS SHOP** 💖`);

}

});
  
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
);

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
