const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const cacheDir = path.join(__dirname, "..", "cache");
const statusFile = path.join(__dirname, "..", "autotimer_status.json");

const timerData = {
  "12:00 AM": { text: "🌌 এখন রাত ১২টা বাজে❥︎নতুন দিন শুরু হলো ✨", url: "https://files.catbox.moe/2ii8c7.mp4" },
  "01:00 AM": { text: "🌙 এখন রাত ১টা বাজে❥︎গভীর রাত, ঘুমাও সবাই 🤫", url: "https://files.catbox.moe/ah0s9r.mp4" },
  "02:00 AM": { text: "🖤 এখন রাত ২টা বাজে❥︎কিছু নীরব স্মৃতি ও একাকীত্ব 🥀", url: "https://files.catbox.moe/ydwkrm.mp4" },
  "03:00 AM": { text: "💤 এখন রাত ৩টা বাজে❥︎মন শুধু তোমাকেই খোঁজে 🥺", url: "https://files.catbox.moe/111n24.mp4" },
  "04:00 AM": { text: "🕌 এখন ভোর ৪টা বাজে❥︎তাহাজ্জুদ/ফজরের প্রস্তুতি নাও 🤲", url: "https://files.catbox.moe/ebyeyi.mp4" },
  "05:00 AM": { text: "🌅 এখন ভোর ৫টা বাজে❥︎শুভ সকাল, ভালো কাটুক দিনটি ☕", url: "https://files.catbox.moe/olpzpk.mp4" },
  "06:00 AM": { text: "🌞 এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই ☕", url: "https://files.catbox.moe/3y330y.mp4" },
  "07:00 AM": { text: "🍞 এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও", url: "https://files.catbox.moe/j4fhyp.mp4" },
  "08:00 AM": { text: "✨ এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে", url: "https://files.catbox.moe/gc2ard.mp4" },
  "09:00 AM": { text: "🕘 এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই", url: "https://files.catbox.moe/44oya3.mp4" },
  "10:00 AM": { text: "☀️ এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি", url: "https://files.catbox.moe/ffvnm1.mp4" },
  "11:00 AM": { text: "😌 এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও", url: "https://files.catbox.moe/c5ja93.mp4" },
  "12:00 PM": { text: "❤️ এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে", url: "https://files.catbox.moe/56bgjp.mp4" },
  "01:00 PM": { text: "🤲 এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/2l5loh.mp4" },
  "02:00 PM": { text: "🍛 এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো", url: "https://files.catbox.moe/0j8bwh.mp4" },
  "03:00 PM": { text: "☀️ এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো", url: "https://files.catbox.moe/4hjg4f.mp4" },
  "04:00 PM": { text: "🥀 এখন বিকাল ৪টা বাজে❥︎আসরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/l5bfws.mp4" },
  "05:00 PM": { text: "🌆 এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও", url: "https://files.catbox.moe/7nvnsi.mp4" },
  "06:00 PM": { text: "🌇 এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও 😍", url: "https://files.catbox.moe/j7gndp.mp4" },
  "07:00 PM": { text: "🌃 এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো ❤️", url: "https://files.catbox.moe/9tfka4.mp4" },
  "08:00 PM": { text: "🧖 এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো", url: "https://files.catbox.moe/6dyzum.mp4" },
  "09:00 PM": { text: "🌙 এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও 😴", url: "https://files.catbox.moe/hgf9vq.mp4" },
  "10:00 PM": { text: "💤 এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে", url: "https://files.catbox.moe/3e5pct.mp4" },
  "11:00 PM": { text: "🌌 এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো 🥰", url: "https://files.catbox.moe/uak967.mp4" }
};

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

if (!fs.existsSync(statusFile)) {
  fs.writeJsonSync(statusFile, { activeThreads: [] });
}

let lastSentTime = "";

