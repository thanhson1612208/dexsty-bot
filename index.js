const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const express = require('express');
const app = express();

// --- PHẦN WEB (GIỮ CHO RENDER KHÔNG NGỦ) ---
app.get('/', (req, res) => res.send('Bot Online!'));
const server = app.listen(process.env.PORT || 10000, () => {
    console.log('✅ Web Server is running');
});

// --- PHẦN BOT DISCORD ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ID CỐ ĐỊNH CỦA BẠN
const ADMIN_ID = '1105058130246770759';
const LOG_CHANNEL_ID = '1479690248512519667';
const DONE_LOG_CHANNEL_ID = '1479514742941409576';

client.once("ready", () => {
    console.log(`✅ BOT ĐÃ ONLINE: ${client.user.tag}`);
});

// Test lệnh đơn giản nhất
client.on("messageCreate", async (message) => {
    if (message.content === '!menu') {
        message.reply("Bot Dexsty đã nhận lệnh! Chờ mình một chút nhé.");
    }
});

// LOGIN VỚI TOKEN TỪ ENVIRONMENT
client.login(process.env.TOKEN).catch(err => {
    console.error("❌ LỖI TOKEN RỒI:");
    console.error(err);
});
