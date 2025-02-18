require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const http = require('http');
const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end('Bot is running!');
});
server.listen(process.env.PORT || 3000);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const quotes = require('./quotes.json').laws;

let currentIndex = 0;

function getNextQuote() {
	const citation = quotes[currentIndex];
	currentIndex = (currentIndex + 1) % quotes.length;

	return `Prawo ${citation.law} - ${citation.quote}\n${citation.explanation}`;
}

cron.schedule('30 6 * * *', () => {
	const dailyQuote = getNextQuote();
	bot
		.sendMessage(process.env.CHAT_ID, dailyQuote)
		.then(() => console.log('Cytat wysłany:', dailyQuote))
		.catch(error => console.error('Błąd podczas wysyłania cytatu:', error));
});