module.exports = {
  config: {
    name: "autotimer",
    version: "12.0",
    role: 1,
    author: AUTHOR_LOCK,
    shortDescription: "⏰ ২৪ ঘণ্টায় ২৪টি ভিডিও ও টেক্সট পাঠাবে",
    longDescription: "অ্যাডমিনের অনুমতি সাপেক্ষে নির্দিষ্ট গ্রুপে প্রতি ঘণ্টায় অটো ভিডিও ও টেক্সট পাঠাবে।",
    category: "AutoTime",
    guide: "autotimer <on/off>"
  },

  onLoad: async function (bot) {
    console.log("🔥 TELEGRAM AUTOTIMER LOADED SUCCESSFULLY");

    const checkTimeAndSend = async () => {
      try {
        if (!fs.existsSync(statusFile)) return;
        const statusData = fs.readJsonSync(statusFile);

        if (!statusData.activeThreads || statusData.activeThreads.length === 0) return;

        const currentTime = moment().tz("Asia/Dhaka");
        const minutes = currentTime.format("mm");
        const now = currentTime.format("hh:00 A");

        if (minutes !== "00") return;
        if (!timerData[now]) return;

        if (now !== lastSentTime) {
          lastSentTime = now;

          const todayDate = currentTime.format("DD-MM-YYYY");
          const currentHourData = timerData[now];
          const videoUrl = currentHourData.url;

          const videoName = `video_${now.replace(/:| /g, "_")}.mp4`;
          const videoPath = path.join(cacheDir, videoName);

          if (!fs.existsSync(videoPath) || fs.statSync(videoPath).size === 0) {
            const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(videoPath, Buffer.from(response.data));
          }

          const text = currentHourData.text;
          const msg = 
`╭───────────────⭓
│ ⏰ 𝗔𝗨𝗧𝗢 𝗧𝗜𝗠𝗘 𝗡𝗢𝗧𝗘
├───────────────⭓
│ 🕒 𝗧𝗜𝗠𝗘 : ${now}
│ 📅 𝗗𝗔𝗧𝗘 : ${todayDate}
├───────────────⭓
│ ${text}
├───────────────⭓
│ 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
╰───────────────⭓`;

          statusData.activeThreads.forEach((chatId, index) => {
            setTimeout(async () => {
              try {
                const sentMsg = await bot.sendVideo(chatId, fs.createReadStream(videoPath), {
                  caption: msg
                });
                
                // ৩০ মিনিট পর মেসেজ ডিলিট করার অপশন (টেলিগ্রামে সমর্থিত)
                if (sentMsg && sentMsg.message_id) {
                  setTimeout(async () => {
                    try {
                      await bot.deleteMessage(chatId, sentMsg.message_id);
                    } catch (e) {}
                  }, 30 * 60 * 1000);
                }
              } catch (err) {
                console.error("AutoTimer Send Error:", err.message);
              }
            }, index * 3000);
          });
        }
      } catch (err) {
        console.error("❌ Error in interval:", err.message);
      }
    };

    setInterval(checkTimeAndSend, 60000);
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (!fs.existsSync(statusFile)) {
      fs.writeJsonSync(statusFile, { activeThreads: [] });
    }
    let statusData = fs.readJsonSync(statusFile);

    if (!args[0]) {
      const guideText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚙️ 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘
» \`/autotimer on\`  -> 📽️ চালু করতে ✅
» \`/autotimer off\` -> 🫶 বন্ধ করতে ❌
───────────────
» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

      return bot.sendMessage(chatId, guideText, { reply_to_message_id: messageId });
    }

    const action = args[0].toLowerCase();

    if (action === "on") {
      if (statusData.activeThreads.includes(chatId)) {
        return bot.sendMessage(chatId, "» ✅ 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 ইতিমধ্যে 𝑶𝑵 আছে এই গ্রুপে 🟢", { reply_to_message_id: messageId });
      }
      statusData.activeThreads.push(chatId);
      fs.writeJsonSync(statusFile, { activeThreads: statusData.activeThreads });

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: "https://t.me/siyam_nu_bot?startgroup=true" },
            { text: "👑 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }
          ]
        ]
      };

      return bot.sendMessage(chatId, "» ⏰ 👑 𝐀𝐔𝐓𝐎 𝐓𝐈𝐌𝐄𝐑 𝐎𝐍 ✅\n» ✡️ এখন থেকে এই গ্রুপে অটো ভিডিও যাবে 📥", { 
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });
    }

    if (action === "off") {
      if (!statusData.activeThreads.includes(chatId)) {
        return bot.sendMessage(chatId, "» 🛑 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 আগেই 𝑶𝑭𝑭 আছে এই গ্রুপে 📴", { reply_to_message_id: messageId });
      }
      statusData.activeThreads = statusData.activeThreads.filter(id => id !== chatId);
      fs.writeJsonSync(statusFile, { activeThreads: statusData.activeThreads });

      return bot.sendMessage(chatId, "» 📴 𝘼𝙐𝙏𝙊 𝙏𝙄𝗠𝙀𝙍 𝙊𝙁𝙁 ⚙️\n» 🔕 এখন আর অটো ভিডিও যাবে না 🚫", { reply_to_message_id: messageId });
    }
  }
};
