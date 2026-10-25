const os = require('os');
const axios = require('axios');

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

// Helper: Format Bytes to MB/GB
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper: Format Uptime
function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

// Helper: Fancy Font Converter
function toFancyFont(text) {
  const fonts = {
    bold: text.replace(/[a-zA-Z]/g, c => {
      const code = c.charCodeAt(0);
      return String.fromCodePoint(code >= 97 ? 0x1d5ba + code - 97 : 0x1d5a0 + code - 65);
    }),
    italic: text.replace(/[a-zA-Z]/g, c => {
      const code = c.charCodeAt(0);
      return String.fromCodePoint(code >= 97 ? 0x1d622 + code - 97 : 0x1d608 + code - 65);
    }),
    mono: text.replace(/[a-zA-Z0-9]/g, c => {
      const code = c.charCodeAt(0);
      if (code >= 97) return String.fromCodePoint(0x1d69a + code - 97);
      if (code >= 65) return String.fromCodePoint(0x1d680 + code - 65);
      return String.fromCodePoint(0x1d7f6 + code - 48);
    })
  };
  return fonts;
}

// Helper: Dashboard Text
function getMainDashboard() {
  return `╭━❮ 👑 𝐒𝐍𝐂 𝐎𝐌𝐍𝐈-𝐒𝐔𝐈𝐓𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 👤 𝐎𝐰𝐧𝐞𝐫: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
├‣ ⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 2.5.0 Extreme
├‣ 🌐 𝐒𝐭𝐚𝐭𝐮𝐬: All Engines Active
├═━═━═━═━═━═━═━═━═
├‣ নিচের বাটনগুলো চাপুন অথবা সরাসরি 
├‣ কমান্ড ব্যবহার করুন:
├‣ 📌 \`/omni qr <text>\`
├‣ 📌 \`/omni ip <ip/domain>\`
├‣ 📌 \`/omni font <text>\`
├‣ 📌 \`/omni pass <length>\`
├‣ 📌 \`/omni b64enc <text>\`
╰━═━═━═━═━═━═━═━═╯`;
}

// Inline Keyboard Generator
function getKeyboard(activeTab = 'main') {
  if (activeTab === 'main') {
    return {
      inline_keyboard: [
        [
          { text: "💻 সিস্টেম হেলথ", callback_data: "omni_sys" },
          { text: "🛠 ইউটিলিটি টুলস", callback_data: "omni_utils" }
        ],
        [
          { text: "🎲 র‍্যান্ডম লাক", callback_data: "omni_luck" },
          { text: "👑 ওনার ইনফো", callback_data: "omni_owner" }
        ],
        [
          { text: "❌ মেনু বন্ধ করুন", callback_data: "omni_close" }
        ]
      ]
    };
  }

  // Back Button for sub-menus
  return {
    inline_keyboard: [
      [{ text: "🔙 প্রধান মেনু (Back)", callback_data: "omni_main" }],
      [{ text: "❌ বন্ধ করুন", callback_data: "omni_close" }]
    ]
  };
}

