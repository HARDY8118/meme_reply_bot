require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.mongo_uri, { useUnifiedTopology: true, useNewUrlParser: true }).then(db => {
    console.log('DB Connected')
    const TelegramBot = require('node-telegram-bot-api')
    const bot = new TelegramBot(process.env.token, { polling: true })
    const path = require('path')

    const meme = require('./models/memes')

    bot.on('photo', msg => {
        const newMeme = new meme({
            file_id: msg.photo[0].file_id,
            file_unique_id: msg.photo[0].file_unique_id,
            tags: msg.caption.split(';')
        })
        newMeme.save((e, m) => {
            if (e) {
                return bot.sendMessage(msg.chat.id, 'Failed to add')
            }
            else {
                return bot.sendPhoto(msg.chat.id, m.file_id, { caption: `tags: ${m.tags.toString()}` })
            }
        })
    })

    bot.on('inline_query', query => {
        q = query.query.toLowerCase()
        meme.find({ tags: q }).then(memes => {
            bot.answerInlineQuery(query.id,
                memes.map(m => ({
                    type: 'photo',
                    photo_file_id: m.file_id,
                    id: m.file_unique_id
                }))
            )
        })
    })

    bot.onText(/\/start/, async (msg, match) => {
        await bot.sendMessage(msg.chat.id, 'To add meme send a photo with search tags in lower case separated by semicolons(;) in caption')
        await bot.sendMessage(msg.chat.id, 'To send a meme type @meme_reply_bot followed by a search tag query in chat and related memes will appear above message box')
        await bot.sendMessage(msg.chat.id, 'Example: @meme_reply_bot helo')
    })

    bot.onText(/\/info/, async (msg, match) => {
        await bot.sendMessage(msg.chat.id, 'To add meme send a photo with search tags in lower case separated by semicolons(;) in caption')
        await bot.sendMessage(msg.chat.id, 'To send a meme type @meme_reply_bot followed by a search tag query in chat and related memes will appear above message box')
        await bot.sendMessage(msg.chat.id, 'Example: @meme_reply_bot helo')
    })
})