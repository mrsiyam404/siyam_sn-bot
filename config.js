require('dotenv').config();

module.exports = {
    botToken: process.env.BOT_TOKEN || '8780771386:AAFJR9hqIZh7qaos_JCYbw5PG4G8yTfqUyk',
    prefix: '/',
    ownerID: '8442705758',
    
    adminIDs: [
        '7683797493',
        '8442705758'
    ],

    modIDs: [],

    whitelistMode: {
        enable: false,
        whiteListIds: [
            '8442705758',
            '7683797493'
        ]
    }
};
