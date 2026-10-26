module.exports = (bot) => {
  
    const TARGET_CHAT_ID = "-1004422571292";

    bot.on('message', async (msg) => {
        try {
            if (!msg || !msg.chat) return;

            const chatId = String(msg.chat.id);

            
            if (chatId === TARGET_CHAT_ID) {
                
                if (msg.from && msg.from.is_bot) return;

                const promoText = 
`📢 আসসালামু আলাইকুম @Everyone! 🌸
🔥 আপনারা কি ফ্রিতে যেকোনো 𝐀𝐏𝐈 𝐊𝐞 নিতে চান?
এবং ফ্রিতে একটি আধুনিক টেলিগ্রাম বট নিজের মতো তৈরি করে ব্যবহার করতে চান এবং অসংখ্য কমান্ড উপভোগ করতে চান, তাদের জন্য রয়েছে দারুণ সুযোগ! 🚀

✨ আমাদের ESB-V5 Telegram Bot-এর বিশেষ সুবিধা:
✅ ফ্রিতে বট ব্যবহার করার সুযোগ
✅ নিজের বট তৈরি ও ব্যবহার করার সুবিধা
✅ ৫৯৮টি কমান্ড ব্যবহারের সুযোগ
✅ আধুনিক ও উন্নত বট সিস্টেম সম্পর্কে জানার সুযোগ

🎯 যারা যারা নিতে ও ব্যবহার করতে আগ্রহী, তারা আর দেরি না করে এখনই আমাদের টেলিগ্রাম গ্রুপে জয়েন হন
👇 গ্রুপে জয়েন হতে নিচের লিংকে ক্লিক করুন
🔗 https://t.me/siyam_esb`;

              
                await bot.sendMessage(chatId, promoText, {
                    reply_to_message_id: msg.message_id
                });
            }
        } catch (err) {
            console.error("Auto Promo Error:", err.message);
        }
    });
};
