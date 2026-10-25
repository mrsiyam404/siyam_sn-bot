const os = require('os');
const crypto = require('crypto');
const dns = require('dns').promises;
const axios = require('axios');

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

// Helper: Escape backticks inside Markdown code spans so Telegram never crashes
function safeCode(text) {
  return String(text ?? '').replace(/`/g, "'");
}

// Helper: Format Bytes to KB/MB/GB/TB
function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
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

// Helper: Get Real Local Server IPv4
function getLocalServerIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return `${net.address} (${name})`;
      }
    }
  }
  return '127.0.0.1 (Loopback)';
}

// Helper: Fancy Unicode Font Converter (6 Styles)
function toFancyFont(text) {
  const convertRange = (str, upperBase, lowerBase, digitBase = null) =>
    Array.from(str).map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(upperBase + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(lowerBase + code - 97);
      if (digitBase && code >= 48 && code <= 57) return String.fromCodePoint(digitBase + code - 48);
      return c;
    }).join('');

  return {
    bold: convertRange(text, 0x1d5d4, 0x1d5ee, 0x1d7ec),
    italic: convertRange(text, 0x1d608, 0x1d622),
    boldItalic: convertRange(text, 0x1d63c, 0x1d656),
    mono: convertRange(text, 0x1d670, 0x1d68a, 0x1d7f6),
    script: convertRange(text, 0x1d4d0, 0x1d4ea),
    fraktur: convertRange(text, 0x1d56c, 0x1d586)
  };
}

// Helper: Main Dashboard Text
function getMainDashboard() {
  return `╭━❮ 👑 𝐒𝐍𝐂 𝐎𝐌𝐍𝐈-𝐒𝐔𝐈𝐓𝐄 𝐯𝟑.𝟎 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 👤 𝐎𝐰𝐧𝐞𝐫: ${AUTHOR_LOCK}
├‣ ⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 3.0.0 Real Extreme
├‣ 🌐 𝐒𝐭𝐚𝐭𝐮𝐬: 100% Real APIs Active
├═━═━═━═━═━═━═━═━═
├‣ নিচের বাটন চাপুন অথবা কমান্ড দিন:
├‣ 📌 \`/omni qr <text/url>\`
├‣ 📌 \`/omni ip <ip/domain>\`
├‣ 📌 \`/omni ping <domain/url>\`
├‣ 📌 \`/omni weather <city>\`
├‣ 📌 \`/omni rate\` (Live USD/BDT & Crypto)
├‣ 📌 \`/omni github <username>\`
├‣ 📌 \`/omni short <url>\`
├‣ 📌 \`/omni font <text>\`
├‣ 📌 \`/omni pass <length>\`
├‣ 📌 \`/omni hash <text>\`
├‣ 📌 \`/omni b64enc <text>\` | \`/omni b64dec <hash>\`
╰━═━═━═━═━═━═━═━═╯`;
}

// Inline Keyboard Generator
function getKeyboard(activeTab = 'main') {
  if (activeTab === 'main') {
    return {
      inline_keyboard: [
        [
          { text: "💻 সিস্টেম হেলথ (Real)", callback_data: "omni_sys" },
          { text: "🌐 সার্ভার Public IP", callback_data: "omni_myip" }
        ],
        [
          { text: "💱 লাইভ ডলার ও ক্রিপ্টো রেট", callback_data: "omni_rate" },
          { text: "⛅ ঢাকা লাইভ আবহাওয়া", callback_data: "omni_dhaka_weather" }
        ],
        [
          { text: "🛠 ইউটিলিটি গাইড", callback_data: "omni_utils" },
          { text: "👑 ওনার প্রোফাইল", callback_data: "omni_owner" }
        ],
        [
          { text: "❌ মেনু বন্ধ করুন", callback_data: "omni_close" }
        ]
      ]
    };
  }
  return {
    inline_keyboard: [
      [{ text: "🔄 রিফ্রেশ (Refresh)", callback_data: `omni_${activeTab}` }],
      [{ text: "🔙 প্রধান মেনু (Back)", callback_data: "omni_main" }],
      [{ text: "❌ বন্ধ করুন", callback_data: "omni_close" }]
    ]
  };
}

// Helper: Real System Diagnostics Report
function buildSystemReport() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const memUsagePct = ((usedMem / totalMem) * 100).toFixed(1);
  const cpus = os.cpus() || [];
  const cpuModel = cpus.length > 0 ? cpus[0].model.trim() : "Server CPU";
  const cpuSpeed = cpus.length > 0 ? `${cpus[0].speed} MHz` : "N/A";
  const load = os.loadavg().map(n => n.toFixed(2)).join(' / ');
  const heapUsed = formatBytes(process.memoryUsage().heapUsed);

  return `╭━❮ 💻 𝐑𝐄𝐀𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐇𝐄𝐀𝐋𝐓𝐇 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🖥 𝗢𝗦: ${os.type()} ${os.release()} (${os.arch()})
├‣ 🏠 𝗛𝗼𝘀𝘁: \`${safeCode(os.hostname())}\`
├‣ 🌐 𝗟𝗔𝗡 𝗜𝗣: \`${safeCode(getLocalServerIp())}\`
├‣ 🧠 𝗖𝗣𝗨: ${safeCode(cpuModel)}
├‣ ⚙️ 𝗖𝗼𝗿𝗲𝘀: ${cpus.length} Core(s) @ ${cpuSpeed}
├‣ 📈 𝗟𝗼𝗮𝗱 𝗔𝘃𝗴: ${load}
├‣ 📊 𝗥𝗔𝗠: ${formatBytes(usedMem)} / ${formatBytes(totalMem)} (${memUsagePct}%)
├‣ 🔋 𝗡𝗼𝗱𝗲 𝗛𝗲𝗮𝗽: ${heapUsed}
├‣ ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${formatUptime(os.uptime())}
├‣ 🤖 𝗡𝗼𝗱𝗲.𝗷𝘀: ${process.version} (PID: ${process.pid})
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: ${AUTHOR_LOCK}
╰━═━═━═━═━═━═━═━═╯`;
}

