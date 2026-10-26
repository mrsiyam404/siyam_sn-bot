const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "kiss",
    version: "1.8",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "love"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    try {
      if (!msg.reply_to_message) {
        const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💋 কাকে কিস করতে চাও 
» 🥱 তাকে রিপ্লাই করো
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return bot.sendMessage(chatId, noMentionMsg, { reply_to_message_id: messageId });
      }

      const senderID = msg.from.id;
      const targetID = msg.reply_to_message.from.id;

      const base = await mahmud();
      const apiURL = `${base}/api/kiss`;

      const response = await axios.post(
        apiURL,
        { senderID, targetID },
        { responseType: "arraybuffer" }
      );

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgPath = path.join(cacheDir, `kiss_${senderID}_${targetID}_${Date.now()}.png`);
      fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥵 উফ্ বেবি! তোমাকে তো 
» 🤤 খেয়ে দিল, এখন তো 
» 💋 তোমার বিয়ে হবে না!🤭🤣
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await bot.sendPhoto(chatId, imgPath, {
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
      });

      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    } catch (err) {
      console.error("Error in kiss command:", err.message || err);
      return bot.sendMessage(chatId, "❌ কিস করাতে সমস্যা হয়েছে", { reply_to_message_id: messageId });
    }
  }
};
