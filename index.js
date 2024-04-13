const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '7131732278:AAEai0ZR6cwA8JvND0oIDMl0SEGYHbiXdZw';

const bot = new TelegramBot(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Бот загадывает число от 1 до 7. Попробуй угадать его...`);
    const randomNumber = Math.floor(Math.random(0, 7) * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Твой ответ:', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start bot'},
        {command: '/info', description: 'Info bot'},
        {command: '/game', description: 'Game bot'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text == '/start') {
            await bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
            return await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp');
        }
    
        if (text == '/info') {
            await bot.sendMessage(chatId, `Бот новостного канала https://t.me/+VDMqV5mQSeIxNzQy`);
            return await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp');
        }

        if (text == '/game') {
            return startGame(chatId);
        }
    
        return await bot.sendMessage(chatId, `Я тебя не понимаю, что это такое "${text}"`);
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        
        if (data == '/again'){
            return startGame(chatId);
        }

        if (data == chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю! Ты отгадал число '${data}'`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `К сожалению не угадал. Бот загадывал число число '${chats[chatId]}'`, againOptions);            
        }
    })
}

start()