from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

API_KEY = "aa0497d38dcc18e4f6380f7f76412eed"
BASE_URL = "http://api.openweathermap.org/data/2.5"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/weather/current', methods=['GET'])
def get_current_weather():
    """Get current weather for a city"""
    city = request.args.get('city', 'London')
    
    try:
        url = f"{BASE_URL}/weather?q={city}&appid={API_KEY}&units=metric"
        response = requests.get(url)
        data = response.json()
        
        if response.status_code == 200:
            return jsonify({
                'success': True,
                'data': {
                    'city': data['name'],
                    'country': data['sys']['country'],
                    'temperature': round(data['main']['temp'], 1),
                    'feels_like': round(data['main']['feels_like'], 1),
                    'humidity': data['main']['humidity'],
                    'pressure': data['main']['pressure'],
                    'wind_speed': data['wind']['speed'],
                    'wind_deg': data['wind'].get('deg', 0),
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'main': data['weather'][0]['main'],
                    'clouds': data['clouds']['all'],
                    'visibility': data.get('visibility', 0),
                    'sunrise': data['sys']['sunrise'],
                    'sunset': data['sys']['sunset'],
                    'timezone': data['timezone']
                }
            })
        else:
            return jsonify({'success': False, 'error': data.get('message', 'City not found')}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/weather/forecast', methods=['GET'])
def get_forecast():
    """Get 10-day weather forecast for a city"""
    city = request.args.get('city', 'London')
    
    try:
        # Get coordinates first
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
        geo_response = requests.get(geo_url)
        geo_data = geo_response.json()
        
        if not geo_data:
            return jsonify({'success': False, 'error': 'City not found'}), 404
        
        lat = geo_data[0]['lat']
        lon = geo_data[0]['lon']
        
        # Get forecast using One Call API (or 5-day forecast)
        # Using 5-day/3-hour forecast as it's available in free tier
        forecast_url = f"{BASE_URL}/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()
        
        if forecast_response.status_code == 200:
            # Process forecast data - get daily forecasts
            daily_forecasts = []
            processed_dates = set()
            
            for item in forecast_data['list']:
                date = item['dt_txt'].split(' ')[0]
                
                if date not in processed_dates and len(daily_forecasts) < 10:
                    daily_forecasts.append({
                        'date': item['dt_txt'],
                        'timestamp': item['dt'],
                        'temperature': round(item['main']['temp'], 1),
                        'temp_min': round(item['main']['temp_min'], 1),
                        'temp_max': round(item['main']['temp_max'], 1),
                        'humidity': item['main']['humidity'],
                        'pressure': item['main']['pressure'],
                        'description': item['weather'][0]['description'],
                        'icon': item['weather'][0]['icon'],
                        'main': item['weather'][0]['main'],
                        'clouds': item['clouds']['all'],
                        'wind_speed': item['wind']['speed'],
                        'pop': item.get('pop', 0) * 100,  # Probability of precipitation
                        'rain': item.get('rain', {}).get('3h', 0)
                    })
                    processed_dates.add(date)
            
            return jsonify({
                'success': True,
                'data': daily_forecasts
            })
        else:
            return jsonify({'success': False, 'error': 'Forecast not available'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/weather/search', methods=['GET'])
def search_cities():
    """Search for cities"""
    query = request.args.get('q', '')
    
    if len(query) < 2:
        return jsonify({'success': False, 'error': 'Query too short'}), 400
    
    try:
        url = f"http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        cities = []
        for city in data:
            cities.append({
                'name': city['name'],
                'country': city['country'],
                'state': city.get('state', ''),
                'lat': city['lat'],
                'lon': city['lon']
            })
        
        return jsonify({
            'success': True,
            'data': cities
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
