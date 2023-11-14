import temp_data from "./temp_data.js"

function App() {
  let temp = "+5";
  const [bgColor, setBgColor] = useState("bg-black");

  const updateBgColor = () => {
    if (temp > 0.35){
      setBgColor("bg-barn_red")
    }
  };
  console.log(temp_data[4]);

  return (
    <section className={`h-screen ${bgColor} text-white transition-all`}>
      <div className="flex w-full justify-center items-center">
        <h2>{temp}°C</h2>
      </div>
    </section>
  );
}

export default App;
