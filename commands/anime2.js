const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const CREDIT = "𝐒𝐈𝐘𝐀𝐌"; // আপনার নাম

const LINKS = [
  "https://i.imgur.com/R3ptum9.mp4",
  "https://i.imgur.com/tUed2nt.mp4",
  "https://i.imgur.com/sqHWn6v.mp4",
  "https://i.imgur.com/CU2KBTj.mp4",
  "https://i.imgur.com/en18l6Z.mp4",
  "https://i.imgur.com/FrRANZq.mp4",
  "https://i.imgur.com/GmVN0IA.mp4",
  "https://i.imgur.com/OVjxg39.mp4",
  "https://i.imgur.com/2ZxQMZT.mp4",
  "https://i.imgur.com/35i7fZn.mp4",
  "https://i.imgur.com/h4YJi4u.mp4",
  "https://i.imgur.com/hECxsV2.mp4",
  "https://i.imgur.com/wPNLVdB.mp4",
  "https://i.imgur.com/MLnjK9Z.mp4",
  "https://i.imgur.com/2jlAzWF.mp4",
  "https://i.imgur.com/scTn8LO.mp4",
  "https://i.imgur.com/oZlfcRM.mp4",
  "https://i.imgur.com/yAF2Vv8.mp4"
];

const MOODS = [
  "Anime Mode 🎌",
  "Otaku Vibes 🔥",
  "Senpai Energy 🌸",
  "Epic Fight ⚔️",
  "Kawaii Mood 💖"
];

const MAX_SIZE = 50 * 1024 * 1024; // Telegram Limit ~50MB
const MAX_TRIES = 6;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCaption(index, total) {
  return [
    "╭━━━━━━━━━━━━━━━━━━╮",
    "    🎌  𝐀𝐍𝐈𝐌𝐄  𝐕𝐈𝐃𝐄𝐎  🎌",
    "╰━━━━━━━━━━━━━━━━━━╯",
    "",
    `🎬 ଭିଡିଓ  : ${index}/${total}`,
    `⚡ ମୁଡ୍     : ${pick(MOODS)}`,
    "",
    "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈",
    `👑 𝐎𝐖𝐍𝐄𝐑 : ${CREDIT}`
  ].join("\n");
}

function download(url, dest) {
  return axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 60000,
    maxRedirects: 5,
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36",
      "Referer": "https://imgur.com/",
      "Accept": "video/mp4,video/*;q=0.9,*/*;q=0.8"
    }
  }).then((res) => {
    const type = String(res.headers["content-type"] || "");
    if (!type.includes("video")) {
      res.data.destroy();
      throw new Error("Not a video");
    }

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(dest);
      let received = 0;
      let failed = false;

      const fail = (err) => {
        if (failed) return;
        failed = true;
        try { res.data.destroy(); } catch (e) {}
        try { writer.destroy(); } catch (e) {}
        reject(err);
      };

      res.data.on("data", (chunk) => {
        received += chunk.length;
        if (received > MAX_SIZE) fail(new Error("File too large"));
      });

      res.data.pipe(writer);
      writer.on("finish", () => { if (!failed) resolve(); });
      writer.on("error", fail);
      res.data.on("error", fail);
    });
  });
}

// ইনলাইন বাটন ফাংশন (বট ইউজারনেম এবং অনার লিংক এখানে সেট হবে)
const getInlineKeyboard = (botUsername) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [ { text: "⏭️ 𝐍𝐄𝐗𝐓 𝐕𝐈𝐃𝐄𝐎", callback_data: "anime_next" } ],
        [ 
          { text: "➕ 𝐀𝐃𝐃 𝐓𝐎 𝐆𝐑𝐎𝐔𝐏", url: `https://t.me/${botUsername}?startgroup=true` },
          { text: "👑 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/mr_siyam_1" } // এখানে আপনার টেলিগ্রাম ইউজারনেম বা লিংক দিন
        ]
      ]
    }
  };
};

module.exports = {
  name: "anime2",
  version: "1.3.0",
  role: 0,
  credits: CREDIT,
  description: "Anime Video",
  category: "Video",
  usages: "anime",
  cooldowns: 5,

  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const videoPath = path.join(cacheDir, `anime_${Date.now()}_${chatId}.mp4`);

    const cleanup = () => {
      try {
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      } catch (e) {}
    };

    const waitMsg = await bot.sendMessage(chatId, "⏳ 𝐀𝐧𝐢𝐦𝐞 ভিডিও লোড হচ্ছে, একটু অপেক্ষা করো...").catch(() => null);

    const pool = shuffle(LINKS).slice(0, MAX_TRIES);
    let usedUrl = null;

    for (const url of pool) {
      try {
        await download(url, videoPath);
        const size = fs.statSync(videoPath).size;
        if (size > 0 && size <= MAX_SIZE) {
          usedUrl = url;
          break;
        }
        cleanup();
      } catch (err) {
        cleanup();
      }
    }

    if (waitMsg && waitMsg.message_id) {
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
    }

    if (!usedUrl) {
      return bot.sendMessage(chatId, `❌ Anime ভিডিও পাঠাতে সমস্যা হয়েছে!\nআবার চেষ্টা করো।\n\n👑 𝐎𝐖𝐍𝐄𝐑 : ${CREDIT}`);
    }

    const caption = buildCaption(LINKS.indexOf(usedUrl) + 1, LINKS.length);
    const botInfo = await bot.getMe().catch(() => ({ username: "bot" }));

    await bot.sendVideo(chatId, fs.createReadStream(videoPath), {
      caption: caption,
      ...getInlineKeyboard(botInfo.username)
    });

    cleanup();
  },

  onCallbackQuery: async (bot, query) => {
    const data = query.data;
    if (!data || data !== "anime_next") return;

    const chatId = query.message.chat.id;
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const videoPath = path.join(cacheDir, `anime_next_${Date.now()}_${chatId}.mp4`);

    const cleanup = () => {
      try {
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      } catch (e) {}
    };

    try {
      await bot.answerCallbackQuery(query.id, { text: "🔄 Loading next anime video..." });

      const pool = shuffle(LINKS).slice(0, MAX_TRIES);
      let usedUrl = null;

      for (const url of pool) {
        try {
          await download(url, videoPath);
          const size = fs.statSync(videoPath).size;
          if (size > 0 && size <= MAX_SIZE) {
            usedUrl = url;
            break;
          }
          cleanup();
        } catch (err) {
          cleanup();
        }
      }

      if (!usedUrl) {
        return bot.answerCallbackQuery(query.id, { text: "❌ Failed to load video!" });
      }

      const caption = buildCaption(LINKS.indexOf(usedUrl) + 1, LINKS.length);
      const botInfo = await bot.getMe().catch(() => ({ username: "bot" }));

      // আগের ভিডিও ডিলিট না করে নতুন ভিডিও নিচে পাঠানো হবে
      await bot.sendVideo(chatId, fs.createReadStream(videoPath), {
        caption: caption,
        ...getInlineKeyboard(botInfo.username)
      });

      cleanup();

    } catch (e) {
      cleanup();
      await bot.answerCallbackQuery(query.id, { text: "❌ Error loading video!" });
    }
  }
};
