import WeatherData from './weather';

const DOMElements = {
	settings: {
		settingsInput: document.querySelector('.settings-svg'),
		settingsOpen: document.querySelector('.settings-open'),
		settingsMetric: document.querySelector('.metric'),
		settingsUS: document.querySelector('.us'),
	},
	input: document.querySelector('input'),
	loader: document.querySelector('.loader'),
	background: document.querySelector('.bg'),
	error: document.querySelector('.error'),
	weatherDataWrapper: {
		dataWrapper: document.querySelector('.weather-data-wrapper'),
		temperature: document.querySelector('.temperature'),
		condition: document.querySelector('.condition'),
		icon: document.querySelector('.icon'),
	},
};

class WeatherDOM extends WeatherData {
	constructor(DOM) {
		super(DOM);
		this.settingsInput = DOM.settings.settingsInput;
		this.settingsOpen = DOM.settings.settingsOpen;
		this.settingsMetric = DOM.settings.settingsMetric;
		this.settingsUS = DOM.settings.settingsUS;
		this.input = DOM.input;
		this.backgroundDOM = DOM.background;
		this.dataWrapperDOM = DOM.weatherDataWrapper.dataWrapper;
		this.temperatureDOM = DOM.weatherDataWrapper.temperature;
		this.conditionDOM = DOM.weatherDataWrapper.condition;
		this.iconDOM = DOM.weatherDataWrapper.icon;
	}

	openSettings() {
		this.settingsInput.addEventListener('click', () => {
			this.settingsOpen.classList.toggle('hidden');
			this.settingsInput.classList.toggle('settings-active');
		});
	}

	changeSettings() {
		this.settingsMetric.addEventListener('click', () => {
			if (this.unit !== 'celsius') {
				super.setUnit('fahrenheit');
				this.changeToCelsius();
				this.settingsMetric.classList.toggle('unit-active');
				this.settingsUS.classList.toggle('unit-active');
			}
			this.settingsOpen.classList.toggle('hidden');
			this.settingsInput.classList.toggle('settings-active');
		});
		this.settingsUS.addEventListener('click', () => {
			if (this.unit !== 'fahrenheit') {
				super.setUnit('celsius');
				this.changeToFahrenheit();
				this.settingsUS.classList.toggle('unit-active');
				this.settingsMetric.classList.toggle('unit-active');
			}
			this.settingsOpen.classList.toggle('hidden');
			this.settingsInput.classList.toggle('settings-active');
		});
	}

	closeSettings() {
		window.addEventListener('click', (e) => {
			if (
				this.settingsInput.classList.contains('settings-active') &&
				e.target !== this.settingsOpen &&
				e.target !== this.settingsInput &&
				!this.settingsInput.contains(e.target)
			) {
				this.settingsOpen.classList.toggle('hidden');
				this.settingsInput.classList.toggle('settings-active');
			}
		});
	}

	changeToCelsius() {
		if (!this.dataWrapperDOM.classList.contains('hidden')) {
			const newTemp = Math.round(((this.temp - 32) * 5) / 9);
			this.temp = newTemp;
			this.temperatureDOM.innerText = `${newTemp}°`;
		}
	}

	changeToFahrenheit() {
		if (!this.dataWrapperDOM.classList.contains('hidden')) {
			const newTemp = Math.round((this.temp * 9) / 5 + 32);
			this.temp = newTemp;
			this.temperatureDOM.innerText = `${newTemp}°`;
		}
	}

	searchLocation() {
		this.input.addEventListener('change', () => {
			if (!this.dataWrapperDOM.classList.contains('hidden')) {
				this.dataWrapperDOM.classList.toggle('hidden');
			}
			if (!this.error.classList.contains('hidden')) {
				this.error.classList.toggle('hidden');
			}
			if (this.input.value !== '') {
				this.loader.classList.toggle('hidden');
				super.setData(this.input.value).then(() => {
					setTimeout(() => {
						this.temperatureDOM.innerText = `${this.temp}°`;
						this.conditionDOM.innerText = this.conditions;
						this.iconDOM.innerHTML = '';
						this.iconDOM.appendChild(this.icon);
						this.loader.classList.toggle('hidden');
						this.backgroundDOM.style.backgroundImage = `url(${this.background})`;
						this.dataWrapperDOM.classList.toggle('hidden');
					}, 2000);
				});
			}
		});
	}

	initializeInput() {
		this.searchLocation();
	}

	initializeSettings() {
		this.openSettings();
		this.changeSettings();
		this.closeSettings();
	}
}

const weatherApp = new WeatherDOM(DOMElements);
document.addEventListener('DOMContentLoaded', () => {
	weatherApp.initializeInput();
	weatherApp.initializeSettings();
});
