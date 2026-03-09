const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const express = require('express');

// --- CẤU HÌNH CỐ ĐỊNH (ĐÃ BỎ BIẾN MÔI TRƯỜNG) ---
const ADMIN_ID = '1105058130246770759'; // ID của bạn
const LOG_CHANNEL_ID = '1479690248512519667'; // Kênh nhận Bill
const DONE_LOG_CHANNEL_ID = '1479514742941409576'; // Kênh Proof (Fix lỗi mặt mếu)

const app = express();
app.get('/', (req, res) => res.send('Bot Online!'));
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

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

client.once("ready", () => console.log(`✅ Bot ${client.user.tag} đã sẵn sàng!`));

client.on("messageCreate", async (message) => {
    if (message.author.bot || message.content !== '!menu') return;
    const embed = new EmbedBuilder().setTitle('🛒 DEX CĂNG ĐÉT - SHOP BLOX FRUIT').setColor('#00ffcc').setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg');
    const row1 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Trang 1').addOptions(Object.entries(prices).slice(0, 24).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: v }))));
    const row2 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🍎 Trang 2').addOptions(Object.entries(prices).slice(24).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: v }))));
    message.channel.send({ embeds: [embed], components: [row1, row2] });
});

client.on("interactionCreate", async (interaction) => {
    const parts = interaction.customId?.split('_') || [];
    if (interaction.isStringSelectMenu()) {
        const val = interaction.values[0];
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${parseInt(prices[val])*1000}&addInfo=${encodeURIComponent('Thanh toan ' + val)}`;
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}`).setLabel('✅ Chuyển Khoản').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`cardinfo_${val}`).setLabel('💳 Thẻ Cào').setStyle(ButtonStyle.Primary)
        );
        return interaction.reply({ content: `## 🛒 MÓN: ${val.toUpperCase()}\n💰 Giá: ${prices[val]}`, files: [qrUrl], components: [row], ephemeral: true });
    }
    if (!interaction.isButton()) return;
    if (parts[0] === 'cardinfo') {
        return interaction.update({ content: `## 💳 GỬI THẺ CÀO\nNhắn riêng cho Admin <@${ADMIN_ID}>: \`Loại thẻ - Mệnh giá - Mã - Seri\``, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`confirmcard_${parts[1]}`).setLabel('📩 Đã nhắn Admin').setStyle(ButtonStyle.Success))], files: [] });
    }
    if (parts[0] === 'confirmcard') {
        const logChan = client.channels.cache.get(LOG_CHANNEL_ID);
        if (logChan) logChan.send({ content: `🔔 <@${ADMIN_ID}> Khách <@${interaction.user.id}> báo đã gửi thẻ món ${parts[1].toUpperCase()}!`, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`done_${interaction.user.id}`).setLabel('Done đơn').setStyle(ButtonStyle.Success))] });
        return interaction.update({ content: "✅ Đã báo Admin!", components: [] });
    }
    if (parts[0] === 'paid') {
        await interaction.update({ content: "⏳ Hãy gửi **Ảnh Bill** vào đây!", components: [] });
        const col = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id && m.attachments.size > 0, time: 60000, max: 1 });
        col.on('collect', m => {
            const logChan = client.channels.cache.get(LOG_CHANNEL_ID);
            const logEmbed = new EmbedBuilder().setTitle("🆕 ĐƠN CK").setColor("#ffff00").addFields({ name: "Khách", value: `<@${m.author.id}>` }, { name: "Món", value: parts[1].toUpperCase() }).setImage(m.attachments.first().proxyURL);
            if (logChan) logChan.send({ embeds: [logEmbed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`done_${m.author.id}`).setLabel('Done đơn').setStyle(ButtonStyle.Success))] });
            m.reply("✅ Đã gửi bill!");
        });
    }
    if (interaction.user.id !== ADMIN_ID) return;
    if (parts[0] === 'done') {
        await interaction.reply({ content: "📸 Gửi **Ảnh Proof** vào đây!", ephemeral: true });
        const col = interaction.channel.createMessageCollector({ filter: m => m.author.id === ADMIN_ID && m.attachments.size > 0, time: 60000, max: 1 });
        col.on('collect', async m => {
            const proof = m.attachments.first();
            const doneChan = client.channels.cache.get(DONE_LOG_CHANNEL_ID);
            const doneEmbed = new EmbedBuilder().setTitle("🏁 HOÀN TẤT").setColor("#00ff00").setImage(proof.url).setTimestamp();
            if (doneChan) await doneChan.send({ content: `Đơn của <@${parts[1]}>`, embeds: [doneEmbed], files: [proof.url] });
            if (client.users.cache.get(parts[1])) client.users.cache.get(parts[1]).send("🏁 Đơn hàng đã xong!");
            await interaction.editReply("✅ Đã trả đơn và fix lỗi ảnh!");
            m.delete().catch(() => {});
        });
    }
});

client.login(process.env.TOKEN);
