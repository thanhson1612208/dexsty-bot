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
const firebaseConfig = JSON.parse(process.env.__firebase_config || '{}');
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'dexsty-shop';

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
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
        console.log(`✅ Bot Dexsty Shop Online: ${client.user.tag}`);
    } catch (e) { console.error("Lỗi khởi động Firebase:", e); }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

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
                for (let i = 0; i < top10.length; i++) {
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
                    description += `${medal} **Top ${i + 1}:** <@${top10[i].id}> - \`${top10[i].total.toLocaleString()}đ\`\n`;
                }
                topEmbed.setDescription(description);
            }
            return message.channel.send({ embeds: [topEmbed] });
        } catch (e) {
            console.error(e);
            return message.reply("❌ Lỗi khi tải bảng xếp hạng.");
        }
    }

    if (message.content === "!admin") {
        const adminEmbed = new EmbedBuilder()
            .setTitle("🛡️ TRUNG TÂM HỖ TRỢ KHÁCH HÀNG")
            .setColor("#00D1FF")
            .setDescription("Chào bạn! Nếu cần hỗ trợ nạp thẻ hoặc tư vấn, hãy liên hệ Admin ngay.")
            .addFields(
                { name: "👤 Chủ Shop", value: "Bùi Thanh Sơn", inline: true },
                { name: "📞 Zalo", value: "0762706736", inline: true },
                { name: "🕒 Trạng thái", value: "✅ Đang Online", inline: true }
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
                Object.entries(prices).slice(0, 15).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: `Giá: ${v}` }))
            )
        );
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_p2').setPlaceholder('🍎 Trái Vĩnh Viễn 2').addOptions(
                Object.entries(prices).slice(15, 35).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: `Giá: ${v}` }))
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
            .setImage('https://i.postimg.cc/j2hHsYHp/IMG-20260309-004009.jpg')
            .setFooter({ text: "Chọn vật phẩm để xem mã QR thanh toán" });
        return message.channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        try {
            await interaction.deferReply({ ephemeral: true });
            const val = interaction.values[0];
            const priceStr = prices[val] || "0";
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

        // KHÁCH HÀNG GỬI THÔNG TIN
        if (action === 'card' || action === 'paid') {
            await interaction.update({ 
                content: action === 'card' ? "💳 **NHẬN THẺ CÀO**\n👉 Nhập: `Loại thẻ - Mệnh giá - Mã thẻ - Seri`" : "⏳ Vui lòng gửi **Ảnh Bill** vào đây!", 
                components: [], files: [] 
            });

            const filter = action === 'card' ? (m => m.author.id === interaction.user.id) : (m => m.author.id === interaction.user.id && m.attachments.size > 0);
            const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });
            
            collector.on('collect', async m => {
                const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
                if (!logChannel) return m.reply("❌ Kênh Log chưa được cấu hình!");

                const logEmbed = new EmbedBuilder()
                    .setTitle(action === 'card' ? "💳 ĐƠN THẺ CÀO" : "🆕 ĐƠN CHUYỂN KHOẢN")
                    .setColor(action === 'card' ? "#9b59b6" : "#ffff00")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📦 Món", value: item.toUpperCase(), inline: true },
                        { name: "💰 Giá", value: priceStr, inline: true }
                    );
                
                if (action === 'card') logEmbed.addFields({ name: "🎫 Chi tiết thẻ", value: `\`${m.content}\`` });
                else logEmbed.setImage(m.attachments.first().proxyURL);

                const adminRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`approve_${interaction.user.id}_${item}_${priceStr}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`done_${interaction.user.id}_${item}_${priceStr}`).setLabel('Xong đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`deny_${interaction.user.id}_${item}_${priceStr}`).setLabel('Từ chối').setStyle(ButtonStyle.Danger)
                );

                await logChannel.send({ content: `🔔 Yêu cầu mới từ <@${interaction.user.id}>`, embeds: [logEmbed], components: [adminRow] });
                m.reply("✅ Gửi thành công! Vui lòng chờ Admin xử lý.");
            });
        }

        // ADMIN XỬ LÝ
        if (['approve', 'done', 'deny'].includes(action)) {
            if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "❌ Bạn không phải Admin!", ephemeral: true });
            
            const targetUserId = parts[1];
            const targetUser = await client.users.fetch(targetUserId).catch(() => null);

            if (action === 'approve') {
                await interaction.update({ content: `✅ Đã duyệt tiền cho <@${targetUserId}>`, components: [interaction.message.components[0]] });
                if (targetUser) targetUser.send("✅ Admin đã xác nhận tiền! Vật phẩm sẽ được giao sớm.").catch(() => {});
            } 
            else if (action === 'done') {
                await interaction.reply({ content: "📸 Gửi **Ảnh Proof** (đã giao đồ) vào đây!", ephemeral: true });
                const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });

                collector.on('collect', async m => {
                    const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
                    const amountVND = parseInt(priceStr.replace(/K/g, '')) * 1000;

                    // CỘNG TIỀN VÀO TOP NẠP
                    const monthYear = getCurrentMonth();
                    const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${monthYear}`, targetUserId);
                    try {
                        const userDoc = await getDoc(userRef);
                        if (!userDoc.exists()) {
                            await setDoc(userRef, { total: amountVND });
                        } else {
                            await updateDoc(userRef, { total: increment(amountVND) });
                        }
                    } catch (err) { console.error("Lỗi cập nhật Top Nạp:", err); }

                    const doneEmbed = new EmbedBuilder()
                        .setTitle("🏁 ĐƠN HÀNG HOÀN TẤT")
                        .setColor("#2ecc71")
                        .setAuthor({ name: 'Dexsty Shop', iconURL: client.user.displayAvatarURL() })
                        .addFields(
                            { name: "👤 Khách hàng", value: `<@${targetUserId}>`, inline: true },
                            { name: "📦 Sản phẩm", value: item.toUpperCase(), inline: true },
                            { name: "💰 Tổng tiền", value: `${priceStr}`, inline: true }
                        )
                        .setImage(m.attachments.first().proxyURL)
                        .setTimestamp();

                    if (doneChan) await doneChan.send({ content: `🎊 Chúc mừng <@${targetUserId}> đã nhận hàng!`, embeds: [doneEmbed] });
                    await interaction.message.edit({ content: "🏁 ĐƠN HÀNG ĐÃ HOÀN TẤT!", components: [] });
                    if (targetUser) targetUser.send(`🏁 Đơn hàng **${item.toUpperCase()}** của bạn đã giao xong! Cảm ơn bạn.`).catch(() => {});
                });
            } 
            else if (action === 'deny') {
                await interaction.update({ content: "❌ Đơn hàng đã bị từ chối.", components: [] });
                if (targetUser) targetUser.send("❌ Đơn hàng của bạn không được duyệt. Vui lòng liên hệ Admin để kiểm tra.").catch(() => {});
            }
        }
    }
});

client.login(process.env.TOKEN);
