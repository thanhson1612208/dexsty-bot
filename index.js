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
const CHAT_CHUNG_ID = "1471142835414765681"; 

const prices = {
    "darkblade": "170K", "notifier": "370K", "mastery": "55K", "money": "69K", 
    "bossdrop": "69K", "boat": "55K", "storage": "62K", "200rb": "50K",
    "rocket": "8K", "spin": "12K", "chop": "15K", "spring": "26K", "bomb": "31K",
    "smoke": "35K", "spike": "52K", "flame": "76K", "ice": "108K", "sand": "121K",
    "dark": "134K", "light": "137K", "diamond": "156K", "rubber": "168K", "ghost": "178K",
    "magma": "200K", "love": "244K", "buddha": "239K", "portal": "252K", "rumble": "264K",
    "phoenix": "278K", "sound": "291K", "blizzard": "291K", "gravity": "307K", 
    "dough": "314K", "shadow": "320K", "venom": "326K", "control": "332K", 
    "spirit": "332K", "trex": "341K", "mammoth": "348K", "leopard": "425K", 
    "kitsune": "574K", "dragon": "700K"
};

client.once("ready", () => {
    console.log(`✅ Bot Dexsty Shop đã online: ${client.user.tag}`);
});

// --- PHẦN 1: XỬ LÝ LỆNH CHAT ---
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Chặn và thông báo ở kênh chat chung
    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!gaytest"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            return message.reply("❌ **Thông báo:** Bot không được phép sử dụng tại kênh Chat Chung. Vui lòng sang kênh lệnh riêng nhé!")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
        return;
    }

    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        let comment = score <= 2 ? "🗿 Thẳng tắp!" : score <= 5 ? "🤨 Hơi nghi ngờ..." : score <= 8 ? "🌈 Khá rainbow!" : "🏳️‍🌈 Gay Chúa!";
        return message.reply(`🌈 **KẾT QUẢ GAY TEST**\n\n${message.author} có độ gay là: **${score}/10**\n=> *${comment}*`);
    }

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_gp').setPlaceholder('🎮 Game Pass / Robux').addOptions([
                { label: 'Dark Blade', value: 'darkblade', description: '170K' },
                { label: 'Fruit Notifier', value: 'notifier', description: '370K' },
                { label: '2x Mastery', value: 'mastery', description: '55K' },
                { label: '2x Money', value: 'money', description: '69K' },
                { label: '2x Boss Drop', value: 'bossdrop', description: '69K' },
                { label: 'Fast Boat', value: 'boat', description: '55K' },
                { label: '+1 Storage', value: 'storage', description: '62K' },
                { label: '200 Robux (120H)', value: '200rb', description: '50K' },
            ])
        );

        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Trái Vĩnh Viễn (Trang 1)').addOptions([
                { label: 'Perm Rocket', value: 'rocket', description: '8K' }, { label: 'Perm Spin', value: 'spin', description: '12K' },
                { label: 'Perm Chop', value: 'chop', description: '15K' }, { label: 'Perm Spring', value: 'spring', description: '26K' },
                { label: 'Perm Bomb', value: 'bomb', description: '31K' }, { label: 'Perm Smoke', value: 'smoke', description: '35K' },
                { label: 'Perm Spike', value: 'spike', description: '52K' }, { label: 'Perm Flame', value: 'flame', description: '76K' },
                { label: 'Perm Ice', value: 'ice', description: '108K' }, { label: 'Perm Sand', value: 'sand', description: '121K' },
                { label: 'Perm Dark', value: 'dark', description: '134K' }, { label: 'Perm Light', value: 'light', description: '137K' },
                { label: 'Perm Diamond', value: 'diamond', description: '156K' }, { label: 'Perm Rubber', value: 'rubber', description: '168K' },
                { label: 'Perm Ghost', value: 'ghost', description: '178K' },
            ])
        );

        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🔥 Trái Vĩnh Viễn (Trang 2)').addOptions([
                { label: 'Perm Magma', value: 'magma', description: '200K' }, { label: 'Perm Buddha', value: 'buddha', description: '239K' },
                { label: 'Perm Portal', value: 'portal', description: '252K' }, { label: 'Perm Dough', value: 'dough', description: '314K' },
                { label: 'Perm Trex', value: 'trex', description: '341K' }, { label: 'Perm Kitsune', value: 'kitsune', description: '574K' },
                { label: 'Perm Dragon', value: 'dragon', description: '700K' }, { label: 'Perm Leopard', value: 'leopard', description: '425K' },
                // Thêm các trái khác tương tự vào đây nếu cần...
            ])
        );

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEX CĂNG ĐÉT - BẢNG GIÁ DỊCH VỤ')
            .setColor('#00ffcc')
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg')
            .setFooter({ text: 'Vui lòng chọn món để lấy mã QR thanh toán' });

        return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }

    if (message.content === "!admin") {
        const embedAdmin = new EmbedBuilder()
            .setColor(0xff66cc)
            .setTitle("👑 ADMIN DEXSTY SHOP")
            .setDescription("📱 Zalo: **0762706736**")
            .setImage("https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg");
        return message.reply({ embeds: [embedAdmin] });
    }
});