// Helper: Real Live Currency & Crypto Report
async function buildLiveRateReport() {
  const [fxRes, cryptoRes] = await Promise.all([
    axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 10000 }),
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd', { timeout: 10000 }).catch(() => ({ data: {} }))
  ]);
  const rates = fxRes.data.rates || {};
  const bdt = rates.BDT || 120;
  const eurBdt = rates.EUR ? (bdt / rates.EUR).toFixed(2) : 'N/A';
  const gbpBdt = rates.GBP ? (bdt / rates.GBP).toFixed(2) : 'N/A';
  const sarBdt = rates.SAR ? (bdt / rates.SAR).toFixed(2) : 'N/A';
  const inrBdt = rates.INR ? (bdt / rates.INR).toFixed(2) : 'N/A';
  const c = cryptoRes.data || {};

  return `╭━❮ 💱 𝐋𝐈𝐕𝐄 𝐌𝐀𝐑𝐊𝐄𝐒 𝐑𝐀𝐓𝐄𝐒 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🇺🇸 𝟭 𝗨𝗦𝗗: \`${bdt.toFixed(2)} BDT\`
├‣ 🇪🇺 𝟭 𝗘𝗨𝗥: \`${eurBdt} BDT\`
├‣ 🇬🇧 𝟭 𝗚𝗕𝗣: \`${gbpBdt} BDT\`
├‣ 🇸🇦 𝟭 𝗦𝗔𝗥: \`${sarBdt} BDT\`
├‣ 🇮🇳 𝟭 𝗜𝗡𝗥: \`${inrBdt} BDT\`
├═━═━═━═━═━═━═━═━═
├‣ ₿ 𝗕𝗶𝘁𝗰𝗼𝗶𝗻 (𝗕𝗧𝗖): \`$${c.bitcoin?.usd?.toLocaleString() || 'N/A'}\`
├‣ Ξ 𝗘𝘁𝗵𝗲𝗿𝗲𝘂𝗺 (𝗘𝗧𝗛): \`$${c.ethereum?.usd?.toLocaleString() || 'N/A'}\`
├‣ ◎ 𝗦𝗼𝗹𝗮𝗻𝗮 (𝗦𝗢𝗟): \`$${c.solana?.usd?.toLocaleString() || 'N/A'}\`
├‣ 🔶 𝗕𝗡𝗕: \`$${c.binancecoin?.usd?.toLocaleString() || 'N/A'}\`
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲: ${AUTHOR_LOCK}
╰━═━═━═━═━═━═━═━═╯`;
}

