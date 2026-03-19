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
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    getDocs, 
    updateDoc, 
    increment 
} = require('firebase/firestore');
const { getAuth, signInWithCustomToken, signInAnonymously } = require('firebase/auth');

// --- CẤU HÌNH HỆ THỐNG ---
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667"; 
const DONE_LOG_CHANNEL_ID = "1479514742841409576"; 
const CHAT_CHUNG_ID = "1471142835414765681"; 

// --- CẤU HÌNH FIREBASE ---
let db, auth;
const appId = "dexsty-shop-system"; // ID định danh dữ liệu trên Firebase

try {
    const firebaseConfig = JSON.parse(process.env.__firebase_config || '{}');
    if (firebaseConfig.apiKey) {
        const fbApp = initializeApp(firebaseConfig);
        auth = getAuth(fbApp);
        db = getFirestore(fbApp);
    }
} catch (e) {
    console.error("❌ Lỗi cấu hình Firebase JSON tại Variables:", e.message);
}

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
    if (auth) {
        try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        } catch (e) { console.error("Lỗi đăng nhập Firebase:", e.message); }
    }
    console.log(`✅ Bot Dexsty Shop đã Online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Chống dùng lệnh ở kênh chat chung
    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!top", "!gaytest"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            const warning = await message.reply("❌ Vui lòng sang kênh lệnh riêng để sử dụng bot!");
            setTimeout(() => { 
                message.delete().catch(() => {}); 
                warning.delete().catch(() => {}); 
            }, 5000);
            return;
        }
    }

    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        return message.reply(`🌈 Độ gay của ${message.author} là: **${score}/10**`);
    }

    if (message.content === "!top") {
        if (!db) return message.reply("⚠️ Firebase chưa được cấu hình!");
        const monthYear = getCurrentMonth();
        const colRef = collection(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`);
        
        try {
            const snapshot = await getDocs(colRef);
            let players = [];
            snapshot.forEach(doc => players.push({ id: doc.id, total: doc.data().total || 0 }));
            players.sort((a, b) => b.total - a.total);
            const top10 = players.slice(0, 10);

            const topEmbed = new EmbedBuilder()
                .setTitle(`🏆 BẢNG XẾP HẠNG NẠP THÁNG ${monthYear}`)
                .setColor("#F1C40F")
                .setThumbnail("https://cdn-icons-png.flaticon.com/512/5406/5406792.png")
                .setTimestamp();

            if (top10.length === 0) {
                topEmbed.setDescription("Chưa có dữ liệu nạp tiền trong tháng này.");
            } else {
                let description = "";
                top10.forEach((p, i) => {
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
                    description += `${medal} **Top ${i + 1}:** <@${p.id}> - \`${p.total.toLocaleString()}đ\`\n`;
                });
                topEmbed.setDescription(description);
            }
            return message.channel.send({ embeds: [topEmbed] });
        } catch (e) {
            return message.reply("❌ Lỗi khi tải bảng xếp hạng.");
        }
    }

    if (message.content === "!admin") {
        const adminEmbed = new EmbedBuilder()
            .setTitle("🛡️ TRUNG TÂM HỖ TRỢ KHÁCH HÀNG")
            .setColor("#00D1FF")
            .addFields(
                { name: "👤 Chủ Shop", value: "Bùi Thanh Sơn", inline: true },
                { name: "📞 Zalo", value: "0762706736", inline: true }
            )
            .setFooter({ text: "Dexsty Shop - Uy Tín Tạo Nên Thương Hiệu" });

        const adminRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Facebook').setStyle(ButtonStyle.Link).setURL('https://www.facebook.com/share/17P4Xrx6bf/'),
            new ButtonBuilder().setLabel('Zalo').setStyle(ButtonStyle.Link).setURL('https://zalo.me/0762706736')
        );
        return message.channel.send({ embeds: [adminEmbed], components: [adminRow] });
    }

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p1').setPlaceholder('🍎 Trái Vĩnh Viễn 1').addOptions(
                Object.entries(prices).slice(0, 15).map(([k, v]) => ({ label: `Perm ${k.toUpperCase()}`, value: k, description: `Giá: ${v}` }))
            )
        );
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🍎 Trái Vĩnh Viễn 2').addOptions(
                Object.entries(prices).slice(15, 35).map(([k, v]) => ({ label: `Perm ${k.toUpperCase()}`, value: k, description: `Giá: ${v}` }))
            )
        );
        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_gp').setPlaceholder('🎮 Gamepass/Robux').addOptions(
                Object.entries(prices).slice(35).map(([k, v]) => ({ label: k.toUpperCase(), value: k, description: `Giá: ${v}` }))
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
        try {
            await interaction.deferReply({ ephemeral: true });
            const val = interaction.values[0];
            const priceStr = prices[val] || "0K";
            const amount = parseInt(priceStr.replace(/K/g, '')) * 1000;
            const info = `Thanh toan ${val.toUpperCase()} shop Dexsty`;
            const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`paid_${val}_${priceStr}`).setLabel('✅ Chuyển Khoản').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId(`card_${val}_${priceStr}`).setLabel('💳 Thẻ Cào (Phí 15%)').setStyle(ButtonStyle.Primary)
            );

            await interaction.editReply({
                content: `## 🛒 XÁC NHẬN ĐƠN HÀNG\n📦 **Vật phẩm:** ${val.toUpperCase()}\n💰 **Giá:** ${priceStr}\n⚠️ **Lưu ý:** Thẻ cào sẽ bị trừ chiết khấu **15%**.`,
                files: [qrUrl], components: [row]
            });
        } catch (e) { await interaction.editReply({ content: "❌ Lỗi hệ thống!" }).catch(() => {}); }
    }

    if (interaction.isButton()) {
        if (interaction.component.style === ButtonStyle.Link) return;

        const parts = interaction.customId.split('_');
        const action = parts[0]; 
        const item = parts[1]; 
        const priceStr = parts[2];

        // --- KHÁCH HÀNG GỬI BILL/THẺ ---
        if (action === 'card' || action === 'paid') {
            await interaction.update({ 
                content: action === 'card' ? "💳 **NHẬN THẺ CÀO**\n👉 Vui lòng nhập: `Loại thẻ - Mệnh giá - Mã thẻ - Seri`" : "⏳ Vui lòng gửi **Ảnh Bill** chuyển khoản vào đây!", 
                components: [], files: [] 
            });

            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });
            
            collector.on('collect', async m => {
                const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
                if (!logChannel) return m.reply("❌ Lỗi: Không tìm thấy kênh Log Admin!");

                const logEmbed = new EmbedBuilder()
                    .setTitle(action === 'card' ? "💳 ĐƠN THẺ CÀO MỚI" : "🆕 ĐƠN CHUYỂN KHOẢN MỚI")
                    .setColor(action === 'card' ? "#9b59b6" : "#ffff00")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}> (${interaction.user.id})`, inline: true },
                        { name: "📦 Món", value: item.toUpperCase(), inline: true },
                        { name: "💰 Giá", value: priceStr, inline: true }
                    );
                
                if (action === 'card') {
                    logEmbed.addFields({ name: "🎫 Thông tin thẻ", value: `\`${m.content}\`` });
                } else if (m.attachments.size > 0) {
                    logEmbed.setImage(m.attachments.first().proxyURL);
                } else {
                    return m.reply("❌ Bạn chưa gửi ảnh Bill. Vui lòng thao tác lại!");
                }

                // Cấu hình ID nút bấm cho Admin xử lý
                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${interaction.user.id}_${item}_${priceStr}`).setLabel('Xác nhận Tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`done_${interaction.user.id}_${item}_${priceStr}`).setLabel('Xong đơn & Cộng Top').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${interaction.user.id}_${item}_${priceStr}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );

                await logChannel.send({ content: `🔔 Yêu cầu từ <@${interaction.user.id}>`, embeds: [logEmbed], components: [adminRow] });
                m.reply("✅ Đã gửi đơn thành công! Vui lòng chờ Admin kiểm tra.");
            });
        }

        // --- ADMIN XỬ LÝ ĐƠN ---
        if (['approve', 'done', 'deny'].includes(action)) {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "❌ Bạn không có quyền Admin!", ephemeral: true });
            
            const targetUserId = parts[1];
            const targetUser = await client.users.fetch(targetUserId).catch(() => null);

            if (action === 'approve') {
                await interaction.update({ content: `✅ Đã xác nhận đã nhận tiền của <@${targetUserId}>`, components: [interaction.message.components[0]] });
                if (targetUser) targetUser.send("✅ Admin đã nhận được tiền của bạn! Vui lòng đợi trong giây lát để nhận hàng.").catch(() => {});
            } 
            else if (action === 'done') {
                await interaction.reply({ content: "📸 Admin vui lòng gửi **Ảnh Proof** (đã giao hàng) để hoàn tất đơn!", ephemeral: true });
                
                const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });

                collector.on('collect', async m => {
                    const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
                    const amountVND = parseInt(priceStr.replace(/K/g, '')) * 1000;

                    // CỘNG VÀO TOP NẠP TRÊN FIREBASE
                    if (db) {
                        const monthYear = getCurrentMonth();
                        const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`, targetUserId);
                        try {
                            const userDoc = await getDoc(userRef);
                            if (!userDoc.exists()) {
                                await setDoc(userRef, { total: amountVND });
                            } else {
                                await updateDoc(userRef, { total: increment(amountVND) });
                            }
                        } catch (err) { console.error("Lỗi Firebase Top Nạp:", err); }
                    }

                    const doneEmbed = new EmbedBuilder()
                        .setTitle("🏁 GIAO DỊCH HOÀN TẤT")
                        .setColor("#2ecc71")
                        .addFields(
                            { name: "👤 Khách hàng", value: `<@${targetUserId}>`, inline: true },
                            { name: "📦 Sản phẩm", value: item.toUpperCase(), inline: true },
                            { name: "💰 Giá trị", value: `${priceStr}`, inline: true }
                        )
                        .setImage(m.attachments.first().proxyURL)
                        .setTimestamp();

                    if (doneChan) await doneChan.send({ content: `🎊 Chúc mừng <@${targetUserId}> đã mua hàng thành công!`, embeds: [doneEmbed] });
                    
                    // Xóa nút bấm ở tin nhắn log
                    await interaction.message.edit({ content: `🏁 ĐƠN HÀNG CỦA <@${targetUserId}> ĐÃ HOÀN TẤT!`, embeds: interaction.message.embeds, components: [] });
                    
                    if (targetUser) targetUser.send(`🏁 Đơn hàng **${item.toUpperCase()}** của bạn đã hoàn tất! Cảm ơn bạn đã tin tưởng Dexsty Shop.`).catch(() => {});
                    await m.reply("✅ Đã hoàn tất đơn và cộng Top nạp!");
                });
            } 
            else if (action === 'deny') {
                await interaction.message.edit({ content: `❌ ĐƠN HÀNG CỦA <@${targetUserId}> ĐÃ BỊ TỪ CHỐI!`, embeds: interaction.message.embeds, components: [] });
                if (targetUser) targetUser.send("❌ Đơn hàng của bạn đã bị từ chối do thông tin không chính xác. Liên hệ Admin để biết thêm chi tiết.").catch(() => {});
            }
        }
    }
});

client.login(process.env.TOKEN);
