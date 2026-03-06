const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Dexsty Bot đã online!');
});

client.on('messageCreate', message => {
  if (message.content === "!huongdan") {
  message.channel.send(
`📖 **HƯỚNG DẪN SỬ DỤNG BOT DEXSTY**

🛒 **Mua dịch vụ**
• !menu → Xem bảng giá dịch vụ Blox Fruit
• !order <dịch vụ> → Tạo đơn mua

💳 **Thanh toán**
• !pay → Xem thông tin chuyển khoản VCB

🎁 **Khác**
• !huongdan → Xem hướng dẫn dùng bot

📩 Khi tạo đơn bot sẽ tự ping admin để xử lý.`
  );
  }
  if (message.content.startsWith("!order")) {
  const order = message.content.replace("!order ", "");

  message.channel.send(
    `📦 **ĐƠN HÀNG MỚI**\n👤 Khách: ${message.author}\n🛒 Dịch vụ: ${order}\n\n<@1105058130246770758> có khách cần hỗ trợ!`
  );
  }
  if (message.author.bot) return;
  if (message.content === "!pay") {
  message.channel.send({
    content: "💳 **THÔNG TIN THANH TOÁN**\n\n🏦 Ngân hàng: Vietcombank\n👤 Chủ TK: BUI THANH SON\n🔢 STK: 1944627277\n\n📌 Nội dung CK: Discord + dịch vụ mua\n\nSau khi chuyển khoản hãy gửi bill cho admin để xác nhận."
  });
}
  if (message.content === '!menu') {
    message.channel.send({
      content: "📜 **Bảng Giá Dexsty Shop**",
      files: ["./Messenger_creation_214E610D-DB3C-4EA3-9455-2650B4663371.jpeg"]
    });
  }
});

client.login(process.env.TOKEN);
