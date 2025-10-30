# Weather Forecast Application

A beautiful, modern weather forecasting web application with real-time data, 10-day forecasts, interactive charts, and stunning 3D animations.

## Features

- 🌍 **Global City Search** - Search and view weather for any city worldwide
- 🌡️ **Real-time Weather Data** - Current temperature, humidity, wind speed, pressure, and more
- 📅 **10-Day Forecast** - Extended weather predictions with detailed information
- 📊 **Interactive Charts** - Temperature trends, precipitation probability, humidity, and wind speed visualizations
- 🎨 **3D Weather Animations** - Dynamic Three.js animations that change based on weather conditions (rain, snow, clouds, clear sky)
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ✨ **Modern UI** - Glassmorphism effects, smooth animations, and gradient backgrounds

## Weather Conditions Supported

The 3D animations dynamically change based on weather:
- ☀️ Clear sky - Floating golden particles
- 🌧️ Rain/Drizzle - Falling raindrops
- ❄️ Snow - Gentle snowflakes
- ☁️ Cloudy - Moving cloud formations
- ⛈️ Thunderstorm - Rain with lightning effects
- 🌫️ Mist/Fog - Floating fog particles

## Technology Stack

### Backend
- **Python 3.x**
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Requests** - HTTP library for API calls

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with animations and glassmorphism
- **JavaScript (ES6+)** - Application logic
- **Chart.js** - Data visualization
- **Three.js** - 3D weather animations

### API
- **OpenWeatherMap API** - Weather data provider

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd weather-app
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## Project Structure

```
weather-app/
├── app.py                      # Flask backend server
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── templates/
│   └── index.html             # Main HTML template
└── static/
    ├── css/
    │   └── styles.css         # All styles and animations
    └── js/
        ├── script.js          # Main application logic
        └── three-animation.js # 3D weather animations
```

## API Endpoints

### Get Current Weather
```
GET /api/weather/current?city={city_name}
```

### Get 10-Day Forecast
```
GET /api/weather/forecast?city={city_name}
```

### Search Cities
```
GET /api/weather/search?q={query}
```

## Usage

1. **Search for a City:**
   - Type a city name in the search bar
   - Select from autocomplete suggestions
   - Or press Enter/click Search button

2. **View Current Weather:**
   - See real-time temperature, humidity, wind speed
   - Weather description and icon
   - Additional details like pressure and cloudiness

3. **Check 10-Day Forecast:**
   - Scroll down to see forecast cards
   - Each card shows date, temperature, conditions
   - Hover for additional details

4. **Analyze Weather Trends:**
   - View interactive charts for temperature trends
   - Check precipitation probability
   - Monitor humidity and wind speed patterns

5. **Enjoy 3D Animations:**
   - Background animations change based on current weather
   - Rain, snow, clouds, or clear sky effects

## API Key

The application uses OpenWeatherMap API with the provided API key:
- API Key: `aa0497d38dcc18e4f6380f7f76412eed`
- The key is configured in `app.py`

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Performance Notes

- The application uses WebGL for 3D animations
- Charts are rendered using Canvas API
- Optimized for smooth performance on modern devices

## Customization

### Change Color Scheme
Edit CSS variables in `static/css/styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
}
```

### Adjust Animation Particles
Modify particle counts in `static/js/three-animation.js`:
```javascript
// Example: Change rain particle count
for (let i = 0; i < 500; i++) { // Adjust this number
```

## Troubleshooting

### Port Already in Use
If port 5000 is busy, change it in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### API Rate Limits
Free tier OpenWeatherMap API has rate limits. If you encounter issues:
- Wait a few minutes between requests
- Consider upgrading your API plan

### 3D Animations Not Working
- Ensure your browser supports WebGL
- Check browser console for errors
- Try disabling browser extensions

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- 3D animations using [Three.js](https://threejs.org/)
- Font: [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts

## License

This project is open source and available for educational purposes.

---

**Enjoy your weather forecasting experience! 🌤️**
