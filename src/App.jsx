import { useEffect, useState } from "react";
import { data } from "./data/temp_data";

function App() {
  const [year, setYear] = useState(1880);
  const [temp, setTemp] = useState(0);
  const [bgColor, setBgColor] = useState("black");

  useEffect(() => {
    const yearData = data.find((d) => d.year === year);
    if (yearData) {
      setTemp(yearData.temperature);
    }
  }, [year]);

  useEffect(() => {
    let newBgColor;
    if (temp >= 0.7) {
      newBgColor = "barn_red";
    } else if (0.36 <= temp && temp < 0.7) {
      newBgColor = "fire_brick";
    } else if (0.05 <= temp && temp < 0.36) {
      newBgColor = "carrot_orange";
    } else if (-0.17 <= temp && temp < 0.05) {
      newBgColor = "teal";
    } else if (temp < -0.17) {
      newBgColor = "forest_green";
    }
    setBgColor(newBgColor);
  }, [temp]);

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <section
      className="h-screen text-white transition-all duration-200"
      style={{ backgroundColor: `var(--${bgColor})` }}
    >
      <div className="flex flex-col h-full w-full justify-between text-center py-10">
        <h2>{temp}°C</h2>
        <h2 className="text-8xl font-semibold">{year}</h2>
        <input
          id="myinput"
          type="range"
          min="1880"
          max="2022"
          value={year}
          onChange={handleYearChange}
          className="max-w-5xl w-10/12 mx-auto h-10"
        />
      </div>
    </section>
  );
}

export default App;
