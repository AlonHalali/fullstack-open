import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = (lat, lon, appid) => {
  const targetUrl = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${appid}&units=metric`;

  return axios.get(targetUrl).then((response) => response.data);
};

export default { getWeather };
