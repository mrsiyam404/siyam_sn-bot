const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const activeSessions = new Map();

module.exports = {
  config: {
    name: "su2",
    version: "1.6",
    role: 2,
    author: AUTHOR_LOCK,
    shortDescription: "Fast tag Banglish list (1-2 seconds gap)",
    category: "nsfw",
    guide: "su2 @mention, reply or su2 off"
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

    await bot.sendMessage(chatId, `বস 𓆩𝐒𝐈𝐘𝐀𝐌𓆪 এর চুদা লো-🖕🥵 ${tagText}`, {
      parse_mode: "Markdown",
      reply_to_message_id: messageId,
      reply_markup: replyMarkup
    });

    if (activeSessions.has(chatId)) {
      activeSessions.get(chatId).forEach(clearTimeout);
    }

    const timeouts = [];

    const messages = [
      "খাংকির মেয়ে তর মারে চুদি 🥰 " + tagText,
      "খাংকির মেয়ে তর কচি বোন রে চুদি 😍.. " + tagText,
      "মাদারচোদ তর আম্মু পম পম খাংকির পো 🐰 " + tagText,
      "খাংকির মেয়ে তর কচি ভুদায় ভুদায় কামর দিমু  💔! " + tagText,
      "খাংকি মাগির মেয়ে কথা ক কম কম তর আম্মু রে চুদে বানামু আইটেম বোম " + tagText,
      "depression থেকেও তর মাইরে চু*** দি 🤬 " + tagText,
      "তর আম্মু রে আচার এর লোভ দেখি চুদি মাগির মেয়ে🤬 " + tagText,
      "বান্দির মেয়ে তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟 " + tagText,
      "বান্দি মাগির মেয়ে তর আম্মু রে চুদি তর দুলা ভাই এর কান্দে ফেলে  🤝 " + tagText,
      "উফফফ খাদ্দামা মাগির মেয়ে তর আম্মুর কালা ভুদায় আমার মাল আউট তর কচি বোন রে উপ্তা করে এবার চুদবো  💉။ " + tagText,
      "অনলাইনে গালি বাজ হয়ে গেছত মাগির মেয়ে এমন চুদা দিমু লাইফ টাইম মনে রাখবি ফারহান বস তর বাপ মাগির মেয়ে 😘 " + tagText,
      "বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে  ✋ " + tagText,
      " হাই মাদারচোদ তর তর ব্যাশা জাতের আম্মু টা রে আদর করে করে চুদি " + tagText,
      "~ চুদা কি আরো খাবি মাগির পোল 🤖",
      "খাংকির মেয়ে 🥰 " + tagText,
      "মাদারচোদ😍.. " + tagText,
      "ব্যাস্যার মেয়ে 🐰 " + tagText,
      "ব্যাশ্যা মাগির মেয়ে  💔! " + tagText,
      "পতিতা মাগির মেয়ে " + tagText,
      "depression থেকেও তর মাইরে চু*** দি 🤬 " + tagText,
      "তর মারে চুদি " + tagText,
      "নাট বল্টু মাগির মেয়ে🤟 " + tagText,
      "তর বোন রে পায়জামা খুলে চুদি 🤣 " + tagText,
      "উম্মম্মা তর বোন এরকচি ভুদায়💉။ " + tagText,
      "DNA টেষ্ট করা দেখবি সিয়াম এর চুদা তেই তর জন্ম। " + tagText,
      "কামলা মাগির মেয়ে  ✋ " + tagText,
      " বাস্ট্রাড এর বাচ্ছা বস্তির মেয়ে " + tagText,
      "~ আমার জারজ শন্তান🤖",
      "Welcome মাগির মেয়ে 🥰 " + tagText,
      "তর কচি বোন এর পম পম😍.. " + tagText,
      "ব্যাস্যার মেয়ে কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰 " + tagText,
      "Hi ফারহান এর জারজ মাগির মেয়ে  💔! " + tagText,
      "২০ টাকা এ পতিতা মাগির মেয়ে " + tagText,
      "depression থেকেও তর মাইরে চু*** দি 🤬 " + tagText,
      "বস্তির মেয়ে অনলাইনের কিং " + tagText,
      "টুকাই মাগির মেয়ে🤟 " + tagText,
      "তর আম্মু রে পায়জামা খুলে চুদি 🤣 " + tagText,
      "উম্মম্মা তর বোন এরকচি ভুদায়💉။ " + tagText,
      "DNA টেষ্ট করা দেখবি আমার চুদা তেই তর জন্ম। " + tagText,
      "হিজলা মাগির মেয়ে  ✋ " + tagText,
      " বস্তিরন্দালাল এর বাচ্ছা বস্তির মেয়ে " + tagText,
      "~ আমার জারজ শন্তান জা ভাগ🤖",
      "Welcome শুয়োরের বাচ্চা 🥰 " + tagText,
      "কুত্তার বাচ্ছা তর কচি বোন এর পম পম😍.. " + tagText,
      "খাঙ্কির মেয়ে মেয়ে কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰 " + tagText,
      "Hi বস সিয়াম এর জারজ মেয়ে মাগির মেয়ে  💔! " + tagText,
      "খান্কি মাগির মেয়ে " + tagText,
      "তোর বাপে তোর নানা। 🤬 " + tagText,
      "বস্তির মেয়ে তোর বইনরে মুসলমানি দিমু। " + tagText,
      "টুকাই মাগির মেয়ে মোবাইল ভাইব্রেশন কইরা তুর কচি বোন এর পুকটিতে ভরবো।🤟 " + tagText,
      "তোর মুখে হাইগ্যা দিমু। 🤣 " + tagText,
      "কুত্তার পুকটি চাটামু💉။ " + tagText,
      "তর আম্মুর হোগা দিয়া ট্রেন ভইরা দিমু。。 " + tagText,
      "হিজলা মাগির মেয়ে হাতির ল্যাওড়া দিয়া তর মায়েরে চুদুম।  ✋ " + tagText,
      "তর বোন ভোদা ছিল্লা লবণ লাগায় দিমু।  " + tagText,
      "~ আমার ফাটা কন্ডমের ফসল। জা ভাগ🤖",
      "Welcome শুয়োরের বাচ্চা 🥰 " + tagText,
      "কুত্তার বাচ্ছা তর বৌন ভোদায় মাগুর মাছ চাষ করুম।😍.. " + tagText,
      "খাঙ্কিরমেয়ে মেয়ে তর বোনের  হোগায় ইনপুট, তর মায়ের ভোদায় আউটপুট।🐰 " + tagText,
      "তর মায়ের ভোদা বোম্বাই মরিচ দিয়া চুদামু।💔! " + tagText,
      "খান্কি মাগির মেয়ে তর মায়ের ভোদা শিরিষ কাগজ দিয়া ঘইষা দিমু।  " + tagText,
      "জং ধরা লোহা দিয়া পাকিস্তানের মানচিত্র বানাই্য়া তোদের পিছন দিয়া ঢুকামু।🤬  " + tagText,
      "বস্তির মেয়ে তর মায়ের ভুদাতে পোকা। " + tagText,
      "টুকাই মাগির মেয়ে তর মার ভোদায় পাব্লিক টয়লেট।🤟 " + tagText,
      "তোর মুখে হাইগ্যা দিমু। ভুস্কি মাগির মেয়ে 🤣 " + tagText,
      "কান্দে ফালাইয়া তর মায়েরে চুদি💉။ " + tagText,
      "তর আম্মুর উপ্তা কইরা চুদা দিমু。。 " + tagText,
      "হিজলা মাগির মেয়ে বালি দিয়া চুদমু তরে খাঙ্কি মাগী!তর মাকে।  ✋ " + tagText,
      "তর বোন ভোদা ছিল্লা লবণ লাগায় দিমু।  " + tagText,
      "~ আমার মেয়ে। জা ভাগ🤖"
    ];

    messages.forEach((item) => {
      const timer = setTimeout(async () => {
        try {
          if (item.startsWith("~")) {
            await bot.sendMessage(chatId, item);
          } else {
            await bot.sendMessage(chatId, item, { parse_mode: "Markdown" });
          }
        } catch (e) {}
      }, 4000); 
      timeouts.push(timer);
    });

    activeSessions.set(chatId, timeouts);
  }
};
