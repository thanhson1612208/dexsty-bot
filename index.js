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

// --- CẤU HÌNH HỆ THỐNG (BÙI THANH SƠN) ---
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667"; 
const DONE_LOG_CHANNEL_ID = "1479514742841409576"; 
const DONE_IMAGE_URL = "https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg"; // Ảnh khi xong đơn

// --- KHỞI TẠO FIREBASE ---
let db = null;
const appId = "dexsty-shop"; 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// DANH SÁCH GIÁ CẢ (SỐ NGUYÊN)
const fruitsNormal = {
    "rocket": 8000, "spin": 12000, "chop": 15000, "spring": 26000, "bomb": 31000,
    "smoke": 35000, "spike": 52000, "flame": 76000, "ice": 108000, "sand": 121000,
    "dark": 134000, "light": 137000, "diamond": 156000, "rubber": 168000, "ghost": 178000,
    "magma": 200000, "buddha": 239000, "love": 244000, "portal": 252000, "rumble": 264000
};

const fruitsVip = {
    "phoenix": 278000, "blizzard": 291000, "sound": 291000, "gravity": 307000, 
    "dough": 314000, "shadow": 320000, "venom": 326000, "spirit": 332000, "control": 332000, 
    "trex": 341000, "mammoth": 348000, "leopard": 425000, "yeti": 425000,
    "kitsune": 574000, "dragon": 700000
};

const gamepasses = {
    "200rb": 50000, "mastery": 55000, "boat": 55000, "storage": 62000, "money": 69000, 
    "bossdrop": 69000, "darkblade": 170000, "notifier": 370000
};

const allPrices = { ...fruitsNormal, ...fruitsVip, ...gamepasses };

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
            console.log("✅ Firebase Connected!");
        }
    } catch (e) { console.error("❌ Firebase Error:", e.message); }
    console.log(`🚀 Bot Dexsty Shop Online!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!top") {
        if (!db) return message.reply("⚠️ Lỗi kết nối!");
        const monthYear = getCurrentMonth();
        const colRef = collection(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`);
        try {
            const snapshot = await getDocs(colRef);
            let players = [];
            snapshot.forEach(doc => {
                const d = doc.data();
                if (d.total) players.push({ id: doc.id, total: d.total });
            });
            players.sort((a, b) => b.total - a.total);

            const embed = new EmbedBuilder()
                .setTitle(`🏆 TOP NẠP THÁNG ${monthYear}`)
                .setColor("#F1C40F")
                .setDescription(players.length === 0 ? "Chưa có ai nạp." : players.slice(0, 10).map((p, i) => `${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹"} <@${p.id}>: \`${p.total.toLocaleString()}đ\``).join("\n"));
            return message.channel.send({ embeds: [embed] });
        } catch (e) { return message.reply("❌ Lỗi dữ liệu!"); }
    }

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('m1').setPlaceholder('🍎 Trái Ác Quỷ (Phổ Thông)...')
            .addOptions(Object.entries(fruitsNormal).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v.toLocaleString()}đ` })))
        );
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('m2').setPlaceholder('🔥 Trái Ác Quỷ (Cao Cấp)...')
            .addOptions(Object.entries(fruitsVip).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v.toLocaleString()}đ` })))
        );
        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('m3').setPlaceholder('💎 Gamepass & Vật phẩm...')
            .addOptions(Object.entries(gamepasses).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v.toLocaleString()}đ` })))
        );

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEXSTY SHOP - MUA HÀNG TỰ ĐỘNG')
            .setDescription('**Chủ Shop:** Bùi Thanh Sơn\n\nVui lòng chọn sản phẩm bên dưới để lấy mã thanh toán.\n\n🍎 **Nhóm 1:** Rocket -> Rumble\n🔥 **Nhóm 2:** Phoenix -> Dragon\n💎 **Nhóm 3:** Gamepass & VIP')
            .setColor('#00ffcc')
            .setImage(DONE_IMAGE_URL);

        return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        const key = interaction.values[0];
        const price = allPrices[key];
        const qr = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${price}&addInfo=Nap%20${key}`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`cf_${interaction.user.id}_${key}_${price}`).setLabel('Tôi đã chuyển tiền').setStyle(ButtonStyle.Success)
        );

        await interaction.reply({ 
            content: `📦 **${key.toUpperCase()}** - 💰 **${price.toLocaleString()}đ**\nSau khi chuyển tiền, nhấn nút bên dưới để báo Admin duyệt.`, 
            files: [qr], components: [row], ephemeral: true 
        });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        const action = parts[0];
        const userId = parts[1];
        const item = parts[2];
        const priceStr = parts[3];

        if (action === 'cf') {
            const logChan = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
            if (logChan) {
                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`ap_${userId}_${item}_${priceStr}`).setLabel('✅ Duyệt Đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`rj_${userId}_${item}_${priceStr}`).setLabel('❌ Từ Chối').setStyle(ButtonStyle.Danger)
                );
                logChan.send({ 
                    content: `🔔 **ĐƠN MỚI:** <@${userId}> báo đã nạp **${item.toUpperCase()}** (\`${parseInt(priceStr).toLocaleString()}đ\`)`, 
                    components: [adminRow] 
                });
            }
            await interaction.update({ content: "✅ Đã gửi báo cáo cho Admin! Vui lòng đợi trong giây lát.", components: [], files: [] });
        }

        if (action === 'ap') {
            if (interaction.user.id !== ADMIN_ID) return;
            const amount = parseInt(priceStr);

            if (db && !isNaN(amount)) {
                const monthYear = getCurrentMonth();
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`, userId);
                try {
                    const snap = await getDoc(userRef);
                    if (!snap.exists()) await setDoc(userRef, { total: amount });
                    else await updateDoc(userRef, { total: increment(amount) });
                } catch (err) { console.error(err); }
            }

            await interaction.update({ content: `✅ Đã duyệt và cộng Top nạp cho <@${userId}>!`, components: [] });
            
            const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
            if (doneChan) {
                const doneEmbed = new EmbedBuilder()
                    .setTitle("🎉 GIAO DỊCH THÀNH CÔNG")
                    .setColor("#2ECC71")
                    .addFields(
                        { name: "👤 Khách hàng", value: `<@${userId}>`, inline: true },
                        { name: "📦 Sản phẩm", value: `${item.toUpperCase()}`, inline: true },
                        { name: "💰 Giá trị", value: `\`${amount.toLocaleString()}đ\``, inline: true }
                    )
                    .setImage(DONE_IMAGE_URL) // Ảnh done đơn
                    .setTimestamp();
                doneChan.send({ content: `🎉 Chúc mừng <@${userId}> nạp thành công!`, embeds: [doneEmbed] });
            }
        }

        if (action === 'rj') {
            if (interaction.user.id !== ADMIN_ID) return;
            await interaction.update({ content: `❌ Đã từ chối đơn nạp của <@${userId}>.`, components: [] });
            
            try {
                const user = await client.users.fetch(userId);
                user.send(`❌ Đơn nạp **${item.toUpperCase()}** của bạn đã bị từ chối. Vui lòng liên hệ Admin nếu có nhầm lẫn.`);
            } catch (e) {}
        }
    }
});

client.login(process.env.TOKEN);
