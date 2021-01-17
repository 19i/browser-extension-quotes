import { storage } from 'src/common/storage';

import { ListQuotes } from 'src/types';

const config = {
	timeoutClose: 10 * 1000,
	timeoutRecursive: 5 * 60 * 1000
};

export class Main {
	list: ListQuotes = [];

	listShuffle: ListQuotes = [];

	constructor() {
		console.log('main');

		this.start();
	}

	async start() {
		console.log('start');

		this.list = await storage.getOne('list', []);

		this.showRecursive();
	}

	async stop() {
		console.log('stop');
	}

	showRecursive() {
		this.show();

		setTimeout(() => this.showRecursive(), config.timeoutRecursive);
	}

	show() {
		const quote = this.getQuote();

		chrome.notifications.create(
			{
				type: 'basic',
				title: 'Цитата',
				// priority: 1,
				message: quote,
				// eventTime: Date.now() + 1,
				iconUrl: chrome.extension.getURL('icon.png')
			},
			(id) => {
				console.log(id);

				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}

				setTimeout(() => chrome.notifications.clear(id), config.timeoutClose);

				// chrome.notifications.getAll((list) => console.log(list));
			}
		);
	}

	getQuote() {
		if (!this.listShuffle.length) {
			this.listShuffle = this.list.sort(() => Math.random() - 0.5);
		}

		return this.listShuffle.shift();
	}

	async save(list: ListQuotes) {
		this.list = list;

		await storage.set({ list });
	}
}

const main = new Main();

window.main = main;
