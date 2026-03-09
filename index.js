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

// Bảng giá đã sắp xếp từ thấp đến cao
const prices = {
    "rocket": "8K", "spin": "12K", "chop": "15K", "spring": "26K", "bomb": "31K",
    "smoke": "35K", "spike": "52K", "flame": "76K", "ice": "108K", "sand": "121K",
    "dark": "134K", "light": "137K", "diamond": "156K", "rubber": "168K", "ghost": "178K",
    "magma": "200K", "buddha": "239K", "love": "244K", "portal": "252K", "rumble": "264K",
    "phoenix": "278K", "blizzard": "291K", "sound": "291K", "gravity": "307K", 
    "dough": "314K", "shadow": "320K", "venom": "326K", "spirit": "332K", "control": "332K", 
    "trex": "341K", "mammoth": "348K", "leopard": "425K", "yeti": "425K",
    "kitsune": "574K", "dragon": "700K",
    // Gamepass
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
            return message.reply("❌ **Thông báo:** Vui lòng sang kênh lệnh riêng để sử dụng Bot!")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
        return;
    }

    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        return message.reply(`🌈 **KẾT QUẢ GAY TEST**\n\n${message.author} có độ gay là: **${score}/10**`);
    }

    if (message.content === '!menu') {
        // ROW 1: TRÁI GIÁ RẺ (8K - 178K)
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Perm Fruits - Trang 1 (Giá Rẻ)').addOptions([
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

        // ROW 2: TRÁI CAO CẤP (200K - 700K)
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🔥 Perm Fruits - Trang 2 (Cao Cấp)').addOptions([
                { label: 'Perm Magma', value: 'magma', description: '200K' },
                { label: 'Perm Buddha', value: 'buddha', description: '239K' },
                { label: 'Perm Love', value: 'love', description: '244K' },
                { label: 'Perm Portal', value: 'portal', description: '252K' },
                { label: 'Perm Rumble', value: 'rumble', description: '264K' },
                { label: 'Perm Phoenix', value: 'phoenix', description: '278K' },
                { label: 'Perm Blizzard', value: 'blizzard', description: '291K' },
                { label: 'Perm Sound', value: 'sound', description: '291K' },
                { label: 'Perm Gravity', value: 'gravity', description: '307K' },
                { label: 'Perm Dough', value: 'dough', description: '314K' },
                { label: 'Perm Shadow', value: 'shadow', description: '320K' },
                { label: 'Perm Venom', value: 'venom', description: '326K' },
                { label: 'Perm Spirit', value: 'spirit', description: '332K' },
                { label: 'Perm Control', value: 'control', description: '332K' },
                { label: 'Perm T-Rex', value: 'trex', description: '341K' },
                { label: 'Perm Mammoth', value: 'mammoth', description: '348K' },
                { label: 'Perm Leopard', value: 'leopard', description: '425K' },
                { label: 'Perm Yeti', value: 'yeti', description: '425K' },
                { label: 'Perm Kitsune', value: 'kitsune', description: '574K' },
                { label: 'Perm Dragon', value: 'dragon', description: '700K' },
            ])
        );

        // ROW 3: GAMEPASS & ROBUX
        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_gp').setPlaceholder('🎮 Game Pass & Robux').addOptions([
                { label: '200 Robux (120H)', value: '200rb', description: '50K' },
                { label: '2x Mastery', value: 'mastery', description: '55K' },
                { label: 'Fast Boat', value: 'boat', description: '55K' },
                { label: '+1 Storage', value: 'storage', description: '62K' },
                { label: '2x Money', value: 'money', description: '69K' },
                { label: '2x Boss Drop', value: 'bossdrop', description: '69K' },
                { label: 'Dark Blade', value: 'darkblade', description: '170K' },
                { label: 'Fruit Notifier', value: 'notifier', description: '370K' },
            ])
        );

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEX CĂNG ĐÉT - BẢNG GIÁ DỊCH VỤ')
            .setColor('#00ffcc')
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg')
            .setFooter({ text: 'Sắp xếp theo giá từ thấp đến cao' });

        return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
});

// --- PHẦN TƯƠNG TÁC (GIỮ NGUYÊN QUY TRÌNH DUYỆT BILL) ---
client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        const val = interaction.values[0];
        const price = prices[val] || "170K";
        const amount = parseInt(price.replace(/K/g, '')) * 1000;
        const info = `Thanh toan ${val.toUpperCase()} shop Dexsty`;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

        const invoice = `## 🧾 HÓA ĐƠN TẠM TÍNH\n📦 **Món:** ${val.toUpperCase()}\n💰 **Giá:** ${price}\n🏦 **STK:** 1044627277 (VCB)\n📝 **Nội dung:** \`${info}\`\n\n*(Sau khi chuyển khoản, bấm nút bên dưới để gửi Bill)*`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}_${price}`).setLabel('✅ Tôi đã chuyển khoản').setStyle(ButtonStyle.Success)
        );

        return await interaction.reply({ content: invoice, files: [qrUrl], components: [row], ephemeral: true });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        if (parts[0] === 'paid') {
            await interaction.update({ content: "⏳ Hãy gửi **Ảnh Bill** vào đây để Admin duyệt đơn!", components: [], files: [] });
            const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
                const billUrl = m.attachments.first().url;
                const logEmbed = new EmbedBuilder()
                    .setTitle("🆕 ĐƠN MỚI CHỜ DUYỆT")
                    .setColor("#ffff00")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📦 Món", value: parts[1].toUpperCase(), inline: true },
                        { name: "💰 Giá", value: parts[2], inline: true }
                    ).setImage(billUrl);

                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${interaction.user.id}`).setLabel('Duyệt đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${interaction.user.id}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );

                if (logChannel) logChannel.send({ content: `🔔 <@${ADMIN_ID}>`, embeds: [logEmbed], components: [adminRow] });
                m.reply("✅ Đã gửi bill cho Admin!");
            });
        }

        if (parts[0] === 'approve' || parts[0] === 'deny') {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "Quyền hạn Admin!", ephemeral: true });
            const targetUser = await client.users.fetch(parts[1]).catch(() => null);
            if (parts[0] === 'approve') {
                await interaction.update({ content: `✅ Đã duyệt đơn`, components: [] });
                if (targetUser) targetUser.send("✅ Đơn hàng của bạn đã được duyệt!");
            } else {
                await interaction.update({ content: `❌ Đã từ chối đơn`, components: [] });
                if (targetUser) targetUser.send("❌ Đơn hàng bị từ chối.");
            }
        }
    }
});

client.login(process.env.TOKEN);