// --- PHẦN 2: XỬ LÝ TƯƠNG TÁC ---
client.on("interactionCreate", async (interaction) => {
    
    // Khách chọn món
    if (interaction.isStringSelectMenu()) {
        const val = interaction.values[0];
        const price = prices[val] || "170K";
        const amount = parseInt(price.replace(/K/g, '')) * 1000;
        const info = `Thanh toan ${val.toUpperCase()} shop Dexsty`;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

        const invoice = `## 🧾 HÓA ĐƠN TẠM TÍNH\n📦 **Món:** ${val.toUpperCase()}\n💰 **Giá:** ${price}\n🏦 **STK:** 1044627277 (VCB)\n📝 **Nội dung:** \`${info}\`\n\n*(Sau khi chuyển khoản, hãy bấm nút dưới đây)*`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}_${price}`).setLabel('✅ Tôi đã chuyển khoản').setStyle(ButtonStyle.Success)
        );

        return await interaction.reply({ content: invoice, files: [qrUrl], components: [row], ephemeral: true });
    }

    // Khách bấm nút xác nhận hoặc Admin duyệt
    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        
        // Khách bấm "Đã chuyển khoản"
        if (parts[0] === 'paid') {
            const item = parts[1];
            const cost = parts[2];
            await interaction.update({ content: "⏳ **Vui lòng gửi Ảnh Bill (Ảnh giao dịch thành công)** vào kênh này để Admin kiểm tra!", components: [], files: [] });

            const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
                const billUrl = m.attachments.first().url;

                const logEmbed = new EmbedBuilder()
                    .setTitle("🆕 ĐƠN HÀNG CẦN DUYỆT")
                    .setColor("#ffff00")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📦 Món", value: item.toUpperCase(), inline: true },
                        { name: "💰 Giá", value: cost, inline: true }
                    )
                    .setImage(billUrl);

                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${interaction.user.id}`).setLabel('Duyệt đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${interaction.user.id}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );

                if (logChannel) logChannel.send({ content: `🔔 <@${ADMIN_ID}>`, embeds: [logEmbed], components: [adminRow] });
                m.reply("✅ Đã gửi bill cho Admin. Vui lòng chờ trong giây lát!");
            });
        }

        // Admin Duyệt/Từ chối
        if (parts[0] === 'approve' || parts[0] === 'deny') {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "Cút!", ephemeral: true });
            const targetUser = await client.users.fetch(parts[1]);

            if (parts[0] === 'approve') {
                await interaction.update({ content: `✅ Đã duyệt cho ${targetUser.tag}`, components: [] });
                targetUser.send("✅ Đơn hàng của bạn đã được duyệt thành công! Liên hệ admin để nhận hàng.");
            } else {
                await interaction.update({ content: `❌ Đã từ chối đơn của ${targetUser.tag}`, components: [] });
                targetUser.send("❌ Đơn hàng của bạn bị từ chối (Bill sai hoặc chưa nhận được tiền).");
            }
        }
    }
});

client.login(process.env.TOKEN);
