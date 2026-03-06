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
  if (message.content.startsWith("!order")) {
  const order = message.content.replace("!order ", "");
  
  message.channel.send(
    `📦 **ĐƠN HÀNG MỚI**\n👤 Khách: ${message.author}\n🛒 Dịch vụ: **${order}**\n\nAdmin sẽ liên hệ bạn sớm!`
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
