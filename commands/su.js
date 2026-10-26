const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const activeSessions = new Map();

module.exports = {
  config: {
    name: "su",
    aliases: ["chud"],
    version: "1.0",
    author: AUTHOR_LOCK,
    role: 2,
    category: "admin",
    guide: "chud @mention বা su off"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (args[0] && args[0].toLowerCase() === "off") {
      if (activeSessions.has(chatId)) {
        const timeouts = activeSessions.get(chatId);
        timeouts.forEach(clearTimeout);
        activeSessions.delete(chatId);
        return bot.sendMessage(chatId, "☑️", { reply_to_message_id: messageId });
      } else {
        return bot.sendMessage(chatId, "❌", { reply_to_message_id: messageId });
      }
    }

    let targetUser = null;
    if (msg.reply_to_message && msg.reply_to_message.from) {
      targetUser = msg.reply_to_message.from;
    } else if (msg.entities) {
      const mentionEntity = msg.entities.find(e => e.type === "text_mention");
      if (mentionEntity && mentionEntity.user) {
        targetUser = mentionEntity.user;
      }
    }

    if (!targetUser) {
      return bot.sendMessage(chatId, "👉 সিয়াম বস যাকে চুদ্দে চাউ তার আইডি @ম্যানশন দেউ__🖕🥵", { reply_to_message_id: messageId });
    }

    const targetID = targetUser.id;
    const realName = targetUser.first_name || "মাগি";
    const tagText = `[${realName}](tg://user?id=${targetID})`;

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: "https://t.me/siyam_nu_bot?startgroup=true" },
          { text: "👑 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }
        ]
      ]
    };

    await bot.sendMessage(chatId, `কিরে মাদারচোত সিয়াম বস এর চুদন খাওয়ায় জন্য রেডি তো? লে চুদা খা মাঙ্গের বেটা 😂😂 ${tagText}`, {
      parse_mode: "Markdown",
      reply_to_message_id: messageId,
      reply_markup: replyMarkup
    });

    if (activeSessions.has(chatId)) {
      activeSessions.get(chatId).forEach(clearTimeout);
    }

    const timeouts = [];

    const messages = [
      "মাঘি চুদা শরের বাচ্চা কার লগে পঙ্গা নিতে আসছিস 🤬🤬🤬 " + tagText,
      "চুদে গুহা ফাঁক করে দিব খানকীর পোলা 🤤 " + tagText,
      "মাদারচোত বোকাচোদা খানকীর পোলা " + tagText,
      "বেসসা মাঘী চোদা কুত্তা চোদা " + tagText,
      "ছাগল চুদা গরু চুদা মাঙ্গের বেটা লোকজন দেখে লাগতে আসিস কুত্তার বাচ্চা 🤬 " + tagText,
      "তোর আব্বুকে ভুলে গেলি মাদারচোত 😂 " + tagText,
      "তোকে কনডম ছাড়া চুদী মঙ্গের বেটা 🖕🏿 " + tagText,
      "আমার ধন চুষ তাইলে থামবো 😂 " + tagText,
      "তোরে কুত্তা দিয়ে চোদাই 😍 " + tagText,
      "মাঘীর মাং চাটিস বোকাচোদার বাচ্চা তোকে কন্ডম ছাড়া উল্টা করে চুদি 🤬 " + tagText,
      "এখনো সময় আছে মাফ চা 🤣🤣 " + tagText,
      "তোর নানি কেমন আছে 😍?? " + tagText,
      "তোকে চুদী 🥰 " + tagText,
      "মাদারচোত 🥰 " + tagText,
      "আজকের চুদন আজীবন মনে রাখিস বোকাচোদা 🤣🤣🤣 " + tagText,
      "মাঘা 🥰 " + tagText,
      "আয় আমার হোল টা চুষে দে 🥵🥵 " + tagText,
      "বাপ কে ভুলিস না বোকাচোদার বাচ্চা 🤬🤬🤬🤬🤬 " + tagText,
      "হোল কাটে নিবো 🤬🤬🤬🤬🤬🤬 " + tagText,
      "তোমার গুষ্টি চুদী ব্রো 😞🖕🏿 " + tagText,
      "🖕🏿🖕🏿🖕🏿🖕🏿🖕🏿🖕🏿🖕🏿🖕🏿🖕🏿 " + tagText,
      "মাঘীর ছেলে তোর মাকে চুদী 🖕🏽🖕🏽🖕🏽 " + tagText,
      "আজকে তোকে প্যান্ট না খুলেই চুদবো 🤬 তোর মাকে একটু আগেই চুঁদে আসলাম 😂 " + tagText,
      "বোকাচোদার বাচ্চা 😂 " + tagText,
      "মাদারচোত বোকাচোদা খানকীর ছেলে 🤬 " + tagText,
      "প্যান্ট ভিজে নাই 🤣🤣🤣🤣🤣🤣🤣??? " + tagText,
      "আরো চুদন খাইতে চাচ্ছিস ???? " + tagText,
      "আয় মাদারচোত আমার ধণ টা চুষে যা 🤬 " + tagText,
      "আব্বা কে ভুলিস না 🤬 " + tagText,
      "তোকে ডগি স্টাইল e চুদী 😋😋 " + tagText,
      "তোর আব্বাকে ভুললে আরেকবার এমন চুদন চুদবো মোর যাবি মঙ্গের বেটা 😂😂😂 " + tagText,
      "আজকের চুদন আজীবন মনে রাখবি 🤣🤣🤣 " + tagText,
      "আয় আমার ধোন টা চুষে যা মঙ্গের পুত 🤬🤬🤬🤬 " + tagText,
      "তোরে মুততে মুততে চুদী 🤣🤣 " + tagText,
      "চুঁদে পাউরুটি বানায় তোর হোগায় ভরে দিব মাঙ্গের বেতা চিনিস আমারে??? " + tagText,
      "খানকীর পোলা তোর বাপকে ভুলে গেলি?? জন্ম দেওয়া ভুল হইলো 🤬🤬🤬 " + tagText,
      "বোকাচোদার বাচ্চা 😍 " + tagText,
      "তোকে চুদী 😍😍😍 " + tagText,
      "হোল কাটে নিবো মঙ্গের বেটা কার লগে লাগতে আসছিস 🤬 " + tagText,
      "সিয়াম বস এর চুদন কেমন লাগলো বাচ্চা 🤣🤣🤣🤣?? " + tagText
    ];

    messages.forEach((item) => {
      const timer = setTimeout(async () => {
        try {
          await bot.sendMessage(chatId, item, { parse_mode: "Markdown" });
        } catch (e) {}
      }, 4000);
      timeouts.push(timer);
    });

    activeSessions.set(chatId, timeouts);
  }
};
