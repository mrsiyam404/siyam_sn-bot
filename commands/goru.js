const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "goru",
    version: "2.3",
    author: AUTHOR_LOCK,
    role: 0,
    shortDescription: "Expose someone as a Goru!",
    longDescription: "Puts the replied user's face on a cow's body (fun meme) with inline buttons.",
    category: "fun",
    guide: "goru"
  },

  execute: async function (bot, msg, args) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const replyMessage = msg.reply_to_message;

    let targetUser = null;
    if (replyMessage && replyMessage.from) {
      targetUser = replyMessage.from;
    } else if (msg.entities) {
      // যদি মেনশন করা থাকে
      const mentionEntity = msg.entities.find(e => e.type === "text_mention");
      if (mentionEntity && mentionEntity.user) {
        targetUser = mentionEntity.user;
      }
    }

    if (!targetUser) {
      return bot.sendMessage(chatId, "❗ কাউকে গরুতে রূপান্তর করতে চাইলে তার মেসেজে রিপ্লাই দিয়ে `/goru` লিখুন! 😂", { reply_to_message_id: messageId });
    }

    if (String(targetUser.id) === String(msg.from.id)) {
      return bot.sendMessage(chatId, "❗ ব্রো, নিজের ছবি কেন গরুর গায়ে লাগাতে চাচ্ছো? অন্য কাউকে টার্গেট করো! 🐮", { reply_to_message_id: messageId });
    }

    const waitMsg = await bot.sendMessage(chatId, "⌛️ একটু অপেক্ষা করুন, বিদেশী গরু বানানোর প্রস্তুতি চলছে... 🐮", { reply_to_message_id: messageId });

    const cacheDir = path.join(__dirname, "..", "cache");
    await fs.ensureDir(cacheDir);

    try {
      // টেলিগ্রাম থেকে ইউজারের প্রোফাইল পিকচার ফেচ করা
      const userProfilePhotos = await bot.getUserProfilePhotos(targetUser.id, { limit: 1 });
      let avatarBuffer = null;

      if (userProfilePhotos && userProfilePhotos.total_count > 0) {
        const photo = userProfilePhotos.photos[0][userProfilePhotos.photos[0].length - 1];
        const fileLink = await bot.getFileLink(photo.file_id);
        const avatarRes = await axios.get(fileLink, { responseType: "arraybuffer", timeout: 15000 });
        avatarBuffer = Buffer.from(avatarRes.data);
      } else {
        // যদি প্রোফাইল পিক না থাকে, ডিফল্ট বা অন্য কোনো ব্যবস্থা
        throw new Error("No profile photo");
      }

      const bgPath = path.join(cacheDir, "cow_bg.jpg");
      let bgImage;
      if (fs.existsSync(bgPath)) {
        const bgBuffer = await fs.readFile(bgPath);
        bgImage = await loadImage(bgBuffer);
      } else {
        const cowImgUrl = "https://files.catbox.moe/ecebko.jpg";
        const bgResponse = await axios.get(cowImgUrl, {
          responseType: "arraybuffer",
          timeout: 20000,
        });
        await fs.writeFile(bgPath, Buffer.from(bgResponse.data));
        bgImage = await loadImage(Buffer.from(bgResponse.data));
      }

      const avatarImage = await loadImage(avatarBuffer);

      const canvas = createCanvas(bgImage.width, bgImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bgImage, 0, 0);

      const avatarSize = 135;
      const headCenterX = 80 + avatarSize / 2;
      const headCenterY = 60 + avatarSize / 2;

      const avatarX = headCenterX - avatarSize / 2;
      const avatarY = headCenterY - avatarSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(headCenterX, headCenterY, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(headCenterX, headCenterY, avatarSize / 2 + 1, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 5;
      ctx.fillText("Kire chdna", 40, 50);

      const outputPath = path.join(cacheDir, `goru_${targetUser.id}_${Date.now()}.png`);
      const buffer = canvas.toBuffer("image/png");
      await fs.writeFile(outputPath, buffer);

      try {
        await bot.deleteMessage(chatId, waitMsg.message_id);
      } catch (e) {}

      const targetName = targetUser.first_name || "Someone";

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: "🤖 𝐀𝐃𝐃 𝐁𝐎𝐓", url: "https://t.me/siyam_nu_bot?startgroup=true" },
            { text: "👑 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }
          ]
        ]
      };

      await bot.sendPhoto(
        chatId,
        fs.createReadStream(outputPath),
        {
          caption: `😹\n[${targetName}](tg://user?id=${targetUser.id}) একদম আসল গরু হয়েছে বিদেশী গরু! 🐮✨ আরো কর বস সিয়াম এর সাথে বিয়াদবি😴\n\n👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
          parse_mode: "Markdown",
          reply_to_message_id: messageId,
          reply_markup: replyMarkup
        }
      );

      setTimeout(() => {
        try {
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) {}
      }, 5000);

    } catch (err) {
      try {
        await bot.deleteMessage(chatId, waitMsg.message_id);
      } catch (e) {}
      console.error("❌ Goru Command Error:", err.message);
      return bot.sendMessage(chatId, "⚠️ ইউজারের প্রোফাইল পিকচার ফেচ করতে সমস্যা হয়েছে অথবা অন্য কোনো এরর ঘটেছে!", { reply_to_message_id: messageId });
    }
  }
};
