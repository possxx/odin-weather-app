import icons from './icons';
import clearDay from './assets/images/clear-day.jpeg';
import clearNight from './assets/images/clear-night.jpeg';
import cloudy from './assets/images/cloudy.jpeg';
import foggy from './assets/images/foggy.jpeg';
import partlyCloudyDay from './assets/images/partly-cloudy-day.jpeg';
import partlyCloudyNight from './assets/images/partly-cloudy-night.jpeg';
import rain from './assets/images/rain.jpeg';
import snow from './assets/images/snow.jpeg';
import wind from './assets/images/wind.jpeg';

class WeatherData {
	constructor(DOM) {
		this.unit = 'celsius';
		this.time = undefined;
		this.address = undefined;
		this.conditions = undefined;
		this.icon = undefined;
		this.background = undefined;
		this.temp = undefined;
		this.error = DOM.error;
		this.loader = DOM.loader;
	}

	getWeatherData(location) {
		return new Promise((resolve) => {
			fetch(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=666SEREGH6V427L9DPQY6KWET`,
				{ mode: 'cors' }
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error();
					}
					return response.json();
				})
				.then((response) => {
					const data = {
						address: response.address,
						conditions: response.currentConditions.conditions,
						theme: response.currentConditions.icon,
						temp: response.currentConditions.temp,
						sunrise: response.currentConditions.sunrise,
						sunset: response.currentConditions.sunset,
					};
					resolve(data);
				})
				.catch(() => {
					setTimeout(() => {
						this.loader.classList.toggle('hidden');
						this.error.classList.toggle('hidden');
					}, 2000);
				});
		});
	}

	setUnit(unit) {
		if (unit === 'fahrenheit') {
			this.unit = 'celsius';
		} else this.unit = 'fahrenheit';
	}

	setTime(sunrise, sunset) {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const currentTime = `${hours}:${minutes}:${seconds}`;
		if (currentTime > sunrise && currentTime < sunset) {
			this.time = 'day';
		} else {
			this.time = 'night';
		}
	}

	setAddress(address) {
		this.address = address;
	}

	setConditions(conditions) {
		this.conditions = conditions;
	}

	setTheme(theme) {
		switch (theme) {
			case 'snow':
				this.icon = icons.snow;
				this.background = snow;
				break;
			case 'rain':
				this.icon = icons.rain;
				this.background = rain;
				break;
			case 'fog':
				this.icon = icons.foggy;
				this.background = foggy;
				break;
			case 'wind':
				this.icon = icons.wind;
				this.background = wind;
				break;
			case 'cloudy':
				this.icon = icons.cloudy;
				this.background = cloudy;
				break;
			case 'partly-cloudy-day':
				this.icon = icons.partlyCloudyDay;
				this.background = partlyCloudyDay;
				break;
			case 'partly-cloudy-night':
				this.icon = icons.partlyCloudyNight;
				this.background = partlyCloudyNight;
				break;
			case 'clear-day':
				this.icon = icons.clearDay;
				this.background = clearDay;
				break;
			case 'clear-night':
				this.icon = icons.clearNight;
				this.background = clearNight;
				break;
			default:
				this.icon = undefined;
				this.background = undefined;
		}
	}

	setTemp(temp) {
		if (this.unit === 'fahrenheit') {
			this.temp = Math.round(Number(temp));
		}
		if (this.unit === 'celsius') {
			const tempCelsius = Math.round((temp - 32) * (5 / 9));
			this.temp = tempCelsius;
		}
	}

	setData(location) {
		return new Promise((resolve) => {
			this.getWeatherData(location).then((response) => {
				this.setTime(response.sunrise, response.sunset);
				this.setAddress(response.address);
				this.setConditions(response.conditions);
				this.setTheme(response.theme);
				this.setTemp(response.temp);
				resolve();
			});
		});
	}
}

export default WeatherData;
