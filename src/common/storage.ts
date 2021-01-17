class StorageChrome {
	async getOne(key: string, defaultValue?: any) {
		const result = await this.get([key]);

		const value = result[key] ?? defaultValue;

		return value;
	}

	get(keys: string[]): Promise<any> {
		return new Promise((resolve) => {
			chrome.storage.local.get(keys, resolve);
		});
	}

	set(obj: Record<string, any>) {
		return new Promise((resolve) => {
			// console.log(value)
			chrome.storage.local.set(obj, () => resolve(true));
		});
	}
}

export const storage = new StorageChrome();
