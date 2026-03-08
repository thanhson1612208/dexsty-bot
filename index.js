const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const prices = {
    // Game Pass & Robux
    "drop": "170K", "notifier": "370K", "mastery": "55K", "money": "69K", 
    "bossdrop": "69K", "boat": "55K", "storage": "62K", "200rb": "50K",
    // Perm Fruit Nhóm 1
    "rocket": "8K", "spin": "12K", "chop": "15K", "spring": "26K", "bomb": "31K",
    "smoke": "35K", "spike": "52K", "flame": "76K", "ice": "108K", "sand": "121K",
    "dark": "134K", "light": "137K", "diamond": "156K", "rubber": "168K", "ghost": "178K",
    // Perm Fruit Nhóm 2
    "magma": "200K", "love": "244K", "buddha": "239K", "portal": "252K", "rumble": "264K",
    "phoenix": "278K", "sound": "291K", "blizzard": "291K", "gravity": "307K", 
    "dough": "314K", "shadow": "320K", "venom": "326K", "control": "332K", 
    "spirit": "332K", "trex": "341K", "mammoth": "348K", "leopard": "425K", 
    "kitsune": "574K", "dragon": "700K"
};
const ADMIN_ID = "1105058130246770758";
let orderCount = 0;
client.once("ready", () => {
  console.log(`Bot đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === '!menu') {
        // Menu 1: Game Pass
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_gamepass')
                .setPlaceholder('🎮 Chọn Game Pass / Robux')
                .addOptions([
                    { label: '2x Drop Chance', value: 'drop', description: '170K' },
                    { label: 'Fruit Notifier', value: 'notifier', description: '370K' },
                    { label: '2x Mastery', value: 'mastery', description: '55K' },
                    { label: '2x Money', value: 'money', description: '69K' },
                    { label: '2x Boss Drop', value: 'bossdrop', description: '69K' },
                    { label: 'Fast Boat', value: 'boat', description: '55K' },
                    { label: '+1 Storage', value: 'storage', description: '62K' },
                    { label: '200 Robux (120H)', value: '200rb', description: '50K' },
                ])
        );

        // Menu 2: Perm Fruit (Trang 1)
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_perm1')
                .setPlaceholder('🍎 Trái Vĩnh Viễn (Trang 1)')
                .addOptions([
                    { label: 'Perm Rocket', value: 'rocket', description: '8K' },
                    { label: 'Perm Spin', value: 'spin', description: '12K' },
                    { label: 'Perm Chop', value: 'chop', description: '15K' },
                    { label: 'Perm Spring', value: 'spring', description: '26K' },
                    { label: 'Perm Bomb', value: 'bomb', description: '31K' },
                    { label: 'Perm Smoke', value: 'smoke', description: '35K' },
                    { label: 'Perm Spike', value: 'spike', description: '52K' },
                    { label: 'Perm Flame', value: 'flame', description: '76K' },
                    { label: 'Perm Ice', value: 'ice', description: '108K' },
                    { label: 'Perm Sand', value: 'sand', description: '121K' },
                    { label: 'Perm Dark', value: 'dark', description: '134K' },
                    { label: 'Perm Light', value: 'light', description: '137K' },
                    { label: 'Perm Diamond', value: 'diamond', description: '156K' },
                    { label: 'Perm Rubber', value: 'rubber', description: '168K' },
                    { label: 'Perm Ghost', value: 'ghost', description: '178K' },
                ])
        );

        // Menu 3: Perm Fruit (Trang 2)
        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_perm2')
                .setPlaceholder('🔥 Trái Vĩnh Viễn (Trang 2)')
                .addOptions([
                    { label: 'Perm Magma', value: 'magma', description: '200K' },
                    { label: 'Perm Love', value: 'love', description: '244K' },
                    { label: 'Perm Buddha', value: 'buddha', description: '239K' },
                    { label: 'Perm Portal', value: 'portal', description: '252K' },
                    { label: 'Perm Rumble', value: 'rumble', description: '264K' },
                    { label: 'Perm Phoenix', value: 'phoenix', description: '278K' },
                    { label: 'Perm Sound', value: 'sound', description: '291K' },
                    { label: 'Perm Blizzard', value: 'blizzard', description: '291K' },
                    { label: 'Perm Gravity', value: 'gravity', description: '307K' },
                    { label: 'Perm Dough', value: 'dough', description: '314K' },
                    { label: 'Perm Shadow', value: 'shadow', description: '320K' },
                    { label: 'Perm Venom', value: 'venom', description: '326K' },
                    { label: 'Perm Control', value: 'control', description: '332K' },
                    { label: 'Perm Spirit', value: 'spirit', description: '332K' },
                    { label: 'Perm T-Rex', value: 'trex', description: '341K' },
                    { label: 'Perm Mammoth', value: 'mammoth', description: '348K' },
                    { label: 'Perm Leopard', value: 'leopard', description: '425K' },
                    { label: 'Perm Kitsune', value: 'kitsune', description: '574K' },
                    { label: 'Perm Dragon', value: 'dragon', description: '700K' },
                ])
        );

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEX CĂNG ĐÉT - BẢNG GIÁ DỊCH VỤ')
            .setDescription('Vui lòng chọn món đồ bạn muốn mua từ các danh mục bên dưới.')
            .setColor('#00ffcc')
            .setFooter({ text: 'Check kĩ thông tin trước khi chuyển khoản' });

        await message.channel.send({
            embeds: [embed],
            components: [row1, row2, row3]
        });
  

  }
  if (message.content === "!dztest") {

        const score = Math.floor(Math.random() * 101);

        let msg = "😅 Cũng tạm thôi!";
        if (score > 80) msg = "🔥 Đẹp trai vãi!";
        else if (score > 60) msg = "😎 Khá đẹp trai!";
        else if (score > 40) msg = "🙂 Bình thường!";
        else if (score > 20) msg = "😂 Hơi xấu nha!";
        else msg = "💀 Thôi khỏi nói...";

        message.reply(`😎 Độ đẹp trai của bạn là: **${score}/100**\n${msg}`);

    }
 
  if (message.content === "!admin") {

        const embed = {
            color: 0xff66cc,
            title: "👑 ADMIN DEXSTY BLOX FRUITS SHOP",
            description: "💬 Cần mua dịch vụ **Blox Fruits** hãy liên hệ admin:",
            fields: [
                {
                    name: "💬 Zalo / SĐT",
                    value: "📱 **0762706736**"
                },
                {
                    name: "⚡ Thời gian phản hồi",
                    value: "⏰ 1 - 5 phút"
                }
            ],
            image: {
                url: " https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg"
            },
            footer: {
                text: "DEXSTY SHOP • Uy tín - Nhanh chóng - Giá rẻ 💎"
            }
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("📘 Facebook Admin")
                .setStyle(ButtonStyle.Link)
                .setURL("https://www.facebook.com/share/18HtqxaCu4/")
        );

        message.reply({
            embeds: [embed],
            components: [row]
        });

    }

  if (message.content.startsWith("!ship")) {

        const users = message.mentions.users;

        if (users.size < 2) {
            return message.reply("💔 Bạn phải tag 2 người để ship! Ví dụ: `!ship @A @B`");
        }

        const user1 = users.at(0);
        const user2 = users.at(1);

        const percent = Math.floor(Math.random() * 101);

        let result = "💔 Không hợp lắm...";
        if (percent > 80) result = "💖 Trời ơi hợp quá cưới luôn!";
        else if (percent > 50) result = "💕 Cũng khá hợp đó!";
        else if (percent > 20) result = "😅 Hơi khó nhưng vẫn có hi vọng!";
        else result = "💀 Thôi bỏ đi...";

        message.reply(`❤️ **${user1.username}** + **${user2.username}**\n💘 Độ hợp nhau: **${percent}%**\n${result}`);
    }

  if (message.content === "!gaytest") {

const score = Math.floor(Math.random() * 11);

let comment = "";

if (score <= 2) comment = "🗿 Thẳng như thước.";
else if (score <= 5) comment = "🤨 Có dấu hiệu đáng nghi.";
else if (score <= 8) comment = "🌈 Khá là rainbow đó.";
else comment = "🏳️‍🌈 Gay chúa luôn!";

message.reply(`🌈 **Gay Test Result**

${message.author} có độ gay: **${score}/10**

${comment}`);
}


  if (message.content === "!support") {

const embed = new EmbedBuilder()
.setTitle("🛠️ HỖ TRỢ KHÁCH HÀNG")
.setDescription("Nếu bạn cần hỗ trợ hãy liên hệ admin")
.setColor("#00ccff")
.addFields(
{ name: "👑 Admin", value: "<@1105058130246770758>", inline: true },
{ name: "💬 Cách liên hệ", value: "Inbox trực tiếp admin hoặc tạo đơn bằng !order", inline: false }
)
.setFooter({ text: "DEXSTY BLOX FRUITS SHOP" })
.setTimestamp();

message.channel.send({ embeds: [embed] });

  }
  if (message.content.startsWith("!buy")) {

let args = message.content.split(" ");
let price = parseInt(args[1]);

if (!price) {
return message.reply("⚠️ Ví dụ: !buy 50000");
}

const qr = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${price}&addInfo=Mua%20vat%20pham%20tu%20shop%20Dexsty`;

message.channel.send({
content: `💸 Vui lòng chuyển khoản **${price} VND**

🏦 Ngân hàng: Vietcombank  
💳 STK: 1044627277  
👤 Chủ TK: Bui Thanh Son  

Sau khi chuyển khoản hãy gửi bill để admin xác nhận.`,
files: [qr]
});

  }
  if (message.content.startsWith("!done")) {

if (!message.member.permissions.has("Administrator")) {
return message.reply("❌ Chỉ admin mới dùng được lệnh này");
}

let user = message.mentions.users.first();

if (!user) {
return message.reply("⚠️ Ví dụ: !done @khachhang");
}

message.channel.send(`✅ Đơn của ${user} đã hoàn thành!
Cảm ơn bạn đã sử dụng dịch vụ tại **DEXSTY BLOX FRUITS SHOP** 💖`);

  }
  if (message.author.bot) return;

  
  // ORDER
if (message.content.startsWith("!order")) {

const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667";

const order = message.content.replace("!order", "").trim();

if (!order) {
return message.reply("❌ Hãy nhập: `!order <dịch vụ>`");
}

message.reply("✅ Đơn của bạn đã được gửi cho shop!");

const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
if (!logChannel) return;
orderCount++;
const orderId = `#${orderCount.toString().padStart(3,"0")}`;

const embed = new EmbedBuilder()
.setTitle("📦 ĐƠN HÀNG MỚI")
.setColor("#00ffcc")
.addFields(
{ name: "🧾 Mã đơn", value: orderId, inline: true },
{ name: "👤 Khách hàng", value: `${message.author}`, inline: true },
{ name: "🛒 Dịch vụ", value: order, inline: false }
)
.setTimestamp();

const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId("accept_order_" + message.author.id)
.setLabel("✅ Nhận đơn")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("cancel_order_" + message.author.id)
.setLabel("❌ Hủy đơn")
.setStyle(ButtonStyle.Danger)
);

logChannel.send({
content: `📢 <@${ADMIN_ID}> có đơn mới!`,
embeds: [embed],
components: [row]
});

}
});
client.on("interactionCreate", async (interaction) => {
if (!interaction.isStringSelectMenu()) return;

    const selectedItem = interaction.values[0];
    const price = prices[selectedItem] || "Liên hệ Admin";

    // Tạo hóa đơn gửi riêng cho khách (ephemeral: true)
    const invoice = `## 🧾 HÓA ĐƠN DEXSTY SHOP
👤 **Khách hàng:** ${interaction.user.username}
📦 **Dịch vụ:** ${selectedItem.toUpperCase()}
💰 **Giá tiền:** ${price}
──────────────────
🏦 **Thông tin thanh toán:**
- **STK:** 1044627277
- **Ngân hàng:** MB BANK
- **Chủ TK:** BUI THANH SON
*(Vui lòng chụp ảnh bill sau khi chuyển khoản và gửi cho Admin)*`;
  await interaction.reply({ content: invoice, ephemeral: true });
});

