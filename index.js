
"use strict";

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const config = require("./config");

global.activeReplies = new Map();
global.telegramPendingChats = [];

process.on("uncaughtException", err => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", reason => {
    console.error("Unhandled Rejection:", reason);
});

if (!config.botToken) {
    throw new Error("BOT_TOKEN is missing in config.js");
}

const bot = new TelegramBot(config.botToken, {
    polling: {
        interval: 300,
        autoStart: true,
        params: { timeout: 10 }
    }
});

bot.on("polling_error", error => {
    console.error("[Polling Error]:", error.message);
});

// ═══════════════════════════════════════════════
// 👑 SIYAM HASAN TERMINAL DASHBOARD
// Terminal only — no Telegram message
// ═══════════════════════════════════════════════

try {
    require("./startup/siyamDashboard")(bot);
} catch (error) {
    console.error("[DASHBOARD LOAD ERROR]:", error.stack || error.message);
}

const commands = new Map();
const aliases = new Map();

bot.commands = commands;
bot.aliases = aliases;

const commandsDir = path.join(__dirname, "commands");
const eventsDir = path.join(__dirname, "events");
const privateDir = path.join(__dirname, "private");

[commandsDir, eventsDir, privateDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

function registerCommand(command) {
    if (!command) return;

    const cmdName =
        command.name ||
        (command.config && command.config.name);

    const hasExecution =
        typeof command.execute === "function" ||
        typeof command.onStart === "function";

    if (!cmdName || !hasExecution) return;

    const lowerName = String(cmdName).toLowerCase();

    commands.set(lowerName, command);

    const aliasList =
        command.aliases ||
        (command.config && command.config.aliases);

    if (aliasList) {
        const list = Array.isArray(aliasList)
            ? aliasList
            : [aliasList];

        for (const alias of list) {
            if (alias) {
                aliases.set(
                    String(alias).toLowerCase(),
                    lowerName
                );
            }
        }
    }
}

function loadAllModules() {
    commands.clear();
    aliases.clear();

    const loadedCommands = [];

    function loadFromDirectory(dirPath, label) {
        if (!fs.existsSync(dirPath)) return;

        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            if (!file.endsWith(".js")) continue;

            const filePath = path.join(dirPath, file);

            try {
                delete require.cache[require.resolve(filePath)];

                const moduleExport = require(filePath);

                if (label === "events") {
                    if (typeof moduleExport === "function") {
                        const result = moduleExport(bot);

                        if (result && typeof result.catch === "function") {
                            result.catch(err => {
                                console.error(
                                    `Event Error ${file}:`,
                                    err.message
                                );
                            });
                        }
                    }
                } else {
                    registerCommand(moduleExport);

                    if (
                        moduleExport &&
                        (
                            typeof moduleExport.execute === "function" ||
                            typeof moduleExport.onStart === "function"
                        )
                    ) {
                        loadedCommands.push({
                            name: file,
                            module: moduleExport
                        });
                    }
                }

            } catch (error) {
                console.error(
                    `Error loading ${file}:`,
                    error.stack || error.message
                );
            }
        }
    }

    loadFromDirectory(commandsDir, "commands");
    loadFromDirectory(privateDir, "private");
    loadFromDirectory(eventsDir, "events");

    // Initialize modules after every command has been registered.
    for (const item of loadedCommands) {
        const command = item.module;

        if (typeof command.onLoad === "function") {
            Promise.resolve()
                .then(() => command.onLoad(bot))
                .then(() => {
                    console.log(
                        `Module Initialized: ${item.name}`
                    );
                })
                .catch(error => {
                    console.error(
                        `Module Initialization Error ${item.name}:`,
                        error.stack || error.message
                    );
                });
        }
    }

    console.log(
        `Loaded ${commands.size} commands and ${aliases.size} aliases.`
    );
}

loadAllModules();

function getUserRole(userId) {
    const id = String(userId);

    if (
        id === String(config.ownerID) ||
        (config.adminIDs || []).map(String).includes(id)
    ) {
        return 2;
    }

    if ((config.modIDs || []).map(String).includes(id)) {
        return 1;
    }

    return 0;
}

