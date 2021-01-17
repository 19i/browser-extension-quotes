<template>
	<v-app id="app">
		<v-main>
			<v-container fluid>
				<v-form>
					<v-row>
						<v-col cols="12" mid="12">
							<v-textarea name="input-7-1" label="Список цитат" v-model="valText"></v-textarea>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-btn @click="save()">Сохранить</v-btn>
							<v-btn @click="show()">Показать цитату</v-btn>
						</v-col>
					</v-row>
				</v-form>
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Main } from 'src/background/main';
import { storage } from 'src/common/storage';

interface WindowBackground extends Window {
	main: Main;
}

@Component({
	components: {}
})
export default class App extends Vue {
	main: Main;

	valText = '';

	async created() {
		chrome.runtime.getBackgroundPage((backgroundPage: WindowBackground) => {
			this.main = backgroundPage.main;

			this.valText = this.main.list.join('\n\n');
		});
	}

	async save() {
		const list = this.valText.split('\n\n');

		this.main.save(list);
	}

	show() {
		this.main.show();
	}
}
</script>

<style lang="scss">
#app {
	display: flex;
	flex-direction: column;
	height: 400px;
	width: 400px;
}
</style>
