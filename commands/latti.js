const axios = require("axios");
const config = require("../config");

module.exports = {
  config: {
    name: "latti",
    version: "10.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "fun"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    try {
      if (!msg.reply_to_message) {
        const noReplyMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🦵 কাকে ফুটবলের মতো কিক 
» 😈 মারবি তার মেসেজে রিপ্লাই দে
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return bot.sendMessage(chatId, noReplyMsg, { reply_to_message_id: messageId });
      }

      const senderID = msg.from.id;
      const targetID = msg.reply_to_message.from.id;
      const url = `https://sayem-meme-apixs.onrender.com/usta?senderID=${senderID}&targetID=${targetID}`;

      const res = await axios.get(url, { responseType: "stream" });

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💢 এই নে তুই লাথি খা!🦵
» 😈 তুই লাথি খাওয়ারই যোগ্য
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return bot.sendPhoto(chatId, res.data, {
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

    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥 ছবি লোড করতে 
» 🕵️ সমস্যা হয়েছে
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return bot.sendMessage(chatId, errorMsg, { reply_to_message_id: messageId });
    }
  }
};
