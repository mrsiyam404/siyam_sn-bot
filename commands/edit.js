const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "edit",
  version: "1.0.0",
  hasPermission: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "AI image editor",
  commandCategory: "image",
  usages: "[reply to image] <prompt>",
  cooldowns: 10
};

module.exports.execute = async function (bot, msg, args) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const replyTo = msg.reply_to_message;

  let photo = null;
  if (replyTo) {
    if (replyTo.photo && replyTo.photo.length > 0) {
      photo = replyTo.photo[replyTo.photo.length - 1];
    } else if (replyTo.document && replyTo.document.mime_type && replyTo.document.mime_type.startsWith('image/')) {
      photo = replyTo.document;
    }
  }

  if (!photo) {
    return bot.sendMessage(
      chatId, 
      "❌ **ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀンド!**\n\n💡 **ᴇxᴀᴍᴘʟᴇ:** `/edit make the background beautiful`", 
      { 
        parse_mode: "Markdown", 
        reply_to_message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [{ text: "👑 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }]
          ]
        }
      }
    );
  }

  const prompt = args.join(" ").trim();
  if (!prompt) {
    return bot.sendMessage(
      chatId, 
      "❌ **ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴏᴍᴘᴛ!**\n\n💡 **ᴇxᴀᴍᴘʟᴇ:** `/edit make the sky sunset`", 
      { parse_mode: "Markdown", reply_to_message_id: messageId }
    );
  }

  const cacheDir = path.join(__dirname, "..", "cache");
  await fs.ensureDir(cacheDir);

  const inputPath = path.join(cacheDir, `imgedit_input_${Date.now()}.jpg`);
  const outputPath = path.join(cacheDir, `imgedit_output_${Date.now()}.jpg`);

  const waitMsg = await bot.sendMessage(
    chatId, 
    "🪒 **ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ...** ⏳", 
    { parse_mode: "Markdown", reply_to_message_id: messageId }
  );

  try {
    const fileId = photo.file_id;
    const fileLink = await bot.getFileLink(fileId);

    const imageResponse = await axios.get(fileLink, {
      responseType: "arraybuffer",
      timeout: 30000
    });

    await fs.writeFile(inputPath, imageResponse.data);
    const form = new FormData();

    form.append("image", fs.createReadStream(inputPath), {
      filename: "image.jpg",
      contentType: "image/jpeg"
    });

    form.append("prompt", prompt);
    form.append("resolution", "2K");
    form.append("ratio", "match_input_image");

    const apiResponse = await axios.post(
      "https://xrahat-image-edit.vercel.app/api/edit",
      form,
      {
        headers: { ...form.getHeaders() },
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const data = apiResponse.data || {};

    if (!data.success || !data.imageUrl) {
      throw new Error(data.error || "Image generation failed");
    }

    const outputResponse = await axios.get(data.imageUrl, {
      responseType: "arraybuffer",
      timeout: 60000
    });

    await fs.writeFile(outputPath, outputResponse.data);

    try {
      await bot.deleteMessage(chatId, waitMsg.message_id);
    } catch (e) {}

    return bot.sendPhoto(chatId, fs.createReadStream(outputPath), {
      caption: `✅ **ɪᴍᴀɢᴇ ᴇᴅɪᴛ ᴄᴏᴍᴘʟᴇᴛᴇ!**\n📝 **ᴘʀᴏᴍᴘᴛ:** \`${prompt}\``,
      parse_mode: "Markdown",
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "👑 𝐎𝐖𝐍𝐄𝐑", url: "https://t.me/ri_siyam" }]
        ]
      }
    });

  } catch (error) {
    try {
      await bot.deleteMessage(chatId, waitMsg.message_id);
    } catch (e) {}

    let errorMessage = "❌ **ɪᴍᴀɢᴇ ᴇᴅɪᴛ ғᴀɪʟᴇᴅ.**";
    if (error.response?.data?.error) {
      errorMessage += `\n\n\`${error.response.data.error}\``;
    } else if (error.message) {
      errorMessage += `\n\n\`${error.message}\``;
    }

    return bot.sendMessage(
      chatId, 
      errorMessage, 
      { parse_mode: "Markdown", reply_to_message_id: messageId }
    );

  } finally {
    setTimeout(async () => {
      try {
        if (await fs.pathExists(inputPath)) await fs.remove(inputPath);
        if (await fs.pathExists(outputPath)) await fs.remove(outputPath);
      } catch (e) {}
    }, 5000);
  }
};
