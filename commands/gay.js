const DIG = require("discord-image-generation");
const axios = require('axios');
const fs = require("fs");
const os = require("os");
const path = require("path");
const config = require("../config");

module.exports = {
  config: {
    name: "gay",
    aliases: ["gay_avatar"],
    version: "1.3",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "fun"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    try {
      const pth = await makeGay();

      const responseMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🏳️‍🌈 𝐇𝐞𝐲 𝐥𝐨𝐨𝐤 𝐚𝐭 𝐭𝐡𝐢𝐬 𝐚𝐯𝐚𝐭𝐚𝐫
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await bot.sendPhoto(chatId, pth, {
        caption: responseMsg,
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

      try { fs.unlinkSync(pth); } catch (e) { }
    } catch (e) {
      console.error(e);
      return bot.sendMessage(chatId, "❌ 𝐄𝐫𝐫𝐨𝐫: 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞 𝐤𝐨𝐫𝐚 𝐬𝐨𝐦𝐯𝐨𝐛 𝐡𝐨𝐲𝐧𝐢.", { reply_to_message_id: messageId });
    }
  }
};

async function makeGay() {
  const avatar = await axios.get("https://i.imgur.com/2dfL88M.png", { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data));
  const img = await new DIG.Gay().getImage(avatar);
  const tmpDir = os.tmpdir();
  const pth = path.join(tmpDir, `gay_${Date.now()}_${Math.floor(Math.random()*10000)}.png`);
  fs.writeFileSync(pth, img);
  return pth;
}
