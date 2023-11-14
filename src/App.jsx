import { useEffect } from "react";
import { data } from "./data/temp_data";
import { useState } from "react";

function App() {
  let temp = "+0";
  const [bgColor, setBgColor] = useState("bg-black");

  const updateBgColor = () => {
    if (temp > 0.35){
      setBgColor("bg-barn_red")
    }
  };

  useEffect(() => {
    updateBgColor();
  }, []);

  return (
    <section className={`h-screen ${bgColor} text-white transition-all`}>
      <div className="flex w-full justify-center items-center">
        <h2>{temp}°C</h2>
      </div>
    </section>
  );
}

export default App;
