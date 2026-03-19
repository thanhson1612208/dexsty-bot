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
const { getAuth, signInAnonymously, signInWithCustomToken } = require('firebase/auth');

// --- CẤU HÌNH HỆ THỐNG ---
const ADMIN_ID = "1105058130246770758";
const LOG_CHANNEL_ID = "1479690248513519667"; 
const DONE_LOG_CHANNEL_ID = "1479514742841409576"; 
const CHAT_CHUNG_ID = "1471142835414765681"; 
const appId = typeof __app_id !== 'undefined' ? __app_id : 'dexsty-shop'; 

let db = null;
let auth = null;
let isAuthReady = false;

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
            auth = getAuth(fbApp);
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
            isAuthReady = true;
            console.log("✅ Firebase connected!");
        }
    } catch (e) { console.error("❌ Firebase error:", e); }
    console.log(`🚀 Bot Dexsty Shop Online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!top") {
        if (!isAuthReady) return message.reply("⚠️ Đang khởi động...");
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
                .setDescription(players.length === 0 ? "Chưa có nạp." : players.slice(0, 10).map((p, i) => `${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹"} <@${p.id}>: \`${p.total.toLocaleString()}đ\``).join("\n"));
            return message.channel.send({ embeds: [embed] });
        } catch (e) { return message.reply("❌ Lỗi tải TOP!"); }
    }

    if (message.content === '!menu') {
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('m1').setPlaceholder('🍎 Trái Vĩnh Viễn 1').addOptions(
                Object.entries(prices).slice(0, 15).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: v }))
            )
        );
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('m2').setPlaceholder('🍎 Trái Vĩnh Viễn 2').addOptions(
                Object.entries(prices).slice(15, 35).map(([k, v]) => ({ label: `Perm ${k}`, value: k, description: v }))
            )
        );
        const row3 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('m3').setPlaceholder('🎮 Gamepass/Robux').addOptions(
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
        const prc = prices[val] || "0";
        const amount = parseInt(prc.replace(/K/g, '')) * 1000;
        const qrUrl = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${amount}&addInfo=Nap+${val}+shop+Dexsty`;
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`p_${val}_${prc}`).setLabel('✅ CK').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`c_${val}_${prc}`).setLabel('💳 Thẻ').setStyle(ButtonStyle.Primary)
        );
        await interaction.editReply({ content: `📦 **Món:** ${val.toUpperCase()}\n💰 **Giá:** ${prc}`, files: [qrUrl], components: [row] });
    }

    if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        const act = parts[0];

        if (act === 'p' || act === 'c') {
            await interaction.update({ content: act === 'c' ? "💳 Gửi: `Loại-Mệnh giá-Mã-Seri`" : "⏳ Gửi Ảnh Bill!", components: [], files: [] });
            const filter = m => m.author.id === interaction.user.id && (act === 'p' ? m.attachments.size > 0 : true);
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            
            collector.on('collect', async m => {
                const logChan = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
                if (!logChan) return;
                const embed = new EmbedBuilder()
                    .setTitle(act === 'c' ? "💳 THẺ CÀO" : "🆕 CK")
                    .setColor(act === 'c' ? "#9b59b6" : "#ffff00")
                    .addFields(
                        { name: "👤 Khách", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📦 Món", value: parts[1].toUpperCase(), inline: true },
                        { name: "💰 Giá", value: parts[2], inline: true }
                    );
                if (act === 'p') embed.setImage(m.attachments.first().proxyURL);
                else embed.addFields({ name: "🎫 Chi tiết", value: `\`${m.content}\`` });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`ap_${interaction.user.id}_${parts[1]}_${parts[2]}`).setLabel('Duyệt tiền').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId(`do_${interaction.user.id}_${parts[1]}_${parts[2]}`).setLabel('Done đơn').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId(`de_${interaction.user.id}_${parts[1]}_${parts[2]}`).setLabel('Hủy').setStyle(ButtonStyle.Danger)
                );
                await logChan.send({ embeds: [embed], components: [row] });
                m.reply("✅ Đã gửi Admin!");
            });
        }

        if (['ap', 'do', 'de'].includes(act)) {
            if (interaction.user.id !== ADMIN_ID) return;
            const uid = parts[1];
            const name = parts[2];
            const prc = parts[3];

            // DUYỆT TIỀN (AP)
            if (act === 'ap') {
                // TRÁNH LỖI INTERACTION FAILED BẰNG CÁCH DEFER NGAY
                await interaction.deferUpdate();
                let amt = parseInt(prc.replace(/K/g, '')) * 1000;
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', `top_nap_${getCurrentMonth()}`, uid);
                try {
                    const snap = await getDoc(userRef);
                    if (!snap.exists()) await setDoc(userRef, { total: amt });
                    else await updateDoc(userRef, { total: increment(amt) });
                    
                    // Sau khi ghi xong mới editReply
                    await interaction.editReply({ content: `✅ Đã duyệt **${prc}** cho <@${uid}>`, components: [interaction.message.components[0]] });
                } catch (e) { 
                    console.error("Firebase Error:", e);
                    await interaction.editReply({ content: "❌ Lỗi Firebase khi cộng tiền!" });
                }
            } 

            // DONE ĐƠN (DO)
            if (act === 'do') {
                await interaction.reply({ content: "📸 Admin gửi Ảnh Proof ngay!", ephemeral: true });
                const filter = m => m.author.id === ADMIN_ID && m.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
                collector.on('collect', async m => {
                    const doneChan = await client.channels.fetch(DONE_LOG_CHANNEL_ID).catch(() => null);
                    const doneEmbed = new EmbedBuilder()
                        .setTitle("🏁 XONG ĐƠN")
                        .setColor("#2ecc71")
                        .addFields(
                            { name: "👤 Khách", value: `<@${uid}>`, inline: true },
                            { name: "📦 Món", value: name.toUpperCase(), inline: true },
                            { name: "💰 Giá", value: prc, inline: true }
                        )
                        .setImage(m.attachments.first().proxyURL);
                    if (doneChan) doneChan.send({ content: `🎊 <@${uid}> chúc mừng!`, embeds: [doneEmbed] });
                    await interaction.message.edit({ content: "🏁 ĐƠN ĐÃ HOÀN TẤT!", components: [] });
                });
            }

            // HỦY ĐƠN (DE)
            if (act === 'de') {
                await interaction.update({ content: `❌ Đã hủy đơn của <@${uid}>.`, components: [] });
            }
        }
    }
});

client.login(process.env.TOKEN);