// Helper: Real Weather Report via Open-Meteo
async function buildWeatherReport(cityQuery = 'Dhaka') {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&language=en&format=json`;
  const geoRes = await axios.get(geoUrl, { timeout: 10000 });
  if (!geoRes.data.results || geoRes.data.results.length === 0) {
    throw new Error(`City not found: ${cityQuery}`);
  }
  const loc = geoRes.data.results[0];
  const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;
  const wRes = await axios.get(wUrl, { timeout: 10000 });
  const cur = wRes.data.current;

  return `╭━❮ ⛅ 𝐋𝐈𝐕𝐄 𝐖𝐄𝐀𝐓𝐇𝐄𝐑 𝐑𝐄𝐏𝐎𝐑𝐓 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 📍 Location: ${loc.name}, ${loc.country || ''}
├‣ 🌡 Temp: \`${cur.temperature_2m}°C\` (Feels: \`${cur.apparent_temperature}°C\`)
├‣ 💧 Humidity: \`${cur.relative_humidity_2m}%\`
├‣ 🌬 Wind: \`${cur.wind_speed_10m} km/h\`
├‣ 🧭 Coords: \`${loc.latitude}, ${loc.longitude}\`
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲: ${AUTHOR_LOCK}
╰━═━═━═━═━═━═━═━═╯`;
}

