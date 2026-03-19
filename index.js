const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    StringSelectMenuBuilder 
} = require('discord.js');
const { initializeApp } = require('firebase/app');
const { 
    getFirestore, doc, setDoc, getDoc, collection, 
    getDocs, updateDoc, increment 
} = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

// --- CẤU HÌNH HỆ THỐNG ---
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667"; 
const DONE_LOG_CHANNEL_ID = "1479514742841409576"; 
const CHAT_CHUNG_ID = "1471142835414765681"; 
const appId = "dexsty-shop"; 

// --- KHỞI TẠO FIREBASE ---
let db = null;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
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

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getMonth() + 1}-${now.getFullYear()}`;
};

client.once("ready", async () => {
    try {
        const configRaw = process.env.__firebase_config;
        if (configRaw) {
            const fbApp = initializeApp(JSON.parse(configRaw));
            db = getFirestore(fbApp);
            const auth = getAuth(fbApp);
            await signInAnonymously(auth);
            console.log("✅ Kết nối Database thành công!");
        }
    } catch (e) { console.error("❌ Lỗi Firebase:", e.message); }
    console.log(`🚀 Bot Dexsty Shop Online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Chặn lệnh tại chat chung
    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!top"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            const warning = await message.reply("❌ Sang kênh lệnh riêng để dùng nhé!");
            setTimeout(() => { message.delete().catch(() => {}); warning.delete().catch(() => {}); }, 5000);
            return;
        }
    }

    if (message.content === "!top") {
        if (!db) return message.reply("⚠️ Lỗi kết nối Database!");
        const monthYear = getCurrentMonth();
        const colRef = collection(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`);
        try {
            const snapshot = await getDocs(colRef);
            let players = [];
            snapshot.forEach(doc => players.push({ id: doc.id, total: doc.data().total || 0 }));
            players.sort((a, b) => b.total - a.total);

            const embed = new EmbedBuilder()
                .setTitle(`🏆 TOP NẠP THÁNG ${monthYear}`)
                .setColor("#F1C40F")
                .setDescription(players.length === 0 ? "Chưa có ai nạp." : players.slice(0, 10).map((p, i) => `${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹"} <@${p.id}>: \`${p.total.toLocaleString()}đ\``).join("\n"));
            return message.channel.send({ embeds: [embed] });
        } catch (e) { return message.reply("❌ Lỗi tải dữ liệu!"); }
    }

    if (message.content === "!admin") {
        const adminEmbed = new EmbedBuilder()
            .setTitle("🛡️ TRUNG TÂM HỖ TRỢ KHÁCH HÀNG")
            .setColor("#00D1FF")
            .setDescription("Chào bạn! Nếu bạn gặp bất kỳ vấn đề gì, hãy liên hệ trực tiếp với Admin.");
        const adminRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Facebook: Bùi Thanh Sơn').setStyle(ButtonStyle.Link).setURL('https://www.facebook.com/share/17P4Xrx6bf/'),
            new ButtonBuilder().setLabel('Liên hệ qua Zalo').setStyle(ButtonStyle.Link).setURL('https://zalo.me/0762706736')
        );
        return message.channel.send({ embeds: [adminEmbed], components: [adminRow] });
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
        await interaction.deferReply({ ephemeral: true });
        const val = interaction.values[0];
        const priceStr = prices[val] || "0";
        const amount = parseInt(priceStr.replace(/K/g, '')) * 1000;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=Thanh+toan+${val}+shop+Dexsty`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${val}_${priceStr}`).setLabel('✅ Chuyển Khoản').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`card_${val}_${priceStr}`).setLabel('💳 Thẻ Cào (Phí 15%)').setStyle(ButtonStyle.Primary)
        );

        await interaction.editReply({
            content: `## 🛒 THÔNG TIN ĐƠN HÀNG\n📦 **Món:** ${val.toUpperCase()}\n💰 **Giá:** ${priceStr}`,
            files: [qrUrl], components: [row]
        });
    }

    if (interaction.isButton()) {
        if (interaction.component.style === ButtonStyle.Link) return;
        const [action, item, price] = interaction.customId.split('_');

        // --- XỬ LÝ KHÁCH HÀNG ---
        if (action === 'card' || action === 'paid') {
            await interaction.update({ content: action === 'card' ? "💳 Gửi thẻ: `Loại - Mệnh giá - Mã - Seri`" : "⏳ Gửi Ảnh Bill vào đây!", components: [], files: [] });
            const filter = m => m.author.id === interaction.user.id && (action === 'paid' ? m.attachments.size > 0 : true);
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            
            collector.on('collect', async m => {
                const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
                if (!logChannel) return;
                const logEmbed = new EmbedBuilder()
                    .setTitle(action === 'card' ? "💳 ĐƠN THẺ CÀO" : "🆕 ĐƠN CHUYỂN KHOẢN")
                    .setColor(action === 'card' ? "#9b59b6" : "#ffff00")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📦 Món", value: item.toUpperCase(), inline: true },
                        { name: "💰 Giá", value: price, inline: true }
                    );
                if (action === 'paid') logEmbed.setImage(m.attachments.first().proxyURL);
                else logEmbed.addFields({ name: "🎫 Nội dung", value: `\`${m.content}\`` });

                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${interaction.user.id}_${item}_${price}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`done_${interaction.user.id}_${item}_${price}`).setLabel('Done đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${interaction.user.id}_${item}_${price}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );
                await logChannel.send({ embeds: [logEmbed], components: [adminRow] });
                m.reply("✅ Đã gửi! Đợi Admin check nhé.");
            });
        }

        // --- XỬ LÝ ADMIN ---
        if (['approve', 'done', 'deny'].includes(action)) {
            if (interaction.user.id !== ADMIN_ID) return;
            const targetUserId = item; // Ở đây item chứa userId do split customId
            const itemName = price; // Ở đây price chứa tên món
            const priceVal = interaction.customId.split('_')[3]; // Giá thực tế

            if (action === 'approve') {
                let amount = parseInt(priceVal.replace(/K/g, '')) * 1000;
                if (db && !isNaN(amount)) {
                    const monthYear = getCurrentMonth();
                    const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`, targetUserId);
                    const snap = await getDoc(userRef);
                    if (!snap.exists()) await setDoc(userRef, { total: amount });
                    else await updateDoc(userRef, { total: increment(amount) });
                }
                await interaction.update({ content: `✅ Đã duyệt tiền ${priceVal} cho <@${targetUserId}>`, components: [interaction.message.components[0]] });
            } 

            if (action === 'done') {
                await interaction.reply({ content: "📸 Admin gửi Ảnh Proof giao đồ vào đây!", ephemeral: true });
                const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
                collector.on('collect', async m => {
                    const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
                    const doneEmbed = new EmbedBuilder()
                        .setTitle("🏁 GIAO DỊCH HOÀN TẤT")
                        .setColor("#2ecc71")
                        .addFields(
                            { name: "👤 Khách", value: `<@${targetUserId}>`, inline: true },
                            { name: "📦 Món", value: itemName.toUpperCase(), inline: true },
                            { name: "💰 Giá", value: priceVal, inline: true }
                        )
                        .setImage(m.attachments.first().proxyURL).setTimestamp();
                    if (doneChan) doneChan.send({ content: `🎊 <@${targetUserId}> đã xong đồ!`, embeds: [doneEmbed] });
                    await interaction.message.edit({ content: "🏁 ĐÃ XONG!", components: [] });
                });
            }

            if (action === 'deny') {
                await interaction.update({ content: "❌ Đã từ chối đơn.", components: [] });
            }
        }
    }
});

client.login(process.env.TOKEN);
