const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const AUTHOR_LOCK = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "chipay",
    aliases: ["corner", "চিপা"],
    version: "2.4.9",
    author: AUTHOR_LOCK,
    countDown: 5,
    role: 0,
    shortDescription: "Fun command with image and stylish caption",
    category: "fun",
    guide: "chipay"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderID = String(msg.from.id);
    const replyMessage = msg.reply_to_message;

    const cacheDir = path.join(__dirname, "..", "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    let targetUser = null;
    if (msg.entities) {
      const mentionEntity = msg.entities.find(e => e.type === "text_mention");
      if (mentionEntity && mentionEntity.user) {
        targetUser = mentionEntity.user;
      }
    }
    if (!targetUser && replyMessage && replyMessage.from) {
      targetUser = replyMessage.from;
    }

    if (!targetUser) {
      return bot.sendMessage(chatId, "🤦‍♂️ | আরে ভাই, কাকে চিপায় নিবেন তারে মেনশন দিন বা মেসেজে রিপ্লাই করুন!", { reply_to_message_id: messageId });
    }

    const targetID = String(targetUser.id);
    const targetName = targetUser.first_name || "User";
    const imgPath = path.join(cacheDir, `chipay_${Date.now()}.png`);

    const waitMsg = await bot.sendMessage(chatId, "⏳ | একটু দাঁড়ান, চিপায় ঝালমুড়ি খাওয়ার ব্যাবস্থা করতেছি... 😋", { reply_to_message_id: messageId });

    try {
      const backgroundUrl = "https://i.imgur.com/PlmZXfJ.jpeg";
      
      // টেলিগ্রাম থেকে টার্গেট এবং সেন্ডারের প্রোফাইল পিকচার ফেচ করা
      const getTelegramAvatar = async (uid) => {
        try {
          const photos = await bot.getUserProfilePhotos(uid, { limit: 1 });
          if (photos && photos.total_count > 0) {
            const photo = photos.photos[0][photos.photos[0].length - 1];
            const fileLink = await bot.getFileLink(photo.file_id);
            const res = await axios.get(fileLink, { responseType: "arraybuffer", timeout: 10000 });
            return Buffer.from(res.data);
          }
        } catch (e) {}
        // যদি প্রোফাইল পিক না থাকে, ক্যাটাগরি ডিফল্ট ইমেজ বা ব্যাকআপ
        const fallbackRes = await axios.get("https://i.imgur.com/PlmZXfJ.jpeg", { responseType: "arraybuffer" });
        return Buffer.from(fallbackRes.data);
      };

      const [bgBuffer, avtLeftBuffer, avtRightBuffer] = await Promise.all([
        axios.get(backgroundUrl, { responseType: "arraybuffer" }).then(res => Buffer.from(res.data)),
        getTelegramAvatar(targetID),
        getTelegramAvatar(senderID)
      ]);

      const bgImg = await loadImage(bgBuffer);
      const avtLeft = await loadImage(avtLeftBuffer);
      const avtRight = await loadImage(avtRightBuffer);

      const canvas = createCanvas(bgImg.width, bgImg.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // --- Draw Box and Name inside Image ---
      ctx.font = "bold 18px Arial"; 
      const textWidth = ctx.measureText(targetName).width;
      const textX = canvas.width - 100;
      const textY = canvas.height - 103;

      const padding = 10;
      const boxWidth = textWidth + padding * 2;
      const boxHeight = 28;
      const boxX = textX - boxWidth; 
      const boxY = textY - 20;

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = "#FFFFFF"; 
      ctx.textAlign = "right"; 
      const drawTextX = textX - padding;
      ctx.fillText(targetName, drawTextX, textY);

      const avatarSizeLeft = 110; 
      const avatarSizeUser = 95; 

      // --- Left Side (Target) ---
      const xLeft = 85, yLeft = 85; 
      ctx.save();
      ctx.beginPath();
      ctx.arc(xLeft + avatarSizeLeft / 2, yLeft + avatarSizeLeft / 2, avatarSizeLeft / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avtLeft, xLeft, yLeft, avatarSizeLeft, avatarSizeLeft);
      ctx.restore();

      // --- Right Side (Sender) ---
      const xRight = 350, yRight = 100; 
      ctx.save();
      ctx.beginPath();
      ctx.arc(xRight + avatarSizeUser / 2, yRight + avatarSizeUser / 2, avatarSizeUser / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avtRight, xRight, yRight, avatarSizeUser, avatarSizeUser);
      ctx.restore();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);

      try {
        await bot.deleteMessage(chatId, waitMsg.message_id);
      } catch (e) {}

      const caption = `😾⎯͢⎯⃝⋆⃝চিঁপাঁয়ঁ আঁয়ঁ ঝাঁলঁমুঁড়িঁ বাঁনাঁয়ঁছিঁ🙈 ⋆⃝⋆⃝😹😒⋆🐰🍒\n\n[${targetName}](tg://user?id=${targetID}) এ্ঁদি্ঁকে্ঁ আ্ঁসো্ঁ 💋💋\n\n👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: "https://t.me/siyam_nu_bot?startgroup=true" },
            { text: "👑 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }
          ]
        ]
      };

      await bot.sendPhoto(
        chatId,
        fs.createReadStream(imgPath),
        {
          caption: caption,
          parse_mode: "Markdown",
          reply_to_message_id: messageId,
          reply_markup: replyMarkup
        }
      );

      try {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      } catch (e) {}

    } catch (error) {
      try {
        await bot.deleteMessage(chatId, waitMsg.message_id);
      } catch (e) {}
      console.error("CHIPAY ERROR:", error.message);
      return bot.sendMessage(chatId, "🥭 | Error! Failed to process image. Please try again.", { reply_to_message_id: messageId });
    }
  }
};
