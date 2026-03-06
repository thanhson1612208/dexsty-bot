const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const ADMIN_ID = "1105058130246770758";

client.once("ready", () => {
  console.log(`Bot đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!buy")) {

let args = message.content.split(" ");
let price = parseInt(args[1]);

const qr = `https://img.vietqr.io/image/VCB-1044627277-compact.png?amount=${price}&addInfo=DEXSTY`;

const embed = new EmbedBuilder()
.setTitle("💸 Thanh toán đơn hàng")
.setDescription(`Số tiền cần thanh toán: **${price} VND**`)
.setImage(qr);

message.channel.send({embeds:[embed]});

}

});
  if (message.author.bot) return;

  // MENU
  if (message.content === "!menu") {

    const file = new AttachmentBuilder("./Messenger_creation_214E610D-DB3C-4EA3-9455-2650B4663371.jpeg");

    const embed = new EmbedBuilder()
      .setTitle("🌟 DEXSTY BLOX FRUIT SHOP")
      .setDescription("Chọn nút bên dưới để sử dụng dịch vụ.")
      .setImage("attachment://Messenger_creation_214E610D-DB3C-4EA3-9455-2650B4663371.jpeg")
      .setColor("Blue");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("order")
          .setLabel("🛒 Đặt Dịch Vụ")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("pay")
          .setLabel("💳 Thanh Toán")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId("huongdan")
          .setLabel("📖 Hướng Dẫn")
          .setStyle(ButtonStyle.Secondary)
      );

    message.channel.send({
      embeds: [embed],
      components: [row],
      files: [file]
    });
  }

  // ORDER
  if (message.content.startsWith("!order")) {

    const order = message.content.replace("!order", "").trim();

    if (!order) {
      return message.reply("❌ Hãy nhập: `!order tên dịch vụ`");
    }

    message.reply("✅ Đã gửi đơn cho admin.");

    message.channel.send(
`📢 <@${ADMIN_ID}> có đơn mới!

👤 Khách: ${message.author}
🛒 Dịch vụ: ${order}`
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "order") {
    interaction.reply("📩 Nhập: `!order tên dịch vụ` để đặt.");
  }

  if (interaction.customId === "pay") {
    interaction.reply(
`💳 Thanh toán

🏦 Ngân hàng: VCB
👤 Tên: Bui Thanh Son
🔢 STK: 1044627277`
    );
  }

  if (interaction.customId === "huongdan") {
    interaction.reply(
`📖 Hướng dẫn

!menu → mở menu
!order → đặt dịch vụ
!pay → thanh toán`
    );
  }
});

client.login(process.env.TOKEN);
