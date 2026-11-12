
"use strict";

/*
 * SIYAM HASAN - TELEGRAM BOT STARTUP DASHBOARD
 * Location: startup/siyamDashboard.js
 * Platform: Telegram Bot / Node.js
 * Output: Terminal only
 */

const os = require("os");
const config = require("../config");

// ═══════════════════════════════════════════════
// 👑 EDITABLE DEVELOPER INFORMATION
// ═══════════════════════════════════════════════

const DESIGN = {
    owner: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    developer: "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍",
    nickname: "SIYAM",

    country: "BANGLADESH",
    city: "DHAKA",
    timezone: "ASIA/DHAKA",
    language: "BANGLA / ENGLISH",

    profession: "BOT DEVELOPER",
    developerType: "FRONTEND & BOT DEVELOPER",
    specialization: "TELEGRAM BOT DEVELOPMENT",
    skills: "JAVASCRIPT / NODE.JS",

    project: "SIYAM SN BOT",
    framework: "TELEGRAM BOT API",
    library: "NODE-TELEGRAM-BOT-API",
    database: "SQLITE",

    github: "https://github.com/mrsiyam404/siyam_sn-bot",
    whatsapp: "https://wa.me/8801789138157",
    phone: "+8801789138157",

    welcome: "আশা করি আমার বটটি ব্যবহার করে অনেক মজা পাবেন।",
    prayer: "সবাই আমার জন্য দোয়া করবেন।",
    thanks: "আপনাদের ভালোবাসা ও সাপোর্টের জন্য ধন্যবাদ।"
};

// ═══════════════════════════════════════════════
// 🎨 TERMINAL COLORS
// ═══════════════════════════════════════════════

const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",

    brightRed: "\x1b[91m",
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[95m",
    brightCyan: "\x1b[96m"
};

// ═══════════════════════════════════════════════
// 🖥️ TERMINAL OUTPUT
// ═══════════════════════════════════════════════

function print(message = "", color = C.white) {
    console.log(color + String(message) + C.reset);
}

function section(title, color = C.cyan) {
    print("");
    print("  ╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮", color);
    print("  │  " + title, color);
    print("  ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯", color);
}

function item(label, value, color = C.white) {
    print(
        "  │  " + C.gray + label.padEnd(17) +
        C.reset + color + String(value),
        color
    );
}

// ═══════════════════════════════════════════════
// ⚙️ LIVE SYSTEM INFORMATION
// ═══════════════════════════════════════════════

function getSystemInfo() {
    const memory = process.memoryUsage();
    const cpus = os.cpus() || [];

    const uptime = process.uptime();

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();
    const usedRAM = totalRAM - freeRAM;

    return {
        node: process.version,
        platform: os.platform(),
        architecture: os.arch(),
        hostname: os.hostname(),
        pid: process.pid,

        uptime:
            `${days}D ${hours}H ${minutes}M ${seconds}S`,

        processRAM:
            (memory.rss / 1024 / 1024).toFixed(2) + " MB",

        heapRAM:
            (memory.heapUsed / 1024 / 1024).toFixed(2) + " MB",

        totalRAM:
            (totalRAM / 1024 / 1024 / 1024).toFixed(2) + " GB",

        usedRAM:
            (usedRAM / 1024 / 1024 / 1024).toFixed(2) + " GB",

        ramPercent:
            ((usedRAM / totalRAM) * 100).toFixed(1) + "%",

        cpuCores: cpus.length,

        cpuModel: cpus[0]
            ? cpus[0].model
            : "Unknown",

        loadAverage: os.loadavg()
            .map(n => n.toFixed(2))
            .join(" / "),

        date: new Date().toLocaleString("en-GB", {
            timeZone: "Asia/Dhaka"
        })
    };
}

// ═══════════════════════════════════════════════
// ✈️ TELEGRAM BOT INFORMATION
// ═══════════════════════════════════════════════

function getBotInfo(bot) {
    const username =
        config.botUsername ||
        "Not configured";

    const owner =
        config.ownerUsername ||
        "ri_siyam";

    return {
        username: username.startsWith("@")
            ? username
            : "@" + username,

        owner: owner.startsWith("@")
            ? owner
            : "@" + owner,

        prefix: config.prefix || "/",

        ownerID: config.ownerID || "Not configured",

        adminCount: Array.isArray(config.adminIDs)
            ? config.adminIDs.length
            : 0,

        moderatorCount: Array.isArray(config.modIDs)
            ? config.modIDs.length
            : 0,

        whitelist: config.whitelistMode &&
            config.whitelistMode.enable
                ? "ENABLED"
                : "DISABLED",

        polling: bot && bot.isPolling
            ? "POLLING ENABLED"
            : "BOT INSTANCE CREATED"
    };
}

// ═══════════════════════════════════════════════
// 👑 MAIN DASHBOARD
// ═══════════════════════════════════════════════

