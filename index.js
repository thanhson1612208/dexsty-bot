const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const express = require('express');

const app = express();
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Giữ bot online cho Render
app.get('/', (req, res) => res.send('Bot Dexsty Shop is Running!'));
app.listen(process.env.PORT || 3000);

// --- CẤU HÌNH LẤY TỪ ENVIRONMENT VARIABLES ---
const ADMIN_ID = process.env.ADMIN_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
const DONE_LOG_CHANNEL_ID = process.env.DONE_LOG_CHANNEL_ID;

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

client.once("ready", () => console.log(`✅ Bot online: ${client.user.tag}`));

client.on("messageCreate", async (message) => {
    if (message.author.bot || message.content !== '!menu') return;

    const embed = new EmbedBuilder()
        .setTitle('🛒 DEX CĂNG ĐÉT - SHOP BLOX FRUIT')
        .setColor('#00ffcc')
        .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg');

    const row1 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Trái Vĩnh Viễn 1').addOptions(
            Object.entries(prices).slice(0, 20).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: v }))
        )
    );
    const row2 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🍎 Trái Vĩnh Viễn 2').addOptions(
            Object.entries(prices).slice(20).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: v }))
        )
    );

    message.channel.send({ embeds: [embed], components: [row1, row2] });
});

client.on("interactionCreate", async (interaction) => {
    const parts = interaction.customId?.split('_') || [];

    if (interaction.isStringSelectMenu()) {
        const val = interaction.values[0];
        const price = prices[val];
        const info = `Thanh toan ${val.toUpperCase()}`;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${parseInt(price)*1000}&addInfo=${encodeURIComponent(info)}`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}_${price}`).setLabel('✅ Chuyển Khoản').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`cardinfo_${val}_${price}`).setLabel('💳 Thẻ Garena/Viettel (Phí 15%)').setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({ 
            content: `## 🛒 ĐƠN: ${val.toUpperCase()}\n💰 Giá CK: ${price}\n⚠️ Thẻ cào phí 15% (Ví dụ: Thẻ 100k nhận 85k).`, 
            files: [qrUrl], components: [row], ephemeral: true 
        });
    }

    if (interaction.isButton()) {
        // Khách chọn thẻ cào
        if (parts[0] === 'cardinfo') {
            return interaction.update({ 
                content: `## 💳 GỬI THẺ CÀO (PHÍ 15%)\n⚠️ **BẢO MẬT:** Không nhập mã thẻ ở đây!\n👉 Hãy nhấn gửi tin nhắn riêng cho Admin: <@${ADMIN_ID}>\nNội dung: \`Loại thẻ - Mệnh giá - Mã - Seri\`\n\nSau khi gửi xong, nhấn nút dưới:`,
                components: [new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`confirmcard_${parts[1]}_${parts[2]}`).setLabel('📩 Tôi đã nhắn riêng cho Admin').setStyle(ButtonStyle.Success)
                )], files: []
            });
        }

        // Báo Admin check DM
        if (parts[0] === 'confirmcard') {
            const logChan = client.channels.cache.get(LOG_CHANNEL_ID);
            const logEmbed = new EmbedBuilder().setTitle("💳 ĐƠN THẺ CÀO (CHECK DM)").setColor("#9b59b6")
                .addFields({ name: "👤 Khách", value: `<@${interaction.user.id}>` }, { name: "📦 Món", value: parts[1].toUpperCase() }, { name: "💰 Giá niêm yết", value: parts[2] });
            
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`approve_${interaction.user.id}`).setLabel('Duyệt đơn').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId(`done_${interaction.user.id}`).setLabel('Done đơn').setStyle(ButtonStyle.Success)
            );
            if (logChan) logChan.send({ content: `🔔 <@${ADMIN_ID}>`, embeds: [logEmbed], components: [row] });
            return interaction.update({ content: "✅ Đã báo Admin check tin nhắn riêng!", components: [] });
        }

        // Khách gửi bill chuyển khoản
        if (parts[0] === 'paid') {
            await interaction.update({ content: "⏳ Hãy gửi **Ảnh Bill** vào đây (Xóa sau 1 phút)!", components: [] });
            const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id && m.attachments.size > 0, time: 60000, max: 1 });
            
            collector.on('collect', async m => {
                const logChan = client.channels.cache.get(LOG_CHANNEL_ID);
                const logEmbed = new EmbedBuilder().setTitle("🆕 ĐƠN CHUYỂN KHOẢN").setColor("#ffff00")
                    .addFields({ name: "👤 Khách", value: `<@${m.author.id}>` }, { name: "📦 Món", value: parts[1].toUpperCase() }, { name: "💰 Giá", value: parts[2] })
                    .setImage(m.attachments.first().proxyURL);

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${m.author.id}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`done_${m.author.id}`).setLabel('Done đơn').setStyle(ButtonStyle.Success)
                );
                if (logChan) logChan.send({ embeds: [logEmbed], components: [row] });
                const rep = await m.reply("✅ Đã gửi bill! Ảnh sẽ xóa sau 1 phút.");
                setTimeout(() => { m.delete().catch(() => {}); rep.delete().catch(() => {}); }, 60000);
            });
        }

        // Admin xử lý Approve/Done
        if (interaction.user.id !== ADMIN_ID) return;
        const targetUser = await client.users.fetch(parts[1]).catch(() => null);

        if (parts[0] === 'approve') {
            await interaction.update({ embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setTitle("✅ ĐÃ XÁC NHẬN TIỀN")] });
            if (targetUser) targetUser.send("✅ Admin đã nhận được thanh toán! Đang chuẩn bị giao đồ.");
        } else if (parts[0] === 'done') {
            await interaction.reply({ content: "📸 Admin gửi **Ảnh Proof giao đồ** vào đây!", ephemeral: true });
            const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === ADMIN_ID && m.attachments.size > 0, time: 60000, max: 1 });

            collector.on('collect', async m => {
                const proof = m.attachments.first();
                const doneChan = client.channels.cache.get(DONE_LOG_CHANNEL_ID);
                const oldFields = interaction.message.embeds[0].fields;

                const doneEmbed = new EmbedBuilder().setTitle("🏁 ĐƠN HÀNG HOÀN TẤT").setColor("#00ff00")
                    .addFields(oldFields).setImage(proof.proxyURL).setTimestamp();

                // FIX LỖI ẢNH: Đính kèm file trực tiếp để Discord lưu trữ vĩnh viễn
                if (doneChan) await doneChan.send({ embeds: [doneEmbed], files: [proof.url] });

                await interaction.message.edit({ embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setTitle("🏁 ĐƠN ĐÃ XONG")], components: [] });
                if (targetUser) targetUser.send("🏁 Đơn hàng của bạn đã hoàn tất! Cảm ơn bạn.");
                m.delete().catch(() => {});
            });
        }
    }
});

client.login(process.env.TOKEN);
