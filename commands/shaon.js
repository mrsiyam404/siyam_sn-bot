const axios = require("axios");

const endpoints = {
  'video_islam': '/video/islam',
  'video_anime': '/video/anime',
  'video_shairi': '/video/shairi',
  'video_short': '/video/short',
  'video_sad': '/video/sad',
  'video_status': '/video/status',
  'video_football': '/video/football',
  'video_funny': '/video/funny',
  'video_love': '/video/love',
  'video_cpl': '/video/cpl',
  'video_baby': '/video/baby',
  'video_freefire': '/video/freefire',
  'video_lofi': '/video/lofi',
  'video_happy': '/video/happy',
  'video_humaiyun': '/video/humaiyun',
  'video_sex': '/video/sex',
  'video_horny': '/video/horny',
  'video_item': '/video/item',
  'video_hot': '/video/hot',
  'video_capcut': '/video/capcut'
};

const menuText = `╭───•𝗠𝗥 𝗝𝗨𝗪𝗘𝗟•───╮

━━ 𝚅𝙸𝙳𝙴𝙾━━ 
!
!➤1 𝙸𝚂𝙻𝙰𝙼 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤2 𝙰𝙽𝙸𝙼𝙴 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤3 𝚂𝙷𝙰𝙸𝚁𝙸 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤4 𝚂𝙷𝙾𝚁𝚃 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤5 𝚂𝙰𝙳𝚅𝙸𝙳𝙾◄┈╯
!
!➤6 𝚂𝚃𝙰𝚃𝚄𝚂 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤7 𝙵𝙾𝙾𝚃𝙱𝙰𝙻𝙻 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤8 𝙵𝚄𝙽𝙽𝚈 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤9 𝙻𝙾𝚅𝙴 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤10 𝙲𝙿𝙻 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤11 𝙱𝙰𝙱𝚈 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤12 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤13 𝙻𝙾𝙵𝙸 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤14 𝙷𝙰𝙿𝙿𝚈 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤15 𝙷𝚄𝙼𝙰𝙸𝚈𝚄𝙽 𝚂𝙸𝚁 𝚅𝙸𝙳𝙴𝙾◄┈╯
☢━━━💚𝙷𝙾𝚃 𝚅𝙸𝙳𝙴𝙾━━━☢
!➤16 𝚂𝙴𝚇 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤17 𝙷𝙾𝚁𝙽𝚈 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤18 𝙸𝚃𝙴𝙼 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤19 𝙷𝙾𝚃 𝚅𝙸𝙳𝙴𝙾◄┈╯
!
!➤20 𝙲𝙰𝙿𝙲𝚄𝚃 𝚅𝙸𝙳𝙴𝙾◄┈╯
━━━━━━━━━━━━━━━━
𝙾𝚆𝙽𝙴𝚁: 𝙼𝚁 𝙹𝚄𝚆𝙴𝙻 𝙵𝚋 facebook.com/mrjuwel999_
━━━━━━━━━━━━━━━━━━━━━━━
𝙰 𝙿 𝙸//𝙹𝚄𝚆𝙴𝙻
━━━━━━━━━━━━━━━
╰──𝙼𝚁 𝙹𝚄𝗪𝙴𝙻 𝙿𝚁𝙾𝙹𝙴𝙲𝚃──╯

Tell me how many video numbers you want to see by clicking the buttons below`;

module.exports = {
  name: "shaon",
  version: "1.0.0",
  role: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Send a trending TikTok video",
  category: "media",
  cooldowns: 5,

  execute: async (bot, msg, args) => {
    const chatId = msg.chat.id;

    const inlineKeyboard = {
      inline_keyboard: [
        [ { text: "🕌 1. ISLAM", callback_data: "video_islam" }, { text: "🎨 2. ANIME", callback_data: "video_anime" } ],
        [ { text: "📜 3. SHAIRI", callback_data: "video_shairi" }, { text: "🎬 4. SHORT", callback_data: "video_short" } ],
        [ { text: "😢 5. SAD", callback_data: "video_sad" }, { text: "📱 6. STATUS", callback_data: "video_status" } ],
        [ { text: "⚽ 7. FOOTBALL", callback_data: "video_football" }, { text: "😂 8. FUNNY", callback_data: "video_funny" } ],
        [ { text: "❤️ 9. LOVE", callback_data: "video_love" }, { text: "💑 10. CPL", callback_data: "video_cpl" } ],
        [ { text: "👶 11. BABY", callback_data: "video_baby" }, { text: "🔥 12. FREE FIRE", callback_data: "video_freefire" } ],
        [ { text: "🎧 13. LOFI", callback_data: "video_lofi" }, { text: "😊 14. HAPPY", callback_data: "video_happy" } ],
        [ { text: "📚 15. HUMAIYUN", callback_data: "video_humaiyun" }, { text: "🔞 16. SEX", callback_data: "video_sex" } ],
        [ { text: "🔥 17. HORNY", callback_data: "video_horny" }, { text: "⭐ 18. ITEM", callback_data: "video_item" } ],
        [ { text: "🥵 19. HOT", callback_data: "video_hot" }, { text: "📼 20. CAPCUT", callback_data: "video_capcut" } ]
      ]
    };

    await bot.sendMessage(chatId, menuText, {
      reply_markup: inlineKeyboard
    });
  },

  onCallbackQuery: async (bot, query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!endpoints[data]) return;

    let loadingMsg;
    try {
      // বাটনে ক্লিক করার সাথে সাথে লোডিং মেসেজ পাঠানো
      loadingMsg = await bot.sendMessage(chatId, "🔄 ভিডিও লোড হচ্ছে, একটু অপেক্ষা করুন...");
      await bot.answerCallbackQuery(query.id, { text: "🔄 Fetching video..." });

      const githubRes = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
      const baseApi = githubRes.data.api;
      const videoApiUrl = baseApi + endpoints[data];

      const response = await axios.get(videoApiUrl);
      const videoDataUrl = response.data.data || response.data.url;
      const totalCount = response.data.count || "N/A";
      const videoTitle = response.data.title || "Here is your video";

      const videoStreamResponse = await axios.get(videoDataUrl, { responseType: 'stream' });

      // ভিডিও পাঠানো
      await bot.sendVideo(chatId, videoStreamResponse.data, {
        caption: '🟡' + videoTitle + '\n𝚃𝙾𝚃𝙰𝙻 𝚅𝙸𝙳𝙴𝙾: ' + totalCount + '\n𝙰 𝙿 𝙸  𝗠𝗥 卝 𝗝𝚄𝗪𝙴𝗟🎀'
      });

      // ভিডিও সফলভাবে আসলে লোডিং মেসেজ ডিলিট করে দেওয়া
      if (loadingMsg && loadingMsg.message_id) {
        await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
      }

    } catch (error) {
      // কোনো সমস্যা হলে লোডিং মেসেজটি ডিলিট করে এরর মেসেজ দেখানো
      if (loadingMsg && loadingMsg.message_id) {
        await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
      }
      await bot.sendMessage(chatId, "❌ ভিডিও আনতে সমস্যা হয়েছে অথবা এপিআই কাজ করছে না!");
    }
  }
};
