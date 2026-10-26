const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const config = require("../config");

module.exports = {
  config: {
    name: "hug",
    version: "3.1.2",
    role: 0,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    category: "canvas"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (!msg.reply_to_message || !msg.reply_to_message.from) {
      const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥺 দয়া করে যাকে হাগ 
» 🥵 দিতে চান তার মেসেজে রিপ্লাই দিন
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return bot.sendMessage(chatId, noMentionMsg, { reply_to_message_id: messageId });
    }

    const name = msg.reply_to_message.from.first_name || "Friend";

    try {
      const imgUrl = "https://i.imgur.com/2dfL88M.png";
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const imgPath = path.join(cacheDir, `hug_${Date.now()}.png`);
      
      const imageBuffer = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(imgPath, imageBuffer);

      const stylishCaption = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🤗 ${name} তোমাকে 
» 😘 জড়িয়ে ধরে হাগ দিলাম
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await bot.sendPhoto(chatId, imgPath, {
        caption: stylishCaption,
        reply_to_message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: `https://t.me/${config.botUsername}?startgroup=true` },
              { text: "👑 𝐎𝐖𝐍𝐄𝐑", url: `https://t.me/${config.ownerUsername}` }
            ]
          ]
        }
      });

      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "❌ ছবিটি তৈরি করতে সমস্যা হয়েছে", { reply_to_message_id: messageId });
    }
  }
};
