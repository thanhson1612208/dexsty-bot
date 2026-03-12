const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    StringSelectMenuBuilder 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// --- CẤU HÌNH HỆ THỐNG ---
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667"; 
const DONE_LOG_CHANNEL_ID = "1479514742841409576"; 
const CHAT_CHUNG_ID = "1471142835414765681"; 

const prices = {
    "rocket": "8K", "spin": "12K", "chop": "15K", "spring": "26K", "bomb": "31K",
    "smoke": "35K", "spike": "52K", "flame": "76K", "ice": "108K", "sand": "121K",
    "dark": "134K", "light": "137K", "diamond": "156K", "rubber": "168K", "ghost": "178K",
    "magma": "200K", "buddha": "239K", "love": "244K", "portal": "252K", "rumble": "264K",
    "phoenix": "278K", "blizzard": "291K", "sound": "291K", "gravity": "307K", 
    "dough": "314K", "shadow": "320K", "venom": "326K", "spirit": "332K", "control": "332K", 
    "trex": "341K", "mammoth": "348K", "leopard": "425K", "yeti": "425K",
    "kitsune": "574K", "dragon": "700K",
    "200rb": "50K", "mastery": "55K", "boat": "55K", "storage": "62K", "money": "69K", 
    "bossdrop": "69K", "darkblade": "170K", "notifier": "370K"
};

client.once("ready", () => {
    console.log(`✅ Bot Dexsty Shop đã online: ${client.user.tag}`);
});

