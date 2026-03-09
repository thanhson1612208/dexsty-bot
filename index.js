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
        const info = `Thanh toan ${val.toUpperCase()} shop Dexsty`;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${parseInt(price)*1000}&addInfo=${encodeURIComponent(info)}`;
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}_${price}`).setLabel('✅ Đã chuyển khoản').setStyle(ButtonStyle.Success)
        );
        return await interaction.reply({ content: `📦 **Món:** ${val.toUpperCase()}\n💰 **Giá:** ${price}`, files: [qrUrl], components: [row], ephemeral: true });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        
        if (parts[0] === 'paid') {
            await interaction.update({ content: "⏳ Hãy gửi **Ảnh Bill** vào đây! (Bot sẽ xóa sau 1 phút)", components: [] });
            const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            collector.on('collect', async m => {
                const billUrl = m.attachments.first().proxyURL; // Dùng proxyURL để ổn định hơn
                const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
                const logEmbed = new EmbedBuilder()
                    .setTitle("🆕 ĐƠN MỚI")
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

        if (['approve', 'done', 'deny'].includes(parts[0])) {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "Quyền hạn Admin!", ephemeral: true });
            const targetUser = await client.users.fetch(parts[1]).catch(() => null);

            if (parts[0] === 'approve') {
                const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0]).setTitle("✅ ĐÃ NHẬN TIỀN - CHỜ GIAO");
                await interaction.update({ embeds: [updatedEmbed] });
                if (targetUser) targetUser.send("✅ Tiền đã nhận! Chờ Admin giao đồ nhé.");
            } else if (parts[0] === 'done') {
                await interaction.reply({ content: "📸 Admin gửi **Ảnh Proof giao đồ** vào đây ngay!", ephemeral: true });
                const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async m => {
                    const proofUrl = m.attachments.first().proxyURL; // Lấy URL proxy để ảnh không bị mất khi tin nhắn bị xóa
                    const doneChan = client.channels.cache.get(DONE_LOG_CHANNEL_ID);
                    const oldEmbed = interaction.message.embeds[0];

                    const doneEmbed = new EmbedBuilder()
                        .setTitle("🏁 ĐƠN HÀNG HOÀN TẤT")
                        .addFields(oldEmbed.fields)
                        .setImage(proofUrl)
                        .setColor("#00ff00")
                        .setTimestamp();

                    if (doneChan) {
                        // Gửi ảnh dưới dạng file đính kèm ĐỂ CHẮC CHẮN ẢNH KHÔNG BỊ LỖI
                        await doneChan.send({ embeds: [doneEmbed], files: [m.attachments.first().url] });
                    }
                    
                    await interaction.message.edit({ 
                        embeds: [EmbedBuilder.from(oldEmbed).setTitle("🏁 ĐƠN ĐÃ XONG (CHECK LOG)")], 
                        components: [] 
                    });

                    if (targetUser) targetUser.send("🏁 Đơn hàng đã hoàn tất! Cảm ơn bạn.");
                    m.delete().catch(() => {});
                });
            } else if (parts[0] === 'deny') {
                await interaction.update({ content: "❌ Đã từ chối đơn hàng.", embeds: [], components: [] });
                if (targetUser) targetUser.send("❌ Đơn bị từ chối.");
            }
        }
    }
});

client.login(process.env.TOKEN);
