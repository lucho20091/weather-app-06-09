// DOM Elements
const cityInputEl = document.getElementById('city-input')
const searchFormEl = document.getElementById('search-form')
const cityWeatherEl = document.getElementById('city-weather')


const apiKey = 'f27ce85670a99a4166190adb76e403ba'

// We are going to use these emojis as icons on the top
const weatherEmojis = {
    clear: "☀️",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
    smoke: "💨",
    haze: "🌫️",
    dust: "🌪️",
    fog: "🌁",
    sand: "🌪️",
    ash: "🌋",
    squall: "🌬️",
    tornado: "🌪️"
}

// We are going to use them to display the month on the app
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
    "October", "November", "December"]

// Event Listeners
searchFormEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const city = cityInputEl.value 
    getWeather(city) //we are calling our function when we submit the form
})

// Fetch weather from API
async function getWeather(city){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        if (!response.ok){
            throw new Error('city not found')
        }
        const data = await response.json()
        const weatherInfo = {
            city: data.name,
            temp: Math.floor(data.main.temp),
            humidity: data.main.humidity,
            wind: data.wind.speed,
            weather: data.weather[0].main,
            icon: weatherEmojis[data.weather[0].main.toLowerCase()],
            date: getCurrentDate()
        }
        localStorage.setItem('weather', JSON.stringify(weatherInfo))
        renderData(weatherInfo)
    } catch (error) {
        console.error(error)
        alert(error)
    }
}

// function to get current date
function getCurrentDate(){
    const today = new Date()
    const day = today.getDate()
    const month = monthNames[today.getMonth()]
    return `Today, ${day} ${month}`
}

// function to render the html by default it takes the obj in local storage if it doesnt get an argument
function renderData(weatherObj = JSON.parse(localStorage,getItem('weather'))){
    const { city, temp, humidity, wind, weather, icon, date } = weatherObj
    const html = `
            <p class="weather-icon">${icon}</p>
            <div class="card">
                <p class="date">${date}</p>
                <p class="temp">${temp}°</p>
                <p class="city">${city}</p>
                <p class="weather">${weather}</p>
                <div class="weather-info">
                    <i class="fa-solid fa-wind"></i><!-- icon from font awesome -->
                    <p class="info">wind</p>
                    <p>${wind} Km/h</p>
                </div>
                <div class="weather-info">
                    <i class="fa-solid fa-droplet"></i><!-- icon from font awesome -->
                    <p class="info">hum</p>
                    <p>${humidity}%</p>
                </div>
            </div>
            <div id="forecast">

            </div>
            <button
                class="btn-forecast"
                id="btn-forecast"
                onclick="getForecastWeather()">
                Forecast Report
            </button>
    `
    cityWeatherEl.innerHTML = html
}

// function to fetch the forecast weather
async function getForecastWeather(){
    try {
        const { city } = JSON.parse(localStorage.getItem('weather'))
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        if (!response.ok){
            throw new Error('City not found')
        }
        const data = await response.json()
        document.getElementById('forecast').innerHTML = renderForecast(data.list)
    } catch (error) {
        console.error(error)
        alert(error)
    }
}
// function to render the html of the forecast weather
function renderForecast(forecastData){
    return `
<div class="forecast-section">
    ${renderForecastItems(forecastData)}
</div> 
    `
}
// function to render each item
function renderForecastItems(forecastList){
    return forecastList.map(item => {
        const forecastItem = {
            month: `${monthNames[Number(item.dt_txt.slice(5,7)) - 1].slice(0,4)}.`,
            day: item.dt_txt.slice(8,10),
            hour: item.dt_txt.slice(11, 16),
            temp: Math.floor(item.main.temp),
            icon: weatherEmojis[item.weather[0].main.toLowerCase()]
        }
        console.log(forecastItem)
        const { month, day, hour, temp, icon } = forecastItem
        document.getElementById('btn-forecast').disabled = true // disabling the button after the forecast is shown
        return `
    <div class="forecast-card">
        <p>${month} ${day}</p>
        <p>${hour}</p>
        <p>${icon}</p>
        <p>${temp}°C</p>
    </div>
        `
    }).join('')
}