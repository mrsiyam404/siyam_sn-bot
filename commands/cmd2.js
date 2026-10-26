const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const AUTHOR_LOCK = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "cmd2",
    aliases: ["command2"],
    version: "2.0.0",
    author: AUTHOR_LOCK,
    role: 2, // শুধুমাত্র ওনার বা অ্যাডমিন ব্যবহার করতে পারবে
    shortDescription: "Manage your telegram command files",
    longDescription: "Load, unload, or install command files dynamically in Telegram bot with inline buttons.",
    category: "admin",
    guide: "cmd2 <load/unload/install> [args]"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const action = args[0] ? args[0].toLowerCase() : "";

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: "https://t.me/siyam_nu_bot?startgroup=true" },
          { text: "👑 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }
        ]
      ]
    };

    // ১. কমান্ড লোড বা রিলোড করা
    if (action === "load") {
      const fileName = args[1];
      if (!fileName) {
        return bot.sendMessage(chatId, "⚠️ | অনুগ্রহ করে লোড করার জন্য কমান্ড ফাইলের নাম দিন!", { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }

      const fullFileName = fileName.endsWith(".js") ? fileName : `${fileName}.js`;
      const filePath = path.join(__dirname, fullFileName);

      if (!fs.existsSync(filePath)) {
        return bot.sendMessage(chatId, `❌ | ফোল্ডারে "${fullFileName}" নামের কোনো ফাইল পাওয়া যায়নি!`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }

      try {
        delete require.cache[require.resolve(filePath)];
        const commandModule = require(filePath);
        const cmdName = commandModule.name || (commandModule.config && commandModule.config.name);

        if (!cmdName) {
          throw new Error("Command name is missing in config!");
        }

        bot.commands.set(cmdName.toLowerCase(), commandModule);

        // যদি অ্যালিয়াস থাকে
        const aliasList = commandModule.aliases || (commandModule.config && commandModule.config.aliases);
        if (aliasList) {
          const list = Array.isArray(aliasList) ? aliasList : [aliasList];
          list.forEach(alias => {
            if (alias) bot.aliases.set(alias.toLowerCase(), cmdName.toLowerCase());
          });
        }

        return bot.sendMessage(chatId, `✅ | সফলভাবে "${cmdName}" কমান্ডটি লোড করা হয়েছে!`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      } catch (err) {
        return bot.sendMessage(chatId, `❌ | কমান্ড লোড করতে ব্যর্থ হয়েছে!\nত্রুটি: ${err.message}`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }
    }

    // ২. কমান্ড আনলোড করা
    else if (action === "unload") {
      const fileName = args[1];
      if (!fileName) {
        return bot.sendMessage(chatId, "⚠️ | অনুগ্রহ করে আনলোড করার জন্য ফাইলের নাম দিন!", { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }

      const cmdName = fileName.replace(".js", "").toLowerCase();
      if (bot.commands.has(cmdName)) {
        bot.commands.delete(cmdName);
        return bot.sendMessage(chatId, `✅ | সফলভাবে "${cmdName}" কমান্ডটি আনলোড করা হয়েছে!`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      } else {
        return bot.sendMessage(chatId, `❌ | এই নামের কোনোভিক কমান্ড মেমোরিতে পাওয়া যায়নি!`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }
    }

    // ৩. নতুন কমান্ড ইনস্টল করা (URL বা Raw Code থেকে)
    else if (action === "install") {
      let url = args[1];
      let fileName = args[2];

      if (!url || !fileName) {
        return bot.sendMessage(chatId, "⚠️ | ব্যবহার বিধি: `/cmd2 install <URL/RawLink> <filename.js>`", { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }

      if (!fileName.endsWith(".js")) {
        return bot.sendMessage(chatId, "⚠️ | ফাইলের নাম অবশ্যই `.js` দিয়ে শেষ হতে হবে!", { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }

      try {
        // GitHub বা Pastebin লিংক হ্যান্ডলিং
        if (url.includes("github.com")) {
          url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
        } else if (url.includes("pastebin.com") && !url.includes("/raw/")) {
          url = url.replace("pastebin.com/", "pastebin.com/raw/");
        }

        const response = await axios.get(url);
        const rawCode = response.data;

        if (!rawCode) {
          return bot.sendMessage(chatId, "❌ | লিংক থেকে কোড ফেচ করা যায়নি!", { reply_to_message_id: messageId, reply_markup: replyMarkup });
        }

        const savePath = path.join(__dirname, fileName);
        fs.writeFileSync(savePath, rawCode, "utf8");

        // অটো লোড করা
        delete require.cache[require.resolve(savePath)];
        const commandModule = require(savePath);
        const cmdName = commandModule.name || (commandModule.config && commandModule.config.name);

        if (cmdName) {
          bot.commands.set(cmdName.toLowerCase(), commandModule);
        }

        return bot.sendMessage(chatId, `✅ | কমান্ড সফলভাবে ইনস্টল এবং সেভ করা হয়েছে!\n📁 পাথ: commands/${fileName}`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      } catch (err) {
        return bot.sendMessage(chatId, `❌ | ইনস্টল করতে গিয়ে সমস্যা হয়েছে: ${err.message}`, { reply_to_message_id: messageId, reply_markup: replyMarkup });
      }
    }

    // যদি শুধু /cmd2 লেখে, গাইড বা সাহায্য দেখাবে
    const guideText = 
`👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 
───────────────
» 🛠️ **CMD2 Manager Guide:**
» \`/cmd2 load <filename>\` - কমান্ড লোড করুন
» \`/cmd2 unload <filename>\` - কমান্ড আনলোড করুন
» \`/cmd2 install <url> <name.js>\` - লিংক থেকে কমান্ড ইনস্টল করুন
───────────────
👑 𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓 👑`;

    return bot.sendMessage(chatId, guideText, {
      reply_to_message_id: messageId,
      reply_markup: replyMarkup
    });
  }
};
