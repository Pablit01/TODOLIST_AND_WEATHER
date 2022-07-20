class Weather{
    constructor(){
      this.key = '549d78b8384f87ef8e7549731aa45ee1';
      this.city = 'krakow';
      this.selector = document.querySelector('.weather-API');
    }
  
  
    async getWeather(){
  
      const link = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.key}&units=metric`;
      const dane = await fetch(link);
      const ee = await dane.json();
      return ee;
  
    }
  
    updateCity(newCity){
      this.city = newCity;
    }
  
  updateWeatherUI(data){
  
      this.selector.innerHTML = `
        <div class="weather-API  fst-italic fw-bold">
          Weather in Your city: ${data.name}<br>
          Temperature: ${Math.round(data.main.temp)}&#8451;<br>
          Weather condition: ${data.weather[0].description}
          <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></img>
          <br>
          Change City:
          <form class="siemanko1">
            <input type="text" id="changeCity">
          </form>
        </div>
      `;
    ;
  
    const citySelector = document.querySelector('.siemanko1');
    citySelector.addEventListener('submit', (e) => {
        e.preventDefault();
        const ee = e.target.changeCity.value;
        this.updateCity(ee);
        this.getWeather().then( (data) => pogodaKret.updateWeatherUI(data));
        citySelector.reset();
     });
    }
  
  }
  
  export const pogodaKret = new Weather();



