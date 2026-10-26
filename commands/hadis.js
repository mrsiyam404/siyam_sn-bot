const axios = require("axios");
const config = require("../config");

const REAL_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function checkAuthorLock(configObj, bot, msg) {
  if (configObj.author !== REAL_AUTHOR) {
    bot.sendMessage(
      msg.chat.id,
      "⛔ You are not authorized to change the author name. Locked by 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍!",
      { reply_to_message_id: msg.message_id }
    );
    return false;
  }
  return true;
}

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

async function getHadisText() {
  const base = await mahmud();
  const res = await axios.get(`${base}/api/hadis`);
  return res.data;
}

module.exports = {
  config: {
    name: "hadis",
    aliases: ["hadith"],
    version: "1.8",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "islamic"
  },

  execute: async function (bot, msg, args) {
    if (!checkAuthorLock(module.exports.config, bot, msg)) return;

    try {
      const hadis = await getHadisText();
      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📖 ${hadis.text}

- ${hadis.source} 🖤
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await bot.sendMessage(msg.chat.id, successMsg, {
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "⏭️ NEXT", callback_data: "next_hadis" },
              { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: `https://t.me/${config.botUsername}?startgroup=true` }
            ],
            [{ text: "👑 𝐎𝐖𝐍𝐄𝐑", url: `https://t.me/${config.ownerUsername}` }]
          ]
        }
      });

    } catch (err) {
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥹 হাদিস তথ্য আনতে 
» 🆔 সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await bot.sendMessage(msg.chat.id, errorMsg, { reply_to_message_id: msg.message_id });
    }
  },

  onCallbackQuery: async function (bot, query) {
    if (query.data === "next_hadis") {
      try {
        const hadis = await getHadisText();
        const newMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📖 ${hadis.text}

- ${hadis.source} 🖤
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        await bot.editMessageText(newMsg, {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "⏭️ 𝐍𝐄𝐗𝐓", callback_data: "next_hadis" },
                { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: `https://t.me/${config.botUsername}?startgroup=true` }
              ],
              [{ text: "👑 𝐎𝐖𝐍𝐄𝐑", url: `https://t.me/${config.ownerUsername}` }]
            ]
          }
        });
        await bot.answerCallbackQuery(query.id, { text: "✅ নতুন হাদিস লোড করা হয়েছে!" });
      } catch (e) {
        await bot.answerCallbackQuery(query.id, { text: "❌ হাদিস আনতে সমস্যা হয়েছে!" });
      }
    }
  }
};
