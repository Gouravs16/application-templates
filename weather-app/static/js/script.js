// API Configuration
const API_BASE = window.location.origin;
let currentCity = 'London';
let charts = {};

// DOM Elements
const citySearch = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadWeatherData(currentCity);
    
    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    citySearch.addEventListener('input', debounce(handleCitySearch, 500));
    
    // Click outside to close search results
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== citySearch) {
            searchResults.classList.remove('active');
        }
    });
});

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show/Hide Loading
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Handle Search
function handleSearch() {
    const city = citySearch.value.trim();
    if (city) {
        currentCity = city;
        loadWeatherData(city);
        searchResults.classList.remove('active');
    }
}

// Handle City Search (Autocomplete)
async function handleCitySearch() {
    const query = citySearch.value.trim();
    
    if (query.length < 2) {
        searchResults.classList.remove('active');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/weather/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displaySearchResults(data.data);
        } else {
            searchResults.classList.remove('active');
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Display Search Results
function displaySearchResults(cities) {
    searchResults.innerHTML = cities.map(city => `
        <div class="search-result-item" onclick="selectCity('${city.name}')">
            <strong>${city.name}</strong>, ${city.state ? city.state + ', ' : ''}${city.country}
        </div>
    `).join('');
    
    searchResults.classList.add('active');
}

// Select City from Search
function selectCity(cityName) {
    currentCity = cityName;
    citySearch.value = cityName;
    loadWeatherData(cityName);
    searchResults.classList.remove('active');
}

// Load Weather Data
async function loadWeatherData(city) {
    showLoading();
    
    try {
        // Load current weather and forecast in parallel
        const [currentWeather, forecast] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)
        ]);
        
        if (currentWeather) {
            displayCurrentWeather(currentWeather);
            updateThreeAnimation(currentWeather.main);
        }
        
        if (forecast) {
            displayForecast(forecast);
            updateCharts(forecast);
        }
    } catch (error) {
        console.error('Error loading weather data:', error);
        alert('Failed to load weather data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Fetch Current Weather
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(`${API_BASE}/api/weather/current?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching current weather:', error);
        return null;
    }
}

// Fetch Forecast
async function fetchForecast(city) {
    try {
        const response = await fetch(`${API_BASE}/api/weather/forecast?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return null;
    }
}

// Display Current Weather
function displayCurrentWeather(weather) {
    document.getElementById('city-name').textContent = `${weather.city}, ${weather.country}`;
    document.getElementById('weather-description').textContent = weather.description;
    document.getElementById('temperature').textContent = Math.round(weather.temperature);
    document.getElementById('feels-like').textContent = `Feels like ${Math.round(weather.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${weather.humidity}%`;
    document.getElementById('wind-speed').textContent = `${weather.wind_speed} m/s`;
    document.getElementById('pressure').textContent = `${weather.pressure} hPa`;
    document.getElementById('clouds').textContent = `${weather.clouds}%`;
    
    const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
    document.getElementById('weather-icon').src = iconUrl;
}

// Display Forecast
function displayForecast(forecast) {
    const forecastGrid = document.getElementById('forecast-grid');
    
    forecastGrid.innerHTML = forecast.map(day => {
        const date = new Date(day.timestamp * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
        
        return `
            <div class="forecast-card glass">
                <div class="forecast-date">${dateStr}</div>
                <img src="${iconUrl}" alt="${day.description}" class="forecast-icon">
                <div class="forecast-temp">${Math.round(day.temperature)}°C</div>
                <div class="forecast-desc">${day.description}</div>
                <div class="forecast-details">
                    <div class="forecast-detail-row">
                        <span>💧 ${day.humidity}%</span>
                        <span>💨 ${day.wind_speed} m/s</span>
                    </div>
                    <div class="forecast-detail-row">
                        <span>🌧️ ${Math.round(day.pop)}%</span>
                        <span>☁️ ${day.clouds}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update Charts
function updateCharts(forecast) {
    const labels = forecast.map(day => {
        const date = new Date(day.timestamp * 1000);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const temperatures = forecast.map(day => day.temperature);
    const tempMin = forecast.map(day => day.temp_min);
    const tempMax = forecast.map(day => day.temp_max);
    const precipitation = forecast.map(day => day.pop);
    const humidity = forecast.map(day => day.humidity);
    const windSpeed = forecast.map(day => day.wind_speed);
    
    // Temperature Chart
    updateTemperatureChart(labels, temperatures, tempMin, tempMax);
    
    // Precipitation Chart
    updatePrecipitationChart(labels, precipitation);
    
    // Humidity & Wind Chart
    updateHumidityWindChart(labels, humidity, windSpeed);
}

// Temperature Chart
function updateTemperatureChart(labels, temps, tempMin, tempMax) {
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    
    if (charts.temperature) {
        charts.temperature.destroy();
    }
    
    charts.temperature = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature',
                    data: temps,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Min Temp',
                    data: tempMin,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Max Temp',
                    data: tempMax,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return value + '°C';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Precipitation Chart
function updatePrecipitationChart(labels, precipitation) {
    const ctx = document.getElementById('precipitation-chart').getContext('2d');
    
    if (charts.precipitation) {
        charts.precipitation.destroy();
    }
    
    charts.precipitation = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precipitation Probability',
                data: precipitation,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Humidity & Wind Chart
function updateHumidityWindChart(labels, humidity, windSpeed) {
    const ctx = document.getElementById('humidity-wind-chart').getContext('2d');
    
    if (charts.humidityWind) {
        charts.humidityWind.destroy();
    }
    
    charts.humidityWind = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: humidity,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 3,
                    yAxisID: 'y',
                    tension: 0.4
                },
                {
                    label: 'Wind Speed (m/s)',
                    data: windSpeed,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 3,
                    yAxisID: 'y1',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Update Three.js Animation based on weather
function updateThreeAnimation(weatherCondition) {
    if (typeof updateWeatherAnimation === 'function') {
        updateWeatherAnimation(weatherCondition);
    }
}
