const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

const client = new Client({
intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const ADMIN_ID = "1105058130246770758";

client.once("ready", () => {
console.log("Dexsty Bot đã online!");
});

client.on("messageCreate", async message => {

if (message.author.bot) return;

if (message.content === "!menu") {

const embed = new EmbedBuilder()
.setTitle("🛒 DEXSTY BLOX FRUIT SHOP")
.setDescription("Chọn nút bên dưới để xem dịch vụ")
.setImage("https://i.imgur.com/3ZUrjUP.png")
.setColor("Red");

const buy = new ButtonBuilder()
.setCustomId("buy")
.setLabel("Mua dịch vụ")
.setStyle(ButtonStyle.Primary);

const pay = new ButtonBuilder()
.setCustomId("pay")
.setLabel("Thanh toán")
.setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder().addComponents(buy, pay);

message.channel.send({ embeds: [embed], components: [row] });

}

if (message.content.startsWith("!order")) {

const order = message.content.replace("!order ", "");

message.channel.send(`
📦 **ĐƠN HÀNG MỚI**

👤 Khách: <@${message.author.id}>
🛒 Dịch vụ: ${order}

<@${ADMIN_ID}> có đơn mới!
`);

}

if (interaction.customId === "buy") {
await interaction.reply("🛒 Để mua dịch vụ hãy gõ: `!order tên dịch vụ`");
}

if (interaction.customId === "pay") {
await interaction.reply("💳 **Thanh toán VCB**\nNgân hàng: Vietcombank\nSTK: 123456789\nTên: DEXSTY");
}

});client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

if (interaction.customId === "buy") {
await interaction.reply("🛒 Để mua dịch vụ hãy gõ: `!order tên dịch vụ`");
}

if (interaction.customId === "pay") {
await interaction.reply("💳 **Thanh toán VCB**\nNgân hàng: Vietcombank\nSTK: 123456789\nTên: DEXSTY");
}

});    
STK: 1044627277 
Tên: Bui Thanh Son
`);

}

if (message.content === "!huongdan") {

message.channel.send(`
📖 **HƯỚNG DẪN**

!menu → mở menu shop  
!order tên dịch vụ → tạo đơn  
!pay → thông tin thanh toán
`);

}

});

client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

if (interaction.customId === "buy") {

await interaction.reply("🛒 Để mua dịch vụ hãy gõ: `!order tên dịch vụ`");

}

if (interaction.customId === "pay") {

await interaction.reply("💳 Thanh toán VCB\nSTK: 123456789\nTên: DEXSTY");

}

});

client.login(process.env.TOKEN);
