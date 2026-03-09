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

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!gaytest"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            return message.reply({ 
                content: "❌ **Thông báo:** Bot không được phép sử dụng tại kênh Chat Chung. Vui lòng sang kênh lệnh riêng nhé!",
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
        return;
    }

    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        return message.reply(`🌈 **KẾT QUẢ GAY TEST**\n\n${message.author} có độ gay là: **${score}/10**`);
    }

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_gamepass').setPlaceholder('🎮 Game Pass / Robux').addOptions([
                { label: 'Dark Blade', value: 'darkblade', description: '170K' },
                { label: 'Fruit Notifier', value: 'notifier', description: '370K' },
                { label: '2x Mastery', value: 'mastery', description: '55K' },
                { label: '2x Money', value: 'money', description: '69K' },
                { label: '2x Boss Drop', value: 'bossdrop', description: '69K' },
                { label: '+1 Storage', value: 'storage', description: '62K' },
                { label: '200 Robux', value: '200rb', description: '50K' },
            ])
        );
        // ... (Row 2 và Row 3 giữ nguyên như bản cũ)
        // ... (Để tiết kiệm không gian mình chỉ viết mẫu Row 1, bạn copy Row 2, 3 từ bản cũ vào nhé)

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEX CĂNG ĐÉT - BẢNG GIÁ DỊCH VỤ')
            .setColor('#00ffcc')
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg');

        return message.channel.send({ embeds: [embed], components: [row1] }); // Nhớ thêm row2, row3 vào đây
    }
});

client.on("interactionCreate", async (interaction) => {
    
    // 1. KHI KHÁCH CHỌN MÓN
    if (interaction.isStringSelectMenu()) {
        const selectedValue = interaction.values[0];
        const priceStr = prices[selectedValue] || "170K";
        const amount = parseInt(priceStr.replace(/K/g, '')) * 1000;
        const info = `Thanh toan ${selectedValue.toUpperCase()} shop Dexsty`;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

        const invoice = `## 🧾 HÓA ĐƠN TẠM TÍNH\n👤 **Khách:** ${interaction.user.username}\n📦 **Món:** ${selectedValue.toUpperCase()}\n💰 **Giá:** ${priceStr}\n\n🏦 **Chuyển khoản:** Vietcombank - 1044627277\n📝 **Nội dung:** \`${info}\`\n\n*(Vui lòng CK xong rồi bấm nút xác nhận dưới đây)*`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`confirm_paid_${selectedValue}_${priceStr}`)
                .setLabel('✅ Tôi đã chuyển khoản thành công')
                .setStyle(ButtonStyle.Success)
        );

        return await interaction.reply({ content: invoice, files: [qrUrl], components: [row], ephemeral: true });
    }

    // 2. KHI KHÁCH BẤM NÚT XÁC NHẬN ĐÃ CK
    if (interaction.isButton()) {
        const [action, status, item, price] = interaction.customId.split('_');

        if (action === 'confirm') {
            await interaction.update({ content: "⏳ **Hệ thống đang chờ:** Bạn hãy gửi **Ảnh Bill (Ảnh chụp giao diện CK thành công)** vào đây để Admin kiểm tra và duyệt đơn nhé!", components: [], files: [] });

            // Tạo bộ lọc chờ khách gửi ảnh
            const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
                const billImage = m.attachments.first().url;

                const logEmbed = new EmbedBuilder()
                    .setTitle("🆕 ĐƠN HÀNG MỚI ĐÃ THANH TOÁN")
                    .setColor(ButtonStyle.Success)
                    .addFields(
                        { name: "👤 Khách hàng", value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                        { name: "📦 Dịch vụ", value: item.toUpperCase(), inline: true },
                        { name: "💰 Số tiền", value: price, inline: true }
                    )
                    .setImage(billImage) // Hiện ảnh bill khách gửi
                    .setTimestamp();

                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`accept_order_${interaction.user.id}`).setLabel('Duyệt đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`cancel_order_${interaction.user.id}`).setLabel('Hủy/Sai Bill').setStyle(ButtonStyle.Danger)
                );

                if (logChannel) logChannel.send({ content: `🔔 <@${ADMIN_ID}> có đơn mới!`, embeds: [logEmbed], components: [adminRow] });
                
                m.reply("✅ Đã gửi minh chứng thanh toán cho Admin. Vui lòng chờ 1-5 phút để được xử lý!");
            });
        }

        // Xử lý nút Duyệt/Hủy của Admin (như cũ)
        if (action === 'accept' || action === 'cancel') {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "Bạn không có quyền!", ephemeral: true });
            const targetId = price; // Trong ID này price thực chất là ID khách
            const user = await client.users.fetch(targetId);
            
            if (action === 'accept') {
                await interaction.update({ content: `✅ Đã duyệt đơn cho khách ${user.tag}`, components: [] });
                user.send("📦 Đơn hàng của bạn đã được duyệt! Vui lòng liên hệ Admin để nhận đồ.");
            } else {
                await interaction.update({ content: `❌ Đã hủy đơn của khách ${user.tag}`, components: [] });
                user.send("❌ Đơn hàng bị hủy do bill không hợp lệ. Vui lòng kiểm tra lại.");
            }
        }
    }
});

client.login(process.env.TOKEN);
