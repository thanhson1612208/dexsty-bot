const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "!";

// ID ADMIN
const adminID = "1105058130246770758";

client.once("ready", () => {
  console.log("Dexsty Bot đã online!");
});

client.on("messageCreate", async (message) => {

if (message.author.bot) return;

if (!message.content.startsWith(prefix)) return;

const args = message.content.slice(prefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();


// MENU
if (command === "menu") {

const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId("order")
.setLabel("🛒 Tạo đơn")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("pay")
.setLabel("💳 Thanh toán")
.setStyle(ButtonStyle.Success)
);

message.channel.send({
content: "📌 **MENU DỊCH VỤ DEXSTY**\nBấm nút bên dưới để sử dụng bot",
files: [" Messenger_creation_214E610D-DB3C-4EA3-9455-2650B4663371.jpeg"],
components: [row]
});

}


// ORDER
if (command === "order") {

message.channel.send(`
📦 **ĐƠN HÀNG MỚI**

👤 Khách: ${message.author}

📝 Admin sẽ liên hệ cho bạn sớm nhất có thể.

<@${adminID}>
`);

}


// PAY
if (command === "pay") {

message.channel.send(`
💳 **THANH TOÁN**

Ngân hàng: VCB  
STK: 1044627277  
Tên: Bui Thanh Son
`);

}


// HELP
if (command === "help") {

message.channel.send(`
📖 **HƯỚNG DẪN SỬ DỤNG BOT**

!menu → mở menu bot  
!order → tạo đơn hàng  
!pay → xem thông tin thanh toán  
!help → hướng dẫn sử dụng
`);

}

});

client.login(process.env.TOKEN);
