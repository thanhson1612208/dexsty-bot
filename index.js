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

// --- CẤU HÌNH ID (BÙI THANH SƠN) ---
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667"; 
const DONE_LOG_CHANNEL_ID = "1479514742841409576"; 

// --- KHỞI TẠO FIREBASE ---
let db = null;
const appId = "dexsty-shop-v2"; // Đổi ID này để làm mới dữ liệu nếu cần

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Bảng giá vật phẩm - Sử dụng số nguyên để tránh lỗi tính toán
const prices = {
    "rocket": 8000, "spin": 12000, "chop": 15000, "spring": 26000, "bomb": 31000,
    "smoke": 35000, "spike": 52000, "flame": 76000, "ice": 108000, "sand": 121000,
    "dark": 134000, "light": 137000, "diamond": 156000, "rubber": 168000, "ghost": 178000,
    "magma": 200000, "buddha": 239000, "love": 244000, "portal": 252000, "rumble": 264000,
    "phoenix": 278000, "blizzard": 291000, "sound": 291000, "gravity": 307000, 
    "dough": 314000, "shadow": 320000, "venom": 326000, "spirit": 332000, "control": 332000, 
    "trex": 341000, "mammoth": 348000, "leopard": 425000, "yeti": 425000,
    "kitsune": 574000, "dragon": 700000,
    "200rb": 50000, "mastery": 55000, "boat": 55000, "storage": 62000, "money": 69000, 
    "bossdrop": 69000, "darkblade": 170000, "notifier": 370000
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
            console.log("✅ Firebase đã kết nối thành công!");
        }
    } catch (e) {
        console.error("❌ Lỗi cấu hình Firebase:", e.message);
    }
    console.log(`🚀 Bot Dexsty Shop đã sẵn sàng: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Lệnh xem bảng xếp hạng
    if (message.content === "!top") {
        if (!db) return message.reply("⚠️ Lỗi: Chưa kết nối được Database!");
        const monthYear = getCurrentMonth();
        const colRef = collection(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`);
        
        try {
            const snapshot = await getDocs(colRef);
            let players = [];
            snapshot.forEach(doc => players.push({ id: doc.id, total: doc.data().total || 0 }));
            players.sort((a, b) => b.total - a.total);

            const topEmbed = new EmbedBuilder()
                .setTitle(`🏆 BẢNG XẾP HẠNG NẠP THÁNG ${monthYear}`)
                .setColor("#F1C40F")
                .setThumbnail("https://cdn-icons-png.flaticon.com/512/5406/5406792.png");

            if (players.length === 0) {
                topEmbed.setDescription("Hiện chưa có ai nạp tiền trong tháng này.");
            } else {
                let list = players.slice(0, 10).map((p, i) => {
                    const icon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
                    return `${icon} **Top ${i+1}:** <@${p.id}> - \`${p.total.toLocaleString()}đ\``;
                }).join("\n");
                topEmbed.setDescription(list);
            }
            return message.channel.send({ embeds: [topEmbed] });
        } catch (e) {
            console.error("Lỗi tải Top:", e);
            return message.reply("❌ Lỗi khi tải dữ liệu từ máy chủ!");
        }
    }

    // Lệnh Menu
    if (message.content === '!menu') {
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('shop_select')
                .setPlaceholder('Chọn vật phẩm bạn muốn mua...')
                .addOptions(Object.entries(prices).slice(0, 25).map(([k, v]) => ({ 
                    label: k.toUpperCase(), 
                    value: k, 
                    description: `Giá: ${v.toLocaleString()}đ` 
                })))
        );

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEXSTY SHOP - BLOX FRUIT')
            .setDescription('Chào mừng bạn đến với shop của Bùi Thanh Sơn! Chọn vật phẩm bên dưới để lấy QR.')
            .setColor('#00ffcc')
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg');

        return message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        const itemKey = interaction.values[0];
        const priceNum = prices[itemKey];
        const info = `Nap ${itemKey} shop Dexsty`.replace(/\s+/g, '%20');
        const qr = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${priceNum}&addInfo=${info}`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`confirm_${interaction.user.id}_${itemKey}_${priceNum}`)
                .setLabel('Tôi đã chuyển tiền')
                .setStyle(ButtonStyle.Success)
        );

        await interaction.reply({ 
            content: `📦 **Sản phẩm:** ${itemKey.toUpperCase()}\n💰 **Giá tiền:** ${priceNum.toLocaleString()}đ\n\nVui lòng quét mã QR để thanh toán.`, 
            files: [qr], 
            components: [row], 
            ephemeral: true 
        });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        const action = parts[0];
        const userId = parts[1];
        const itemKey = parts[2];
        const priceAmount = parseInt(parts[3]);

        if (action === 'confirm') {
            const logChan = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
            if (logChan) {
                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`approve_${userId}_${itemKey}_${priceAmount}`)
                        .setLabel('Duyệt & Cộng Top')
                        .setStyle(ButtonStyle.Primary)
                );
                logChan.send({ 
                    content: `🔔 **ĐƠN MỚI:** <@${userId}> đã báo nạp mua **${itemKey.toUpperCase()}** (\`${priceAmount.toLocaleString()}đ\`)`, 
                    components: [adminRow] 
                });
            }
            await interaction.update({ content: "✅ Đã gửi thông báo cho Admin! Vui lòng đợi duyệt.", components: [], files: [] });
        }

        if (action === 'approve') {
            if (interaction.user.id !== ADMIN_ID) return;

            // Xử lý cộng tiền vào Firebase
            if (db) {
                const monthYear = getCurrentMonth();
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`, userId);
                
                try {
                    const snap = await getDoc(userRef);
                    if (!snap.exists()) {
                        await setDoc(userRef, { total: priceAmount });
                    } else {
                        await updateDoc(userRef, { total: increment(priceAmount) });
                    }
                    console.log(`✅ Đã cộng ${priceAmount} cho user ${userId}`);
                } catch (e) {
                    console.error("❌ Lỗi khi cộng tiền Firebase:", e);
                }
            }

            await interaction.update({ content: `✅ Đã duyệt và cộng tiền thành công cho <@${userId}>!`, components: [] });
            
            const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
            if (doneChan) {
                const doneEmbed = new EmbedBuilder()
                    .setTitle("🎉 GIAO DỊCH THÀNH CÔNG")
                    .setColor("#2ECC71")
                    .addFields(
                        { name: "👤 Khách hàng", value: `<@${userId}>`, inline: true },
                        { name: "📦 Sản phẩm", value: `${itemKey.toUpperCase()}`, inline: true },
                        { name: "💰 Số tiền", value: `\`${priceAmount.toLocaleString()}đ\``, inline: true }
                    )
                    .setTimestamp();
                doneChan.send({ content: `<@${userId}>`, embeds: [doneEmbed] });
            }
        }
    }
});

client.login(process.env.TOKEN);