module.exports = {
  config: {
    name: "omni",
    aliases: ["tools", "box", "master", "hub"],
    version: "3.0.0",
    role: 0,
    author: AUTHOR_LOCK,
    shortDescription: "Ultra All-In-One 100% Real Power Suite 🚀",
    longDescription: "Complete Real Swiss-Army-Knife with Live Diagnostics, IP Intelligence, HTTP Ping, Live Weather, FX/Crypto Rates, GitHub Lookup, QR, Shortener & Crypto Tools.",
    category: "power-tools",
    guide: "/omni or /omni <subcommand>"
  },

  onStart: async function ({ bot, msg, args }) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const sub = args[0] ? args[0].toLowerCase() : null;
    const input = args.slice(1).join(" ").trim();

    if (sub === 'qr') {
      if (!input) return bot.sendMessage(chatId, "⚠️ দয়া করে কিছু লিখুন! যেমন: `/omni qr https://google.com`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=15&data=${encodeURIComponent(input)}`;
      return bot.sendPhoto(chatId, qrUrl, {
        caption: `✨ 𝗬𝗼𝘂𝗿 𝗤𝗥 𝗖𝗼𝗱𝗲 𝗶𝘀 𝗥𝗲𝗮𝗱𝘆!\n📝 𝗗𝗮𝘁𝗮: \`${safeCode(input)}\`\n👑 ${AUTHOR_LOCK}`,
        parse_mode: "Markdown",
        reply_to_message_id: messageId
      });
    }

    if (sub === 'ip') {
      if (!input) return bot.sendMessage(chatId, "⚠️ আইপি অথবা ডোমেন লিখুন! যেমন: `/omni ip 8.8.8.8`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      bot.sendChatAction(chatId, "typing").catch(() => {});
      try {
        const cleanHost = input.replace(/^https?:\/\//, '').split('/')[0];
        const fields = "status,message,continent,country,countryCode,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,reverse,mobile,proxy,hosting,query";
        const { data } = await axios.get(`http://ip-api.com/json/${encodeURIComponent(cleanHost)}?fields=${fields}`, { timeout: 10000 });
        if (data.status !== 'success') throw new Error(data.message || 'Lookup failed');
        const report = `╭━❮ 🌐 𝐈𝐏 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🎯 𝗧𝗮𝗿𝗴𝗲𝘁: \`${safeCode(data.query)}\`
├‣ 🌍 𝗖𝗼𝘂𝗻𝘁𝗿𝘆: ${data.country} (${data.countryCode})
├‣ 🏙 𝗖𝗶𝘁𝘆: ${data.city}, ${data.regionName}
├‣ 📮 𝗭𝗶𝗽: ${data.zip || 'N/A'} | 💱 𝗖𝘂𝗿𝗿𝗲𝗻𝗰𝘆: ${data.currency || 'N/A'}
├‣ 🏢 𝗜𝗦𝗣: ${safeCode(data.isp)}
├‣ 📡 𝗢𝗿𝗴 / 𝗔𝗦𝗡: ${safeCode(data.as || data.org || 'N/A')}
├‣ 🔄 𝗥𝗲𝘃𝗲𝗿𝘀𝗲 𝗗𝗡𝗦: \`${safeCode(data.reverse || 'N/A')}\`
├‣ 🛡 𝗣𝗿𝗼𝘅𝘆/𝗩𝗣𝗡: ${data.proxy ? 'Yes ⚠️' : 'Clean ✅'} | ☁️ 𝗛𝗼𝘀𝘁𝗶𝗻𝗴: ${data.hosting ? 'Yes' : 'No'}
├‣ 🌐 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${data.timezone}
├‣ 📍 𝗖𝗼𝗼𝗿𝗱𝘀: \`${data.lat}, ${data.lon}\`
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲: ${AUTHOR_LOCK}
╰━═━═━═━═━═━═━═━═╯`;
        return bot.sendMessage(chatId, report, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ আইপি ইনফরমেশন খুঁজে পাওয়া যায়নি: ${e.message}`, { reply_to_message_id: messageId });
      }
    }

    if (sub === 'ping') {
      if (!input) return bot.sendMessage(chatId, "⚠️ ওয়েবসাইট বা ডোমেন দিন! যেমন: `/omni ping google.com`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      bot.sendChatAction(chatId, "typing").catch(() => {});
      try {
        const targetUrl = /^https?:\/\//i.test(input) ? input : `https://${input}`;
        const host = new URL(targetUrl).hostname;
        const start = Date.now();
        const [lookup, response] = await Promise.all([
          dns.lookup(host).catch(() => ({ address: 'N/A' })),
          axios.get(targetUrl, { timeout: 10000, validateStatus: () => true })
        ]);
        const latency = Date.now() - start;
        const pingReport = `╭━❮ 📡 𝐑𝐄𝐀𝐋 𝐇𝐓𝐓𝐏 & 𝐃𝐍𝐒 𝐏𝐈𝐍𝐆 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 🌐 𝗛𝗼𝘀𝘁: \`${safeCode(host)}\`
├‣ 🔢 Resolved IP: \`${lookup.address}\`
├‣ ⚡ 𝗟𝗮𝘁𝗲𝗻𝗰𝘆: \`${latency} ms\`
├‣ 📶 𝗛𝗧𝗧𝗣 𝗦𝘁𝗮𝘁𝘂𝘀: \`${response.status} ${response.statusText || ''}\`
├‣ 🖥 𝗦𝗲𝗿𝘃𝗲𝗿: \`${safeCode(response.headers['server'] || 'Protected')}\`
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲: ${AUTHOR_LOCK}
╰━═━═━═━═━═━═━═━═╯`;
        return bot.sendMessage(chatId, pingReport, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ পিং ব্যর্থ হয়েছে: ${e.message}`, { reply_to_message_id: messageId });
      }
    }

    if (sub === 'weather') {
      const city = input || 'Dhaka';
      bot.sendChatAction(chatId, "typing").catch(() => {});
      try {
        const report = await buildWeatherReport(city);
        return bot.sendMessage(chatId, report, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ আবহাওয়ার তথ্য পাওয়া যায়নি: ${e.message}`, { reply_to_message_id: messageId });
      }
    }

    if (sub === 'rate' || sub === 'crypto') {
      bot.sendChatAction(chatId, "typing").catch(() => {});
      try {
        const report = await buildLiveRateReport();
        return bot.sendMessage(chatId, report, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ লাইভ রেট লোড করা যায়নি: ${e.message}`, { reply_to_message_id: messageId });
      }
    }

    if (sub === 'github' || sub === 'gh') {
      if (!input) return bot.sendMessage(chatId, "⚠️ GitHub ইউজারনেম দিন! যেমন: `/omni github torvalds`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      try {
        const { data } = await axios.get(`https://api.github.com/users/${encodeURIComponent(input)}`, { timeout: 10000 });
        const ghText = `╭━❮ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 👤 𝗡𝗮𝗺𝗲: ${safeCode(data.name || data.login)}
├‣ 🏷 𝗨𝘀𝗲𝗿: \`@${safeCode(data.login)}\`
├‣ 📦 𝗥𝗲𝗽𝗼𝘀: \`${data.public_repos}\` | 👥 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: \`${data.followers}\`
├‣ 📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${safeCode(data.location || 'N/A')}
├‣ 📝 𝗕𝗶𝗼: ${safeCode(data.bio || 'No bio')}
├‣ 🔗 𝗟𝗶𝗻𝗸: ${data.html_url}
╰━═━═━═━═━═━═━═━═╯`;
        return bot.sendMessage(chatId, ghText, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ GitHub প্রোফাইল পাওয়া যায়নি!`, { reply_to_message_id: messageId });
      }
    }

    if (sub === 'short') {
      if (!input) return bot.sendMessage(chatId, "⚠️ লিংক দিন! যেমন: `/omni short https://example.com`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      try {
        const target = /^https?:\/\//i.test(input) ? input : `https://${input}`;
        const { data } = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(target)}`, { timeout: 10000 });
        return bot.sendMessage(chatId, `🔗 𝗦𝗵𝗼𝗿𝘁𝗲𝗻𝗲𝗱 𝗨𝗥𝗟:\n\`${safeCode(data)}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
      } catch (e) {
        return bot.sendMessage(chatId, `❌ লিংক শর্ট করা যায়নি: ${e.message}`, { reply_to_message_id: messageId });
      }
    }

    if (sub === 'font') {
      if (!input) return bot.sendMessage(chatId, "⚠️ ফন্ট পরিবর্তন করার জন্য টেক্সট দিন! যেমন: `/omni font Hello World`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      const f = toFancyFont(input);
      const fontText = `╭━❮ ✨ 𝐅𝐀𝐍𝐂𝐘 𝐅𝐎𝐍𝐓𝐒 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 𝟏. 𝗕𝗼𝗹𝗱: \`${safeCode(f.bold)}\`
├‣ 𝟐. 𝗜𝘁𝗮𝗹𝗶𝗰: \`${safeCode(f.italic)}\`
├‣ 𝟑. 𝗕𝗼𝗹𝗱 𝗜𝘁𝗮𝗹𝗶𝗰: \`${safeCode(f.boldItalic)}\`
├‣ 𝟒. 𝗠𝗼𝗻𝗼: \`${safeCode(f.mono)}\`
├‣ 𝟓. 𝗦𝗰𝗿𝗶𝗽𝘁: \`${safeCode(f.script)}\`
├‣ 𝟔. 𝗙𝗿𝗮𝗸𝘁𝘂𝗿: \`${safeCode(f.fraktur)}\`
╰━═━═━═━═━═━═━═━═╯`;
      return bot.sendMessage(chatId, fontText, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    if (sub === 'pass') {
      const len = parseInt(input, 10) || 16;
      if (len < 6 || len > 64) return bot.sendMessage(chatId, "⚠️ পাসওয়ার্ডের দৈর্ঘ্য ৬ থেকে ৬৪ এর মধ্যে দিন!", { reply_to_message_id: messageId });
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
      let pass = "";
      for (let i = 0; i < len; i++) {
        pass += chars.charAt(crypto.randomInt(0, chars.length));
      }
      return bot.sendMessage(chatId, `🔐 𝗬𝗼𝘂𝗿 𝗖𝗿𝘆𝗽𝘁𝗼-𝗦𝗲𝗰𝘂𝗿𝗲 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱 (${len} chars):\n\`${safeCode(pass)}\`\n*(ট্যাপ করে কপি করুন)*`, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    if (sub === 'hash') {
      if (!input) return bot.sendMessage(chatId, "⚠️ হ্যাশ করার জন্য টেক্সট দিন! যেমন: `/omni hash secret123`", { parse_mode: "Markdown", reply_to_message_id: messageId });
      const md5 = crypto.createHash('md5').update(input).digest('hex');
      const sha256 = crypto.createHash('sha256').update(input).digest('hex');
      return bot.sendMessage(chatId, `🛡 𝗖𝗿𝘆𝗽𝘁𝗼 𝗛𝗮𝘀𝗵𝗲𝘀:\n• 𝗠𝗗𝟱: \`${md5}\`\n• 𝗦𝗛𝗔-𝟮𝟱𝟲: \`${sha256}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    if (sub === 'b64enc') {
      if (!input) return bot.sendMessage(chatId, "⚠️ টেক্সট দিন এনকোড করার জন্য!", { reply_to_message_id: messageId });
      const encoded = Buffer.from(input, 'utf-8').toString('base64');
      return bot.sendMessage(chatId, `🔒 𝗘𝗻𝗰𝗼𝗱𝗲𝗱:\n\`${safeCode(encoded)}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }
    if (sub === 'b64dec') {
      if (!input) return bot.sendMessage(chatId, "⚠️ Base64 হ্যাশ দিন ডিকোড করার জন্য!", { reply_to_message_id: messageId });
      const decoded = Buffer.from(input, 'base64').toString('utf-8');
      return bot.sendMessage(chatId, `🔓 𝗗𝗲𝗰𝗼𝗱𝗲𝗱:\n\`${safeCode(decoded)}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
    }

    return bot.sendMessage(chatId, getMainDashboard(), {
      parse_mode: "Markdown",
      reply_to_message_id: messageId,
      reply_markup: getKeyboard('main')
    });
  },

  onCallbackQuery: async function (bot, query) {
    if (!query.data || !query.data.startsWith('omni_')) return;
    const action = query.data.replace('omni_', '');
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;

    await bot.answerCallbackQuery(query.id).catch(() => {});

    if (action === 'close') return bot.deleteMessage(chatId, msgId).catch(() => {});

    if (action === 'main') {
      return bot.editMessageText(getMainDashboard(), {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('main')
      }).catch(() => {});
    }

    if (action === 'sys') {
      return bot.editMessageText(buildSystemReport(), {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('sys')
      }).catch(() => {});
    }

    if (action === 'myip') {
      try {
        const { data } = await axios.get('http://ip-api.com/json/?fields=status,country,city,isp,org,query,timezone', { timeout: 10000 });
        const txt = `╭━❮ 🌐 𝐒𝐄𝐑𝐕𝐄𝐑 𝐏𝐔𝐁𝐋𝐈𝐂 𝐈𝐏 ❯━╮\n├‣ 🎯 𝗜𝗣: \`${data.query}\`\n├‣ 🌍 Location: ${data.city}, ${data.country}\n├‣ 🏢 𝗜𝗦𝗣: ${safeCode(data.isp)}\n├‣ 🕒 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${data.timezone}\n╰━═━═━═━═━═━═━═━═╯`;
        return bot.editMessageText(txt, {
          chat_id: chatId,
          message_id: msgId,
          parse_mode: "Markdown",
          reply_markup: getKeyboard('myip')
        }).catch(() => {});
      } catch (e) {
        return;
      }
    }

    if (action === 'rate') {
      try {
        const txt = await buildLiveRateReport();
        return bot.editMessageText(txt, {
          chat_id: chatId,
          message_id: msgId,
          parse_mode: "Markdown",
          reply_markup: getKeyboard('rate')
        }).catch(() => {});
      } catch (e) {
        return;
      }
    }

    if (action === 'dhaka_weather') {
      try {
        const txt = await buildWeatherReport('Dhaka');
        return bot.editMessageText(txt, {
          chat_id: chatId,
          message_id: msgId,
          parse_mode: "Markdown",
          reply_markup: getKeyboard('dhaka_weather')
        }).catch(() => {});
      } catch (e) {
        return;
      }
    }

    if (action === 'utils') {
      const utilText = `╭━❮ 🛠 𝐔𝐓𝐈𝐋𝐈𝐓𝐈𝐄𝐒 𝐆𝐔𝐈𝐃𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ ১. \`/omni qr <text>\` — QR Code
├‣ ২. \`/omni ip <ip/domain>\` — IP Tracker
├‣ ৩. \`/omni ping <domain>\` — Real HTTP Ping
├‣ ৪. \`/omni weather <city>\` — Live Weather
├‣ ৫. \`/omni rate\` — Live USD/BDT & Crypto
├‣ ৬. \`/omni github <user>\` — GitHub Lookup
├‣ ৭. \`/omni short <url>\` — URL Shortener
├‣ ৮. \`/omni font <text>\` — 6 Fancy Fonts
├‣ ৯. \`/omni pass <length>\` — Crypto Password
├‣ ১০. \`/omni hash <text>\` — MD5 & SHA-256
╰━═━═━═━═━═━═━═━═╯`;
      return bot.editMessageText(utilText, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: getKeyboard('utils')
      }).catch(() => {});
    }

    if (action === 'owner') {
      const ownerText = `╭━❮ 👑 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 ❯━╮
├═━═━═━═━═━═━═━═━═
├‣ 👑 𝗡𝗮𝗺𝗲: ${AUTHOR_LOCK}
├‣ 🛡 𝐁𝐨𝐭: 𝐒𝐍𝐂-𝐁𝐎𝐓 𝐄𝐱𝐭𝐫𝐞𝐦𝐞 𝐯𝟑.𝟎
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
