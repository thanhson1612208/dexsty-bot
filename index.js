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
let orderCount = 0;

// Cập nhật giá chính xác theo ảnh bảng giá
const prices = {
    "drop": "170K", "notifier": "370K", "mastery": "55K", "money": "69K", 
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

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_gamepass')
                .setPlaceholder('🎮 Chọn Game Pass / Robux')
                .addOptions([
                    { label: 'Dark Blade', value: 'drop', description: '170K' },
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
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg')
            .setFooter({ text: 'Check kĩ thông tin trước khi chuyển khoản' });

        return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }

    if (message.content === "!admin") {
        const embedAdmin = new EmbedBuilder()
            .setColor(0xff66cc)
            .setTitle("👑 ADMIN DEXSTY BLOX FRUITS SHOP")
            .setDescription("💬 Có vấn đề hay thắc mắc thì inbox cho admin :")
            .addFields(
                { name: "💬 Zalo / SĐT", value: "📱 **0762706736**" },
                { name: "⚡ Thời gian phản hồi", value: "⏰ 1 - 5 phút" }
            )
            .setImage("https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg")
            .setFooter({ text: "DEXSTY SHOP • Uy tín - Nhanh chóng - Giá rẻ 💎" });

        const rowAdmin = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("📘 Facebook Admin").setStyle(ButtonStyle.Link).setURL("https://www.facebook.com/share/18HtqxaCu4/")
        );
        return message.reply({ embeds: [embedAdmin], components: [rowAdmin] });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        const selectedValue = interaction.values[0];
        const priceStr = prices[selectedValue] || "Liên hệ Admin";
        const amount = parseInt(priceStr.replace(/K/g, '')) * 1000 || 0;
        const info = `Thanh toan ${selectedValue.toUpperCase()} shop Dexsty`;
        const description = encodeURIComponent(info);
        
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${description}`;

        const invoice = `## 🧾 HÓA ĐƠN DEXSTY SHOP\n👤 **Khách hàng:** ${interaction.user.username}\n📦 **Dịch vụ:** ${selectedValue.toUpperCase()}\n💰 **Giá tiền:** ${priceStr}\n──────────────────\n🏦 **Thông tin thanh toán (VIETCOMBANK):**\n- **Ngân hàng:** Vietcombank (VCB)\n- **STK:** 1044627277\n- **Chủ TK:** BUI THANH SON\n- **Nội dung CK:** \`${info}\`\n──────────────────\n*(Quét mã QR để thanh toán tự động)*`;

        return await interaction.reply({ content: invoice, files: [qrUrl], ephemeral: true });
    }

    if (interaction.isButton()) {
        if (!interaction.customId.includes("order_")) return;
        if (interaction.user.id !== ADMIN_ID) {
            return interaction.reply({ content: "❌ Bạn không phải Admin!", ephemeral: true });
        }

        const userId = interaction.customId.split("_").pop();
        const user = await client.users.fetch(userId).catch(() => null);

        if (interaction.customId.startsWith("accept_order_")) {
            await interaction.update({ content: `✅ Đơn đã được nhận bởi ${interaction.user}`, components: [] });
            if (user) user.send(`📦 Đơn của bạn đã được shop nhận bởi ${interaction.user}!`).catch(() => {});
        } 
        else if (interaction.customId.startsWith("cancel_order_")) {
            await interaction.update({ content: `❌ Đơn đã bị hủy bởi ${interaction.user}`, components: [] });
            if (user) user.send(`❌ Đơn của bạn đã bị hủy bởi shop.`).catch(() => {});
        }
    }
});

client.login(process.env.TOKEN); 
 
