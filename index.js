const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Dexsty Bot đã online!');
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!menu') {
    message.channel.send({
      content: "📜 **Bảng Giá Dexsty Shop**",
      files: ["./Messenger_creation_214E610D-DB3C-4EA3-9455-2650B4663371.jpeg"]
    });
  }
});

client.login(process.env.TOKEN);