if (!interaction.isButton()) return;

const ADMIN_ID = "1105058130246770758";

// ❗ kiểm tra admin trước
if (interaction.user.id !== ADMIN_ID) {
return interaction.reply({
content: "❌ Chỉ admin mới được nhấn nút này.",
ephemeral: true
});
}

// sau khi qua kiểm tra mới chạy nút
if (interaction.customId.startsWith("accept_order_")) {

await interaction.reply("✅ Bạn đã nhận đơn này.");

}

if (interaction.customId.startsWith("cancel_order_")) {

await interaction.reply("❌ Bạn đã hủy đơn này.");

}

  if (!interaction.isButton()) return;
  // nhận đơn
if (interaction.customId.startsWith("accept_order_")) {

const userId = interaction.customId.replace("accept_order_", "");
const user = await client.users.fetch(userId);

await interaction.update({
content: `✅ Đơn đã được nhận bởi ${interaction.user}`,
components: []
});

user.send(`📦 Đơn của bạn đã được shop nhận!

👨‍💼 Admin phụ trách: ${interaction.user}

Cảm ơn bạn đã sử dụng dịch vụ của Dexsty Shop ❤️`);

return;
}

// hủy đơn
if (interaction.customId.startsWith("cancel_order_")) {

const userId = interaction.customId.replace("cancel_order_", "");
const user = await client.users.fetch(userId);

await interaction.update({
content: `❌ Đơn đã bị hủy bởi ${interaction.user}`,
components: []
});

user.send(`❌ Đơn của bạn đã bị hủy bởi shop.

Nếu cần hỗ trợ hãy liên hệ admin.`);

return;
}
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

  if (interaction.customId === "help") {
    interaction.reply(
`📖 Hướng dẫn

!menu → mở menu
!order → đặt dịch vụ
!pay → thanh toán`
    );
  }
});

client.login(process.env.TOKEN); 
