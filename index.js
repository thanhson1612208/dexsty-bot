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

// Bảng giá (Dùng để tính toán QR)
const prices = {
    "rocket": "8K", "spin": "12K", "chop": "15K", "spring": "26K", "bomb": "31K",
    "smoke": "35K", "200rb": "50K", "spike": "52K", "mastery": "55K", "boat": "55K",
    "storage": "62K", "money": "69K", "bossdrop": "69K", "flame": "76K", "ice": "108K",
    "sand": "121K", "dark": "134K", "light": "137K", "diamond": "156K", "rubber": "168K",
    "darkblade": "170K", "ghost": "178K", "magma": "200K", "buddha": "239K", "love": "244K",
    "portal": "252K", "rumble": "264K", "phoenix": "278K", "sound": "291K", "blizzard": "291K",
    "gravity": "307K", "dough": "314K", "shadow": "320K", "venom": "326K", "control": "332K", 
    "spirit": "332K", "trex": "341K", "mammoth": "348K", "notifier": "370K", "leopard": "425K", 
    "yeti": "425K", "kitsune": "574K", "dragon": "700K"
};

client.once("ready", () => {
    console.log(`✅ Bot Dexsty Shop đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Chặn dùng lệnh tại Chat Chung
    if (message.channel.id === CHAT_CHUNG_ID) {
        const botCommands = ["!menu", "!admin", "!gaytest"];
        if (botCommands.some(cmd => message.content.startsWith(cmd))) {
            return message.reply("❌ **Thông báo:** Bot không được phép sử dụng tại kênh Chat Chung!")
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
        return;
    }

    if (message.content === "!gaytest") {
        const score = Math.floor(Math.random() * 11);
        return message.reply(`🌈 **KẾT QUẢ GAY TEST**\n\n${message.author} có độ gay là: **${score}/10**`);
    }

    if (message.content === '!menu') {
        // ROW 1: GAMEPASS & GIÁ RẺ (Dưới 100K)
        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_1').setPlaceholder('🎮 GamePass & Trái Giá Rẻ (<100K)').addOptions([
                { label: 'Perm Rocket', value: 'rocket', description: '8K' },
                { label: 'Perm Spin', value: 'spin', description: '12K' },
                { label: 'Perm Chop', value: 'chop', description: '15K' },
                { label: 'Perm Spring', value: 'spring', description: '26K' },
                { label: 'Perm Bomb', value: 'bomb', description: '31K' },
                { label: 'Perm Smoke', value: 'smoke', description: '35K' },
                { label: '200 Robux (120H)', value: '200rb', description: '50K' },
                { label: 'Perm Spike', value: 'spike', description: '52K' },
                { label: '2x Mastery', value: 'mastery', description: '55K' },
                { label: 'Fast Boat', value: 'boat', description: '55K' },
                { label: '+1 Storage', value: 'storage', description: '62K' },
                { label: '2x Money', value: 'money', description: '69K' },
                { label: '2x Boss Drop', value: 'bossdrop', description: '69K' },
                { label: 'Perm Flame', value: 'flame', description: '76K' },
            ])
        );

        // ROW 2: TẦM TRUNG (100K - 300K)
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('menu_2').setPlaceholder('🍎 Trái Tầm Trung (100K - 300K)').addOptions([
                { label: 'Perm Ice', value: 'ice', description: '108K' },
                { label: 'Perm Sand', value: 'sand', description: '121K' },
