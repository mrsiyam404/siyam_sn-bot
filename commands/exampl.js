const config = require("../config"); // কনফিগ ফাইল কল করা

module.exports = {
  config: {
    name: "exampl",
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    shortDescription: "Example command with dynamic buttons",
    category: "fun",
    guide: "example"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: `https://t.me/${config.botUsername}?startgroup=true` },
          { text: "👑 𝐎𝐖𝐍𝐄𝐑", url: `https://t.me/${config.ownerUsername}` }
        ]
      ]
    };

    return bot.sendMessage(chatId, "✨ এটি একটি ডায়নামিক বাটন টেস্ট মেসেজ!", {
      reply_to_message_id: messageId,
      reply_markup: replyMarkup
    });
  }
};
