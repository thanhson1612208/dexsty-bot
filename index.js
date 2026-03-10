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
        GatewayIntentBits.MessageContent
    ]
});

// --- CẤU HÌNH ---
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

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!gaytest"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            return message.reply("❌ Không dùng lệnh ở đây! Sang kênh lệnh riêng nhé.")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
        return;
    }
    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        return message.reply(`🌈 Độ gay của ${message.author} là: **${score}/10**`);
    }
    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Trái Vĩnh Viễn 1').addOptions(
                Object.entries(prices).slice(0, 15).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: v }))
            )
        );
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🍎 Trái Vĩnh Viễn 2').addOptions(
                Object.entries(prices).slice(15, 35).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: v }))
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
        return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        const val = interaction.values[0];
        const price = prices[val] || "N/A";
        const amount = parseInt(price) * 1000;
        const info = `Thanh toan ${val.toUpperCase()} shop Dexsty`;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}_${price}`).setLabel('✅ Chuyển Khoản').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`card_${val}_${price}`).setLabel('💳 Thẻ Garena/Viettel (Phí 15%)').setStyle(ButtonStyle.Primary)
        );

        return await interaction.reply({ 
            content: `## 🛒 THÔNG TIN ĐƠN HÀNG\n📦 **Món:** ${val.toUpperCase()}\n💰 **Giá CK:** ${price}\n⚠️ **Lưu ý:** Nếu thanh toán bằng **Thẻ Cào (Garena/Viettel)**, bạn sẽ chịu phí chiết khấu **15%** (Ví dụ: Thẻ 100k Admin nhận được 85k).`, 
            files: [qrUrl], 
            components: [row], 
            ephemeral: true 
        });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        
        // XỬ LÝ THANH TOÁN THẺ CÀO (GARENA & VIETTEL)
        if (parts[0] === 'card') {
            await interaction.update({ 
                content: `💳 **THANH TOÁN THẺ CÀO (PHÍ 15%)**\n- Loại thẻ hỗ trợ: **Garena, Viettel**\n- Admin chỉ nhận được **85%** giá trị thẻ bạn gửi.\n\n👉 Bạn hãy nhập thông tin theo mẫu: \`Loại thẻ - Mệnh giá - Mã thẻ - Seri\` vào đây!`, 
                components: [], 
                files: [] 
            });

            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
                const logEmbed = new EmbedBuilder()
                    .setTitle("💳 ĐƠN THẺ CÀO MỚI")
                    .setColor("#9b59b6")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📦 Món", value: parts[1].toUpperCase(), inline: true },
                        { name: "💰 Giá niêm yết", value: parts[2], inline: true },
                        { name: "🎫 Thông tin thẻ", value: `\`${m.content}\`` },
                        { name: "⚠️ Chiết khấu", value: "15% (Garena/Viettel)" }
                    );

                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${interaction.user.id}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`done_${interaction.user.id}`).setLabel('Done đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${interaction.user.id}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );

                if (logChannel) logChannel.send({ content: `🔔 <@${ADMIN_ID}> CÓ ĐƠN THẺ CÀO!`, embeds: [logEmbed], components: [adminRow] });
                m.reply("✅ Đã gửi thông tin thẻ cho Admin. Vui lòng chờ kiểm tra!");
            });
        }

        // XỬ LÝ THANH TOÁN CHUYỂN KHOẢN
        if (parts[0] === 'paid') {
            await interaction.update({ content: "⏳ Hãy gửi **Ảnh Bill** vào đây! (Bot sẽ xóa sau 1 phút)", components: [] });
            const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            collector.on('collect', async m => {
                const billUrl = m.attachments.first().proxyURL;
                const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
                const logEmbed = new EmbedBuilder()
                    .setTitle("🆕 ĐƠN CHUYỂN KHOẢN")
                    .addFields({ name: "👤 Khách", value: `<@${m.author.id}>` }, { name: "📦 Món", value: parts[1].toUpperCase() }, { name: "💰 Giá", value: parts[2] })
                    .setImage(billUrl).setColor("#ffff00");
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${m.author.id}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`done_${m.author.id}`).setLabel('Done đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${m.author.id}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );
                if (logChannel) logChannel.send({ embeds: [logEmbed], components: [row] });
                const rep = await m.reply("✅ Đã gửi bill! Ảnh sẽ xóa sau 1 phút.");
                setTimeout(() => { m.delete().catch(() => {}); rep.delete().catch(() => {}); }, 60000);
            });
        }

        // ADMIN XỬ LÝ
        if (['approve', 'done', 'deny'].includes(parts[0])) {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "Quyền hạn Admin!", ephemeral: true });
            const targetUser = await client.users.fetch(parts[1]).catch(() => null);

            if (parts[0] === 'approve') {
                const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0]).setTitle("✅ ĐÃ XÁC NHẬN THANH TOÁN");
                await interaction.update({ embeds: [updatedEmbed] });
                if (targetUser) targetUser.send("✅ Admin đã xác nhận thanh toán thành công! Vui lòng chờ giao đồ.");
            } else if (parts[0] === 'done') {
                await interaction.reply({ content: "📸 Admin gửi **Ảnh Proof giao đồ** vào đây!", ephemeral: true });
                const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async m => {
                    const proofUrl = m.attachments.first().proxyURL;
                    const doneChan = client.channels.cache.get(DONE_LOG_CHANNEL_ID);
                    const oldEmbed = interaction.message.embeds[0];

                    const doneEmbed = new EmbedBuilder()
                        .setTitle("🏁 ĐƠN HÀNG HOÀT TẤT")
                        .addFields(oldEmbed.fields)
                        .setImage(proofUrl)
                        .setColor("#00ff00")
                        .setTimestamp();

                    if (doneChan) await doneChan.send({ embeds: [doneEmbed], files: [m.attachments.first().url] });
                    await interaction.message.edit({ embeds: [EmbedBuilder.from(oldEmbed).setTitle("🏁 ĐƠN ĐÃ XONG (CHECK LOG)")], components: [] });
                    if (targetUser) targetUser.send("🏁 Đơn hàng đã hoàn tất! Cảm ơn bạn.");
                    m.delete().catch(() => {});
                });
            } else if (parts[0] === 'deny') {
                await interaction.update({ content: "❌ Đơn hàng đã bị từ chối.", embeds: [], components: [] });
                if (targetUser) targetUser.send("❌ Đơn hàng bị từ chối. Vui lòng liên hệ Admin.");
            }
        }
    }
});

client.login(process.env.TOKEN);