function showDashboard(bot) {
    const sys = getSystemInfo();
    const info = getBotInfo(bot);

    console.clear();

    print("");
    print("  ███████╗██╗██╗   ██╗ █████╗ ███╗   ███╗", C.brightMagenta);
    print("  ██╔════╝██║╚██╗ ██╔╝██╔══██╗████╗ ████║", C.brightCyan);
    print("  ███████╗██║ ╚████╔╝ ███████║██╔████╔██║", C.brightYellow);
    print("  ╚════██║██║  ╚██╔╝  ██╔══██║██║╚██╔╝██║", C.brightGreen);
    print("  ███████║██║   ██║   ██║  ██║██║ ╚═╝ ██║", C.brightBlue);
    print("  ╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝", C.brightMagenta);

    print("");
    print("       👑 SIYAM HASAN OFFICIAL DASHBOARD", C.brightYellow);
    print("       TELEGRAM BOT STARTUP INFORMATION", C.brightCyan);

    print("");
    print("  ══════════════════════════════════════════════", C.brightMagenta);

    // PERSONAL PROFILE
    section("👑 PERSONAL & DEVELOPER PROFILE", C.brightYellow);

    item("OWNER", DESIGN.owner, C.brightGreen);
    item("DEVELOPER", DESIGN.developer, C.brightCyan);
    item("NICKNAME", DESIGN.nickname, C.brightMagenta);
    item("PROFESSION", DESIGN.profession, C.brightYellow);
    item("DEVELOPER TYPE", DESIGN.developerType, C.brightBlue);
    item("SPECIALIZATION", DESIGN.specialization, C.brightGreen);
    item("SKILLS", DESIGN.skills, C.brightCyan);
    item("COUNTRY", DESIGN.country, C.brightYellow);
    item("CITY", DESIGN.city, C.brightMagenta);
    item("LANGUAGE", DESIGN.language, C.brightBlue);

    // TELEGRAM PROFILE
    section("✈️ TELEGRAM INFORMATION", C.brightCyan);

    item("PLATFORM", "TELEGRAM", C.brightBlue);
    item("BOT USERNAME", info.username, C.brightGreen);
    item("BOT LINK", "https://t.me/" + info.username.replace("@", ""), C.brightCyan);
    item("OWNER USERNAME", info.owner, C.brightYellow);
    item("OWNER PROFILE", "https://t.me/" + info.owner.replace("@", ""), C.brightMagenta);
    item("BOT FRAMEWORK", DESIGN.framework, C.brightGreen);
    item("BOT LIBRARY", DESIGN.library, C.brightBlue);
    item("COMMAND PREFIX", info.prefix, C.brightYellow);
    item("OWNER ID", info.ownerID, C.brightCyan);
    item("ADMIN ACCOUNTS", info.adminCount, C.brightMagenta);
    item("MODERATOR ACCOUNTS", info.moderatorCount, C.brightGreen);
    item("WHITELIST MODE", info.whitelist, C.brightYellow);

    // PROJECT INFORMATION
    section("🚀 PROJECT INFORMATION", C.brightMagenta);

    item("PROJECT", DESIGN.project, C.brightCyan);
    item("DATABASE", DESIGN.database, C.brightGreen);
    item("GITHUB", DESIGN.github, C.brightYellow);
    item("WHATSAPP", DESIGN.whatsapp, C.brightGreen);
    item("PHONE", DESIGN.phone, C.brightBlue);
    item("TIMEZONE", DESIGN.timezone, C.brightMagenta);

    // LIVE SYSTEM
    section("⚙️ LIVE SERVER INFORMATION", C.brightGreen);

    item("NODE.JS", sys.node, C.brightCyan);
    item("PLATFORM", sys.platform, C.brightYellow);
    item("ARCHITECTURE", sys.architecture, C.brightBlue);
    item("HOSTNAME", sys.hostname, C.brightMagenta);
    item("PROCESS ID", sys.pid, C.brightGreen);
    item("PROCESS RAM", sys.processRAM, C.brightYellow);
    item("HEAP RAM", sys.heapRAM, C.brightCyan);
    item("TOTAL RAM", sys.totalRAM, C.brightBlue);
    item("USED RAM", sys.usedRAM, C.brightGreen);
    item("RAM USAGE", sys.ramPercent, C.brightMagenta);
    item("CPU CORES", sys.cpuCores, C.brightYellow);
    item("CPU MODEL", sys.cpuModel, C.brightCyan);
    item("CPU LOAD", sys.loadAverage, C.brightBlue);
    item("BOT UPTIME", sys.uptime, C.brightGreen);
    item("BANGLADESH TIME", sys.date, C.brightYellow);

    // FINAL STATUS
    section("💖 SIYAM HASAN PERSONAL MESSAGE", C.brightRed);

    print("  │  💖 " + DESIGN.welcome, C.brightGreen);
    print("  │  🤲 " + DESIGN.prayer, C.brightYellow);
    print("  │  🌸 " + DESIGN.thanks, C.brightMagenta);

    print("");
    print("  ══════════════════════════════════════════════", C.brightCyan);
    print("       👑 POWERED BY " + DESIGN.developer, C.brightYellow);
    print("       🤖 TELEGRAM BOT SYSTEM INITIALIZED", C.brightGreen);
    print("  ══════════════════════════════════════════════", C.brightMagenta);
    print("");
}

// ═══════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════

module.exports = function initializeSiyamDashboard(bot) {
    try {
        showDashboard(bot);

        // Verify Telegram identity without exposing the bot token.
        if (bot && typeof bot.getMe === "function") {
            bot.getMe()
                .then(me => {
                    console.log(
                        C.brightGreen +
                        "\n  [TELEGRAM CONNECTED] @" +
                        me.username +
                        C.reset
                    );
                })
                .catch(error => {
                    console.error(
                        C.brightRed +
                        "\n  [TELEGRAM CONNECTION CHECK FAILED] " +
                        error.message +
                        C.reset
                    );
                });
        }

        return true;

    } catch (error) {
        console.error("[SIYAM DASHBOARD ERROR]", error);
        return false;
    }
};

module.exports.showDashboard = showDashboard;
module.exports.getSystemInfo = getSystemInfo;
module.exports.DESIGN = DESIGN;
module.exports.COLORS = C;
  
