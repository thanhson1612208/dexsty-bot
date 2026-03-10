const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const express = require('express');
const app = express();

// PORT CỦA RENDER
app.get('/', (req, res) => res.send('Bot Online!'));
app.listen(10000, () => console.log('✅ Web Server đã mở tại cổng 10000'));

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// CẤU HÌNH CỦA BẠN
const ADMIN_ID = '1105058130246770759';
const LOG_CHANNEL_ID = '1479690248512519667';
const DONE_LOG_CHANNEL_ID = '1479514742941409576';

const prices = { "rocket": "8K", "kitsune": "574K", "dragon": "700K" }; // Bạn có thể thêm các món khác sau

client.once("ready", () => {
    console.log(`✅ Bot ${client.user.tag} ĐÃ ONLINE!`);
});

client.on("messageCreate", async (message) => {
    if (message.content === '!menu') {
        const embed = new EmbedBuilder().setTitle('🛒 SHOP BLOX FRUIT').setColor('#00ffcc');
        message.channel.send({ embeds: [embed], content: "Bot đã nhận lệnh!" });
    }
});

client.login(process.env.TOKEN).catch(err => console.error("❌ Lỗi Token: ", err.message));
