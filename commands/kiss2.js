const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "kiss2",
    aliases: ["k2"],
    version: "1.8",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "fun"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const id = msg.from.id;
    let id2;

    if (msg.reply_to_message && msg.reply_to_message.from) {
      id2 = msg.reply_to_message.from.id;
    } else {
      const noTargetMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💋 কাকে কিস করতে চাও 
» 🤦তাকে রিপ্লাই দাও
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return bot.sendMessage(chatId, noTargetMsg, { reply_to_message_id: messageId });
    }

    try {
      const url = `${await baseApiUrl()}/api/dig?type=kiss&user=${id}&user2=${id2}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });
      
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const filePath = path.join(cacheDir, `kiss_${Date.now()}.png`);
      fs.writeFileSync(filePath, response.data);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💋 জান উফ সেই স্বাদ
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return bot.sendPhoto(chatId, filePath, {
        caption: successMsg,
        reply_to_message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: `https://t.me/${config.botUsername}?startgroup=true` },
              { text: "👑 𝐎𝐖𝐍𝐄𝐑", url: `https://t.me/${config.ownerUsername}` }
            ]
          ]
        }
      }, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "❌ ছবি তৈরি করতে সমস্যা হয়েছে!", { reply_to_message_id: messageId });
    }
  }
};