bot.on("message", async msg => {
    try {
        if (!msg || !msg.chat) return;

        const text = msg.text
            ? msg.text.trim()
            : (msg.caption ? msg.caption.trim() : "");

        const chatId = msg.chat.id;
        const userId = msg.from ? String(msg.from.id) : "0";

        const userRole = getUserRole(userId);

        const currentPrefix =
            config.prefix !== undefined
                ? config.prefix
                : "/";

        // Run onChat handlers.
        for (const command of commands.values()) {
            if (typeof command.onChat === "function") {
                try {
                    await command.onChat({ bot, msg });
                } catch (error) {
                    console.error("onChat Error:", error.message);
                }
            }
        }

        // Whitelist protection.
        if (config.whitelistMode && config.whitelistMode.enable) {
            if (userRole < 2) {
                const whiteListIds =
                    (config.whitelistMode.whiteListIds || []).map(String);

                if (!whiteListIds.includes(userId)) return;
            }
        }

        if (!text) return;

        if (text === currentPrefix) {
            return bot.sendMessage(
                chatId,
                `📜 COMMAND DOES NOT EXIST. TYPE ${currentPrefix}help`,
                { reply_to_message_id: msg.message_id }
            );
        }

        let args = [];
        let commandName = "";
        let hasPrefix = false;

        if (text.startsWith(currentPrefix)) {
            hasPrefix = true;

            const withoutPrefix =
                text.slice(currentPrefix.length).trim();

            if (!withoutPrefix) return;

            args = withoutPrefix.split(/\s+/);

            const rawCmd = args.shift().toLowerCase();

            commandName = rawCmd.split("@")[0];

        } else if (userRole > 0) {
            const tempArgs = text.split(/\s+/);

            const firstWord = tempArgs[0].toLowerCase();
            const cleanName = firstWord.split("@")[0];

            if (
                commands.has(cleanName) ||
                aliases.has(cleanName)
            ) {
                args = tempArgs;

                const rawCmd = args.shift().toLowerCase();

                commandName = rawCmd.split("@")[0];

                hasPrefix = true;
            }
        }

        if (!hasPrefix) return;

        // Group approval protection.
        if (
            msg.chat.type === "group" ||
            msg.chat.type === "supergroup"
        ) {
            if (userRole < 2) {
                const isPending =
                    global.telegramPendingChats &&
                    global.telegramPendingChats.some(
                        chat => String(chat.id) === String(chatId)
                    );

                if (isPending) {
                    const groupTitle =
                        msg.chat.title || "Unknown Group";

                    const notApprovedText =
`╭━❮ 𝐒𝐍𝐂-𝐁𝐎𝐓 ❯━╮
├═━═━═━═━═━═━══━═
├‣ ❌ NOT APPROVED
├‣ 📛 Group: ${groupTitle}
├‣ 🆔 ID: ${chatId}
├═━═━═━═━═━═━═━═
├‣ ⚠️ Approval Needed!
╰━═━═━═━═━═━═━═━╯`;

                    return bot.sendMessage(chatId, notApprovedText, {
                        reply_to_message_id: msg.message_id,
                        reply_markup: {
                            inline_keyboard: [[
                                {
                                    text: "👑 CONTACT OWNER",
                                    url: `https://t.me/${config.ownerUsername || "ri_siyam"}`
                                }
                            ]]
                        }
                    });
                }
            }
        }

        const actualCommandName =
            commands.has(commandName)
                ? commandName
                : aliases.get(commandName);

        if (
            !actualCommandName ||
            !commands.has(actualCommandName)
        ) {
            return bot.sendMessage(
                chatId,
                `🔎 COMMAND "${commandName}" DOES NOT EXIST. TYPE ${currentPrefix}help`,
                { reply_to_message_id: msg.message_id }
            );
        }

        const command = commands.get(actualCommandName);

        const cmdRole =
            command.role !== undefined
                ? command.role
                : (
                    command.config &&
                    command.config.role !== undefined
                        ? command.config.role
                        : 0
                );

        if (userRole < cmdRole) {
            return bot.sendMessage(
                chatId,
                "𝐌𝐘 𝐁𝐎𝐒𝐒 𝐒𝐈𝐘𝐀𝐌 𝐎𝐍𝐋𝐘",
                { reply_to_message_id: msg.message_id }
            );
        }

        try {
            if (typeof command.execute === "function") {
                return await command.execute(bot, msg, args);
            }

            if (typeof command.onStart === "function") {
                return await command.onStart({
                    bot,
                    msg,
                    args
                });
            }

        } catch (error) {
            console.error(
                `Command Error ${actualCommandName}:`,
                error.stack || error.message
            );

            return bot.sendMessage(
                chatId,
                "❌ কমান্ড রান করতে সমস্যা হয়েছে!",
                { reply_to_message_id: msg.message_id }
            );
        }

    } catch (error) {
        console.error("Global Message Error:", error);
    }
});

bot.on("callback_query", async query => {
    try {
        if (bot.commands.has("cmd")) {
            const cmdModule = bot.commands.get("cmd");

            if (typeof cmdModule.handleCallback === "function") {
                await cmdModule.handleCallback(bot, query);
            }
        }

        for (const command of commands.values()) {
            if (typeof command.onCallbackQuery === "function") {
                await command.onCallbackQuery(bot, query);
            }
        }

    } catch (error) {
        console.error(
            "Callback Query Error:",
            error.message
        );
    }
});

console.log("Telegram Bot Engine Active and Ready!");
