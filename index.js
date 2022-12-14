const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5361308436:AAHg7KjC3u4WCQCkI0xoY4G4KUnjobw2pcc';
const bot = new TelegramBot(token, {polling: true});

const chats = {}

const commands = {
    START: '/start',
    INFO: '/info',
    GAME: '/game',
    AGAIN: '/again'
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess the number: 0-9~');
    const randNum = Math.floor(Math.random() * 10);
    chats[chatId] = randNum;
    await bot.sendMessage(chatId, 'Guess: ', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: commands.START, description: 'Start!'},
        {command: commands.INFO, description: 'Get information'},
        {command: commands.GAME, description: 'Start game!'},
    ])

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if(text === commands.START) {
            return bot.sendMessage(chatId, 'Welcome~');
        }
        if(text === commands.INFO) {
            return bot.sendMessage(chatId, 'Get information yourself~');
        }
        if(text === commands.GAME) {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Not found! 404~');
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatID = msg.message.chat.id;
        if(data === commands.AGAIN) {
            return startGame(chatID)
        }
        if(data === chats[chatID]) {
            return bot.sendMessage(chatID, `Congratulations! You are guessed: ${chats[chatID]}~`, againOptions)
        } else {
            return bot.sendMessage(chatID, `Failure: correct answer --> ${chats[chatID]}~`, againOptions)
        }
    })
}

start();

