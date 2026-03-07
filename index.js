const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = "!";
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL = "1479690248513519667";

client.once("ready", () => {
  console.log(`Bot đã đăng nhập: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  // MENU SHOP
  if (cmd === "menu") {

    const embed = new EmbedBuilder()
      .setTitle("🍍 DEXSTY BLOX FRUITS SHOP")
      .setDescription(`
📌 **Shop dịch vụ Blox Fruit**

💬 Dùng lệnh:
\`!buy tên_dịch_vụ\`

💳 **Thanh toán**

STK: **1044627277**  
Tên: **Bui Thanh Son**

📨 Sau khi chuyển khoản hãy gửi bill cho admin.
`)
      .setImage("https://cdn.discordapp.com/attachments/1471142835414765681/1479689514992664658/Messenger_creation_214E610D-DB3C-4EA3-9455-2650B4663371.jpg")
      .setColor("Purple");

    message.channel.send({ embeds: [embed] });

  }

  // TẠO ĐƠN HÀNG
  if (cmd === "buy") {

    const service = args.join(" ");

    if (!service) {
      return message.reply("❌ Bạn phải nhập dịch vụ muốn mua");
    }

    message.channel.send(`🛒 <@${message.author.id}> đã đặt dịch vụ **${service}**`);

    // Ping admin
    message.channel.send(`<@1105058130246770758> 📢 Có đơn hàng mới!`);

    // LOG ĐƠN
    const logChannel = client.channels.cache.get(LOG_CHANNEL);

    if (logChannel) {

      const logEmbed = new EmbedBuilder()
        .setTitle("📦 ĐƠN HÀNG MỚI")
        .addFields(
          { name: "👤 Khách hàng", value: `<@${message.author.id}>` },
          { name: "🛍 Dịch vụ", value: service }
        )
        .setColor("Green")
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });

    }

  }

  // DONE ĐƠN
  if (cmd === "done") {

    const user = message.mentions.users.first();

    if (!user) {
      return message.reply("❌ Hãy tag khách để xác nhận done");
    }

    const embed = new EmbedBuilder()
      .setTitle("✅ HOÀN THÀNH ĐƠN")
      .setDescription(`
🎉 Đơn hàng của ${user} đã hoàn thành.

Cảm ơn bạn đã sử dụng dịch vụ tại  
**DEXSTY BLOX FRUITS SHOP**
`)
      .setColor("Blue");

    message.channel.send({ embeds: [embed] });

  }

});

client.login(" MTQ3OTQwNDU1MTAwMDgyMTc2MA.GMlCcQ.ytvPU3JmXfM6f6XYNQ45mf7KeYwf3zARccrH-k");