module.exports = {
  config: {
    name: "omni",
    aliases: ["tools", "box", "master", "hub"],
    version: "2.5.0",
    role: 0,
    author: AUTHOR_LOCK,
    shortDescription: "Ultra All-In-One Power Suite 🚀",
    longDescription: "Complete Swiss-Army-Knife with Diagnostics, Dev Tools, QR, IP Lookup, and Fonts.",
    category: "power-tools",
    guide: "/omni or /omni <subcommand>"
  },

  onStart: async function ({ bot, msg, args }) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const sub = args[0] ? args[0].toLowerCase() : null;
    const input = args.slice(1).join(" ");

    // 1. Direct Command: QR Code Generator
    if (sub === 'qr') {
      if (!input) return bot.sendMessage(chatId, "⚠️ দয়া করে কিছু লিখুন! যেমন: `/omni qr https://google.com`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=15&data=${encodeURIComponent(input)}`;
      return bot.sendPhoto(chatId, qrUrl, {
        caption: `✨ 𝗬𝗼𝘂𝗿 𝗤𝗥 𝗖𝗼𝗱𝗲 𝗶𝘀 𝗥𝗲𝗮𝗱𝘆!\n📝 𝗗𝗮𝘁𝗮: \`${input}\`\n👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        parse_mode: "Markdown",
        reply_to_message_id: messageId
      });
    }

    // 2. Direct Command: IP / Domain Geolocation
    if (sub === 'ip') {
      if (!input) return bot.sendMessage(chatId, "⚠️ আইপি অথবা ডোমেন লিখুন! যেমন: `/omni ip 8.8.8.8`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      bot.sendChatAction(chatId, "typing").catch(() => {});
      try {
        const { data } = await axios.get(`http://ip-api.com/json/${encodeURIComponent(input)}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        if (data.status !== 'success') throw new Error(data.message || 'Lookup failed');

        const report = 
`╭━❮ 🌐 𝐈𝐏 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🎯 𝗧𝗮𝗿𝗴𝗲𝘁: \`${data.query}\`
├‣ 🌍 𝗖𝗼𝘂𝗻𝘁𝗿𝘆: ${data.country}
├‣ 🏙 𝗖𝗶𝘁𝘆: ${data.city}, ${data.regionName}
├‣ 📮 𝗭𝗶𝗽: ${data.zip || 'N/A'}
├‣ 🏢 𝗜𝗦𝗣: ${data.isp}
├‣ 📡 𝗢𝗿𝗴: ${data.org || 'N/A'}
├‣ 🌐 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${data.timezone}
├‣ 📍 𝗖𝗼𝗼𝗿𝗱𝘀: ${data.lat}, ${data.lon}
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
╰━═━═━═━═━═━═━═━═╯`;
        return bot.sendMessage(chatId, report, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ আইপি ইনফরমেশন খুঁজে পাওয়া যায়নি: ${e.message}`, { reply_to_message_id: messageId });
      }
    }

    // 3. Direct Command: Fancy Font Converter
    if (sub === 'font') {
      if (!input) return bot.sendMessage(chatId, "⚠️ ফন্ট পরিবর্তন করার জন্য টেক্সট দিন! যেমন: `/omni font Hello World`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      const f = toFancyFont(input);
      const fontText = 
`╭━❮ ✨ 𝐅𝐀𝐍𝐂𝐘 𝐅𝐎𝐍𝐓𝐒 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 𝟏. 𝗕𝗼𝗹𝗱:
\`${f.bold}\`

├‣ 𝟐. 𝗜𝘁𝗮𝗹𝗶𝗰:
\`${f.italic}\`

├‣ 𝟑. 𝗠𝗼𝗻𝗼𝘀𝗽𝗮𝗰𝗲:
\`${f.mono}\`
╰━═━═━═━═━═━═━═━═╯`;
      return bot.sendMessage(chatId, fontText, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    // 4. Direct Command: High-Security Password Generator
    if (sub === 'pass') {
      const len = parseInt(input) || 16;
      if (len < 6 || len > 64) return bot.sendMessage(chatId, "⚠️ পাসওয়ার্ডের দৈর্ঘ্য ৬ থেকে ৬৪ এর মধ্যে দিন!", { reply_to_message_id: messageId });
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><";
      let pass = "";
      for (let i = 0; i < len; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return bot.sendMessage(chatId, `🔐 𝗬𝗼𝘂𝗿 𝗦𝗲𝗰𝘂𝗿𝗲 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱:\n\`${pass}\`\n*(ট্যাপ করে কপি করুন)*`, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    // 5. Direct Command: Base64 Encode/Decode
    if (sub === 'b64enc') {
      if (!input) return bot.sendMessage(chatId, "⚠️ টেক্সট দিন এনকোড করার জন্য!", { reply_to_message_id: messageId });
      const encoded = Buffer.from(input, 'utf-8').toString('base64');
      return bot.sendMessage(chatId, `🔒 𝗘𝗻𝗰𝗼𝗱𝗲𝗱:\n\`${encoded}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    if (sub === 'b64dec') {
      if (!input) return bot.sendMessage(chatId, "⚠️ Base64 হ্যাশ দিন ডিকোড করার জন্য!", { reply_to_message_id: messageId });
      try {
        const decoded = Buffer.from(input, 'base64').toString('utf-8');
        return bot.sendMessage(chatId, `🔓 𝗗𝗲𝗰𝗼𝗱𝗲𝗱:\n\`${decoded}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, "❌ অবৈধ Base64 স্ট্রিং!", { reply_to_message_id: messageId });
      }
    }

    // Default: Interactive Dashboard with Buttons
    return bot.sendMessage(chatId, getMainDashboard(), {
      parse_mode: "Markdown",
      reply_to_message_id: messageId,
      reply_markup: getKeyboard('main')
    });
  },

  // 🖲️ INLINE BUTTON INTERACTION HANDLER
  onCallbackQuery: async function (bot, query) {
    if (!query.data || !query.data.startsWith('omni_')) return;

    const action = query.data.replace('omni_', '');
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;

    await bot.answerCallbackQuery(query.id).catch(() => {});

    if (action === 'close') {
      return bot.deleteMessage(chatId, msgId).catch(() => {});
    }

    if (action === 'main') {
      return bot.editMessageText(getMainDashboard(), {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('main')
      }).catch(() => {});
    }

    if (action === 'sys') {
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      const usedMem = totalMem - freeMem;
      const memUsagePct = ((usedMem / totalMem) * 100).toFixed(1);
      const cpus = os.cpus();
      const cpuModel = cpus && cpus.length > 0 ? cpus[0].model.trim() : "Virtual Core";

      const sysText = 
`╭━❮ 💻 𝐒𝐘𝐒𝐓𝐄𝐌 𝐃𝐈𝐀𝐆𝐍𝐎𝐒𝐓𝐈𝐂𝐒 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🖥 𝗢𝗦: ${os.type()} (${os.arch()})
├‣ 🧠 𝗖𝗣𝗨: ${cpuModel}
├‣ ⚙️ 𝗖𝗼𝗿𝗲𝘀: ${cpus.length} Core(s)
├‣ 📊 𝗥𝗔𝗠 𝗨𝘀𝗮𝗴𝗲: ${formatBytes(usedMem)} / ${formatBytes(totalMem)} (${memUsagePct}%)
├‣ ⏳ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗨𝗽𝘁𝗶𝗺𝗲: ${formatUptime(os.uptime())}
├‣ 🤖 𝗡𝗼𝗱𝗲 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${process.version}
├‣ ⚡ 𝗣𝗜𝗗: ${process.pid}
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
╰━═━═━═━═━═━═━═━═╯`;

      return bot.editMessageText(sysText, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('sys')
      }).catch(() => {});
    }

    if (action === 'utils') {
      const utilText = 
`╭━❮ 🛠 𝐔𝐓𝐈𝐋𝐈𝐓𝐈𝐄𝐒 𝐆𝐔𝐈𝐃𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ ১. 𝗤𝗥 𝗖𝗼𝗱𝗲:
├   \` /omni qr <link/text> \`
├
├‣ ২. 𝗜𝗣 𝗧𝗿𝗮𝗰𝗸𝗲𝗿:
├   \` /omni ip <ip/domain> \`
├
├‣ ৩. 𝗦𝘁𝘆𝗹𝗶𝘀𝗵 𝗙𝗼𝗻𝘁:
├   \` /omni font <text> \`
├
├‣ ৪. 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱 𝗚𝗲𝗻:
├   \` /omni pass <length> \`
├
├‣ ৫. 𝗕𝗮𝘀𝗲𝟲𝟰 𝗘𝗻𝗰𝗼𝗱𝗲/𝗗𝗲𝗰𝗼𝗱𝗲:
├   \` /omni b64enc <text> \`
├   \` /omni b64dec <hash> \`
╰━═━═━═━═━═━═━═━═╯`;

      return bot.editMessageText(utilText, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('utils')
      }).catch(() => {});
    }

    if (action === 'luck') {
      const coin = Math.random() < 0.5 ? "🪙 হেড (Heads)" : "🪙 টেইল (Tails)";
      const luckyNum = Math.floor(Math.random() * 100) + 1;
      const luckText = 
`╭━❮ 🎲 𝐋𝐔𝐂𝐊 & 𝐆𝐀𝐌𝐄𝐒 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🪙 𝗖𝗼𝗶𝗻 𝗙𝗹𝗶𝗽: ${coin}
├‣ 🍀 𝗟𝘂𝗰𝗸𝘆 𝗡𝘂𝗺𝗯𝗲𝗿: ${luckyNum}%
├‣ 🎲 𝗗𝗶𝗰𝗲 𝗥𝗼𝗹𝗹: ${Math.floor(Math.random() * 6) + 1}
╰━═━═━═━═━═━═━═━═╯`;

      return bot.editMessageText(luckText, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('luck')
      }).catch(() => {});
    }

    if (action === 'owner') {
      const ownerText = 
`╭━❮ 👑 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝗡𝗮𝗺𝗲: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
├‣ 🛡 𝐁𝐨𝐭: 𝐒𝐍𝐂-𝐁𝐎𝐓 𝐄𝐱𝐭𝐫𝐞𝐦𝐞
├‣ 💬 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: @ri_siyam
├‣ 🇧🇩 𝗢𝗿𝗶𝗴𝗶𝗻: Bangladesh
╰━═━═━═━═━═━═━═━═╯`;

      return bot.editMessageText(ownerText, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('owner')
      }).catch(() => {});
    }
  }
};
