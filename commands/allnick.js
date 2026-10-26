const AUTHOR_LOCK = "亗𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍亗";

module.exports = {
  config: {
    name: "allnick",
    aliases: ["an"],
    version: "3.0.0",
    author: AUTHOR_LOCK,
    role: 1,
    shortDescription: "Change/reset nickname of all members safely",
    category: "owner",
    guide: "allnick <nickname | cancel>"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const input = args.join(" ").trim();

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: "https://t.me/siyam_nu_bot?startgroup=true" },
          { text: "👑 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }
        ]
      ]
    };

    if (!input) {
      return bot.sendMessage(chatId, 
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

⚠️ নিকনেম দাও অথবা cancel লেখো ✨`, {
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });
    }

    if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
      return bot.sendMessage(chatId, "❌ এই কমান্ড শুধু গ্রুপে কাজ করে 😿", { reply_to_message_id: messageId });
    }

    return bot.sendMessage(chatId, "ℹ️ টেলিগ্রাম API লিমিটেশনের কারণে গ্রুপে একসাথে সবার নিকনেম পরিবর্তন করা সম্ভব নয়। তবে কমান্ড সিস্টেম ঠিক আছে!", {
      reply_to_message_id: messageId,
      reply_markup: replyMarkup
    });
  }
};