process.on('unhandledRejection', error => { console.error('Lỗi hệ thống:', error); });

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!gaytest"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            const warning = await message.reply("❌ Sang kênh lệnh riêng để dùng nhé!");
            setTimeout(() => { message.delete().catch(() => {}); warning.delete().catch(() => {}); }, 5000);
            return;
        }
    }

    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        return message.reply(`🌈 Độ gay của ${message.author} là: **${score}/10**`);
    }

    if (message.content === "!admin") {
        const adminEmbed = new EmbedBuilder()
            .setTitle("🛡️ TRUNG TÂM HỖ TRỢ KHÁCH HÀNG")
            .setAuthor({ name: 'Dexsty Shop Support', iconURL: client.user.displayAvatarURL() })
            .setColor("#00D1FF")
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
            .setDescription("Chào bạn! Nếu bạn gặp bất kỳ vấn đề gì về đơn hàng hoặc cần tư vấn, hãy liên hệ trực tiếp với Admin qua các kênh dưới đây.")
            .addFields(
                { name: "👤 Chủ Shop", value: "Bùi Thanh Sơn", inline
{ name: "📞 Hotline / Zalo", value: "📱 0762706736", inline: true },
{ name: "🕒 Trạng thái", value: "✅ Đang Online", inline: true },
{ name: "📢 Lưu ý", value: "Vui lòng chuẩn bị sẵn Ảnh Bill để được hỗ trợ nhanh nhất!" }
)
.setFooter({ text: "Dexsty Shop - Uy Tín Tạo Nên Thương Hiệu" })
.setTimestamp();
​const adminRow = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setLabel('Facebook: Bùi Thanh Sơn')
.setStyle(ButtonStyle.Link)
.setURL('https://www.facebook.com/share/17P4Xrx6bf/'),
new ButtonBuilder()
.setLabel('Liên hệ qua Zalo')
.setStyle(ButtonStyle.Link)
.setURL('https://zalo.me/0762706736')
);
​return message.channel.send({ embeds: [adminEmbed], components: [adminRow] });
}
​if (message.content === '!menu') {
const row1 = new ActionRowBuilder().addComponents(
new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Trái Vĩnh Viễn 1').addOptions(
Object.entries(prices).slice(0, 15).map(([k, v]) => ({ label: Perm ${k}, value: k, description: v }))
)
);
const row2 = new ActionRowBuilder().addComponents(
new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🍎 Trái Vĩnh Viễn 2').addOptions(
Object.entries(prices).slice(15, 35).map(([k, v]) => ({ label: Perm ${k}, value: k, description: v }))
)
);
const row3 = new ActionRowBuilder().addComponents(
new StringSelectMenuBuilder().setCustomId('menu_gp').setPlaceholder('🎮 Gamepass/Robux').addOptions(
Object.entries(prices).slice(35).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: v }))
)
);
const embed = new EmbedBuilder()
.setTitle('🛒 DEX CĂNG ĐÉT - SHOP BLOX FRUIT')
.setColor('#00ffcc')
.setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg');
​return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
}
});
​client.on("interactionCreate", async (interaction) => {
if (interaction.isStringSelectMenu()) {
try {
await interaction.deferReply({ ephemeral: true });
const val = interaction.values[0];
const priceStr = prices[val] || "0";
const amount = parseInt(priceStr.replace(/K/g, '')) * 1000;
const info = Thanh toan ${val.toUpperCase()} shop Dexsty;
const qrUrl = https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)};
​const row = new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(paid_${val}_${priceStr}).setLabel('✅ Chuyển Khoản').setStyle(ButtonStyle.Success),
new ButtonBuilder().setCustomId(card_${val}_${priceStr}).setLabel('💳 Thẻ Cào (Phí 15%)').setStyle(ButtonStyle.Primary)
);
​await interaction.editReply({
content: ## 🛒 THÔNG TIN ĐƠN HÀNG\n📦 **Món:** ${val.toUpperCase()}\n💰 **Giá CK:** ${priceStr}\n⚠️ **Lưu ý:** Thẻ cào chịu phí chiết khấu **15%**.,
files: [qrUrl], components: [row]
});
} catch (e) { await interaction.editReply({ content: "❌ Lỗi kết nối, hãy thử lại!" }).catch(() => {}); }
}
​if (interaction.isButton()) {
if (interaction.component.style === ButtonStyle.Link) return;
​const parts = interaction.customId.split('_');
const action = parts[0];
const targetUserId = parts[1];
const targetUser = await client.users.fetch(targetUserId).catch(() => null);
​if (action === 'card') {
await interaction.update({ content: 💳 **NHẬN THẺ CÀO**\n👉 Nhập mẫu: \Loại thẻ - Mệnh giá - Mã thẻ - Seri`, components: [], files: [] }); const filter = m => m.author.id === interaction.user.id; const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 }); collector.on('collect', async m => { const logChannel = client.channels.cache.get(LOG_CHANNEL_ID); const logEmbed = new EmbedBuilder().setTitle("💳 ĐƠN THẺ CÀO MỚI").setColor("#9b59b6") .addFields( { name: "👤 Khách", value: <@{interaction.user.id}>`, inline: true }, 
{ name: "📦 Món", value: parts[1].toUpperCase(), inline: true }, 
{ name: "💰 Giá", value: parts[2], inline: true }, 
{ name: "🎫 Thẻ", value: `\`{m.content}` } ); const adminRow = new ActionRowBuilder().addComponents( new ButtonBuilder().setCustomId(approve_{interaction.user.id}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId(`done_{interaction.user.id}).setLabel('Done đơn').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId(deny_{interaction.user.id}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
);
if (logChannel) logChannel.send({ content: `🔔 <@{ADMIN_ID}> CÓ ĐƠN THẺ!`, embeds: [logEmbed], components: [adminRow] });
m.reply("✅ Đã gửi thẻ! Đợi Admin check nhé.");
});
}
​if (action === 'paid') {
await interaction.update({ content: "⏳ Hãy gửi Ảnh Bill vào đây!", components: [] });
const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });
collector.on('collect', async m => {
const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
const logEmbed = new EmbedBuilder().setTitle("🆕 ĐƠN CHUYỂN KHOẢN").setColor("#ffff00")
.addFields(
{ name: "👤 Khách", value: <@${m.author.id}> },
{ name: "📦 Món", value: parts[1].toUpperCase() },
{ name: "💰 Giá", value: parts[2] }
)
.setImage(m.attachments.first().proxyURL);
const row = new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(approve_${m.author.id}).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId(done_${m.author.id}).setLabel('Done đơn').setStyle(ButtonStyle.Success),
new ButtonBuilder().setCustomId(deny_${m.author.id}).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
);
if (logChannel) logChannel.send({ embeds: [logEmbed], components: [row] });
m.reply("✅ Bill đã được gửi tới Admin!");
});
}
​if (['approve', 'done', 'deny'].includes(action)) {
if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "❌ Bạn không có quyền Admin!", ephemeral: true });
​if (action === 'approve') {
const appEmbed = EmbedBuilder.from(interaction.message.embeds[0]).setTitle("🟡 ĐANG GIAO ĐỒ...").setColor("#f1c40f");
await interaction.update({ content: ✅ Đã duyệt đơn cho <@${targetUserId}>, embeds: [appEmbed], components: [interaction.message.components[0]] });
if (targetUser) targetUser.send("✅ Admin đã nhận tiền! Đồ của bạn đang được giao.");
}
else if (action === 'done') {
await interaction.reply({ content: "📸 Admin gửi Ảnh Proof giao đồ vào đây!", ephemeral: true });
const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });
​collector.on('collect', async m => {
const doneChan = client.channels.cache.get(DONE_LOG_CHANNEL_ID);
const oldEmbed = interaction.message.embeds[0];
const monHang = oldEmbed.fields.find(f => f.name === "📦 Món")?.value || "N/A";
const giaTien = oldEmbed.fields.find(f => f.name === "💰 Giá")?.value || "N/A";
​const doneEmbed = new EmbedBuilder()
.setTitle("🏁 ĐƠN HÀNG HOÀN TẤT THÀNH CÔNG")
.setAuthor({ name: 'Dexsty Shop - Uy Tín Số 1', iconURL: client.user.displayAvatarURL() })
.setColor("#2ecc71")
.addFields(
{ name: "👤 Khách hàng", value: <@${targetUserId}>, inline: true },
{ name: "📦 Món hàng", value: **${monHang}**, inline: true },
{ name: "💰 Tổng tiền", value: \${giaTien}`, inline: true } ) .setImage(m.attachments.first().proxyURL) .setFooter({ text: Cảm ơn đã ủng hộ Dexsty Shop!`, iconURL: interaction.user.displayAvatarURL() })
.setTimestamp();
​if (doneChan) await doneChan.send({ content: 🎊 Đơn của <@${targetUserId}> đã xong!, embeds: [doneEmbed] });
​await interaction.message.edit({
content: 🏁 ĐƠN ĐÃ XONG!,
embeds: [EmbedBuilder.from(oldEmbed).setTitle("🏁 ĐƠN ĐÃ HOÀN TẤT").setColor("#2ecc71")],
components: []
});
​if (targetUser) targetUser.send("🏁 Đơn hàng đã hoàn tất! Cảm ơn bạn.");
m.delete().catch(() => {});
});
}
else if (action === 'deny') {
await interaction.update({ content: ❌ Đã từ chối đơn., embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setTitle("❌ ĐƠN BỊ TỪ CHỐI").setColor("#e74c3c")], components: [] });
if (targetUser) targetUser.send("❌ Đơn hàng đã bị từ chối.");
}
}
}
});
​client.login(process.env.TOKEN);  
