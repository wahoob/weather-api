const date = document.getElementById("date");
const loc = document.getElementById("location");
const currentTemp = document.getElementById("current-temp");
const dayName = document.getElementById("day-name");
const stats = document.getElementById("stats");

const API_URL = "https://api.weatherapi.com/v1/forecast.json";
const KEY = "eda8d98890214bab926190059241708";

const fetchWeather = async (lat, lng) => {
  try {
    const response = await fetch(`${API_URL}?key=${KEY}&q=${lat},${lng}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);

    // SET VALUES
    const dateObj = new Date();
    date.textContent = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { country, name } = data.location;
    const { condition, temp_c } = data.current;
    const { hour } = data.forecast.forecastday[0];

    loc.textContent = `${name}, ${country}`;

    currentTemp.textContent = `${temp_c}°C`;

    dayName.textContent = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
    });

    stats.textContent = condition.text;

    const currentHour = dateObj.getHours();
    const start = currentHour > 15 ? 15 : currentHour;
    const end = start + 9;

    hour.slice(start, end).forEach((h, i) => {
      const day = document.getElementById(`day-${i + 1}`);
      const paragraphs = day.querySelectorAll("p");
      const { time, temp_c } = h;
      const hour24 = time.split(" ")[1].split(":")[0];
      const period = hour24 >= 12 ? "PM" : "AM";
      const hour12 = hour24 % 12 || 12;

      if (Number(hour24) === currentHour) {
        day.classList.add("today");
      }

      paragraphs[0].textContent = `${hour12} ${period}`;
      paragraphs[1].textContent = `${temp_c}°C`;
    });
  } catch (err) {
    console.error(err.message);
  }
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetchWeather(latitude, longitude);
    },
    (error) => {
      console.error("Error getting the location:", error.message);
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}
