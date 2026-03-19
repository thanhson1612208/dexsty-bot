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

// NHÓM 1: TRÁI PHỔ THÔNG
const fruitsNormal = {
    "rocket": 8000, "spin": 12000, "chop": 15000, "spring": 26000, "bomb": 31000,
    "smoke": 35000, "spike": 52000, "flame": 76000, "ice": 108000, "sand": 121000,
    "dark": 134000, "light": 137000, "diamond": 156000, "rubber": 168000, "ghost": 178000,
    "magma": 200000, "buddha": 239000, "love": 244000, "portal": 252000, "rumble": 264000
};

// NHÓM 2: TRÁI CAO CẤP
const fruitsVip = {
    "phoenix": 278000, "blizzard": 291000, "sound": 291000, "gravity": 307000, 
    "dough": 314000, "shadow": 320000, "venom": 326000, "spirit": 332000, "control": 332000, 
    "trex": 341000, "mammoth": 348000, "leopard": 425000, "yeti": 425000,
    "kitsune": 574000, "dragon": 700000
};

// NHÓM 3: GAMEPASS
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
            console.log("✅ Kết nối Firebase thành công!");
        }
    } catch (e) { console.error("❌ Lỗi cấu hình Firebase:", e.message); }
    console.log(`🚀 Bot Dexsty Shop đã sẵn sàng phục vụ!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!top") {
        if (!db) return message.reply("⚠️ Lỗi: Không có kết nối Database!");
        const monthYear = getCurrentMonth();
        const colRef = collection(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`);
        
        try {
            const snapshot = await getDocs(colRef);
            let players = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data && typeof data.total === 'number') {
                    players.push({ id: doc.id, total: data.total });
                }
            });
            players.sort((a, b) => b.total - a.total);

            const embed = new EmbedBuilder()
                .setTitle(`🏆 BẢNG XẾP HẠNG NẠP THÁNG ${monthYear}`)
                .setColor("#F1C40F")
                .setThumbnail("https://cdn-icons-png.flaticon.com/512/5406/5406792.png")
                .setTimestamp();

            if (players.length === 0) {
                embed.setDescription("Chưa có dữ liệu nạp tiền trong tháng này.");
            } else {
                let desc = players.slice(0, 10).map((p, i) => {
                    const icon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
                    return `${icon} **Top ${i+1}:** <@${p.id}> - \`${p.total.toLocaleString()}đ\``;
                }).join("\n");
                embed.setDescription(desc);
            }
            return message.channel.send({ embeds: [embed] });
        } catch (e) { return message.reply("❌ Lỗi khi truy xuất dữ liệu!"); }
    }

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_normal')
                .setPlaceholder('🍎 Trái Ác Quỷ (Phổ Thông)...')
                .addOptions(Object.entries(fruitsNormal).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v.toLocaleString()}đ` })))
        );

        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_vip')
                .setPlaceholder('🔥 Trái Ác Quỷ (Cao Cấp)...')
                .addOptions(Object.entries(fruitsVip).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v.toLocaleString()}đ` })))
        );

        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_pass')
                .setPlaceholder('💎 Gamepass & Vật phẩm VIP...')
                .addOptions(Object.entries(gamepasses).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v.toLocaleString()}đ` })))
        );

        const embed = new EmbedBuilder()
            .setTitle('🛒 DEXSTY SHOP - MENU MUA HÀNG')
            .setDescription('**Chủ Shop:** Bùi Thanh Sơn\n\nVui lòng chọn sản phẩm bên dưới để nhận mã thanh toán QR.\n\n🍎 **Menu 1:** Trái Rocket -> Rumble\n🔥 **Menu 2:** Trái Phoenix -> Dragon\n💎 **Menu 3:** Các loại Gamepass')
            .setColor('#00ffcc')
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg');

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
            content: `📦 **SẢN PHẨM:** ${key.toUpperCase()}\n💰 **GIÁ TIỀN:** ${price.toLocaleString()}đ\n\nSau khi chuyển tiền xong, vui lòng nhấn nút dưới đây để Admin duyệt đơn.`, 
            files: [qr], 
            components: [row], 
            ephemeral: true 
        });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        const action = parts[0];
        const userId = parts[1];
        const item = parts[2];
        const priceRaw = parts[3];

        if (action === 'cf' || action === 'confirm') {
            const logChan = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
            if (logChan) {
                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`ap_${userId}_${item}_${priceRaw}`).setLabel('Duyệt Đơn').setStyle(ButtonStyle.Primary)
                );
                logChan.send({ content: `🔔 **ĐƠN MỚI:** <@${userId}> báo nạp mua **${item.toUpperCase()}** (\`${parseInt(priceRaw).toLocaleString()}đ\`)`, components: [adminRow] });
            }
            await interaction.update({ content: "✅ Đã báo cho Admin! Vui lòng đợi kiểm tra.", components: [], files: [] });
        }

        if (action === 'ap' || action === 'approve') {
            if (interaction.user.id !== ADMIN_ID) return;
            
            // Xử lý lọc số tiền thông minh
            let amount = parseInt(priceRaw.toString().replace(/[^0-9]/g, ''));
            if (isNaN(amount)) amount = 0;

            if (db && amount > 0) {
                const monthYear = getCurrentMonth();
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`, userId);
                try {
                    const snap = await getDoc(userRef);
                    if (!snap.exists()) {
                        await setDoc(userRef, { total: amount });
                    } else {
                        const currentTotal = snap.data().total || 0;
                        await updateDoc(userRef, { total: currentTotal + amount });
                    }
                    console.log(`✅ Đã cộng ${amount}đ cho user ${userId}`);
                } catch (err) { console.error("Lỗi cộng Top:", err); }
            }

            await interaction.update({ content: `✅ Đã duyệt đơn và cộng tiền cho <@${userId}> thành công!`, components: [] });
            
            const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
            if (doneChan) {
                const doneEmbed = new EmbedBuilder()
                    .setTitle("🏁 GIAO DỊCH HOÀN TẤT")
                    .setColor("#2ECC71")
                    .addFields(
                        { name: "👤 Khách hàng", value: `<@${userId}>`, inline: true },
                        { name: "📦 Sản phẩm", value: `${item.toUpperCase()}`, inline: true },
                        { name: "💰 Giá trị", value: `\`${amount.toLocaleString()}đ\``, inline: true }
                    )
                    .setTimestamp();
                doneChan.send({ content: `<@${userId}>`, embeds: [doneEmbed] });
            }
        }
    }
});

client.login(process.env.TOKEN);
