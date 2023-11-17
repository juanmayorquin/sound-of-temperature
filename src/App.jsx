import { data } from "./data/temp_data";
import { useRef, useState } from "react";
import musica from "./assets/musica.mp3";
let audioContext;
let source;
let analyser;

function App() {
  const [year, setYear] = useState(1880);
  const [temp, setTemp] = useState(-0.17);
  const [bgColor, setBgColor] = useState("teal");
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);
  const [song, setSong] = useState(musica);
  const canvasRef = useRef(null);
  const animationFrameId = useRef();

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.min(canvas.width, canvas.height) / 2;
    const innerRadius = radius / 2;
    const barCount = 128;
    const barWidth = ((2 * Math.PI) / barCount) * 0.4;
    const barSpacing = ((2 * Math.PI) / barCount) * 0.6;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    for (let i = 0; i < barCount; i++) {
      let barHeight = data[i];
      if (data[i] > 180) {
        barHeight = data[i] - 100;
      }
      ctx.fillStyle = "#ffffff";
      ctx.rotate(barWidth + barSpacing);
      ctx.fillRect(
        innerRadius,
        (-barWidth * radius) / 2,
        barHeight,
        barWidth * radius
      );
    }
    ctx.restore();

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleStart = () => {
    if (audioRef.current) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaElementSource(audioRef.current);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      audioRef.current.play();
      setStarted(true);
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      console.error("Audio element not ready");
    }
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setYear(newYear);
    const yearData = data.find((d) => d.year === newYear);
    if (yearData) {
      setTemp(yearData.temperature);
      setBgColor(calculateBgColor(yearData.temperature));
    }
    audioRef.current.pause();
    setSong(yearData.song);
    audioRef.current.load();
    audioRef.current.oncanplaythrough = () => {
      audioRef.current.play();
    };
  };
  
  const calculateBgColor = (temperature) => {
    if (temperature >= 0.7) {
      return "barn_red";
    } else if (0.36 <= temperature && temperature < 0.7) {
      return "fire_brick";
    } else if (0.05 <= temperature && temperature < 0.36) {
      return "carrot_orange";
    } else if (-0.17 <= temperature && temperature < 0.05) {
      return "teal";
    } else if (temperature < -0.17) {
      return "forest_green";
    }
  };
  return (
    <>
      <audio src={song} crossOrigin="anonymous" ref={audioRef} />
      {started ? (
        <section
          className="h-screen text-white transition-all duration-200"
          style={{ backgroundColor: `var(--${bgColor})` }}
        >
          <div className="flex flex-col h-full w-full justify-between text-center py-10">
            <h2>{temp}°C</h2>
            <h2 className="text-8xl font-semibold">{year}</h2>
            <div className="flex flex-col items-center ">
              <canvas width={700} height={700} ref={canvasRef} />
            </div>
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
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-5xl font-semibold">
            Welcome to the Sound of Temperature
          </h1>
          <button
            onClick={handleStart}
            className="mt-10 bg-white px-10 py-5 rounded-full"
          >
            Start
          </button>
        </div>
      )}
    </>
  );
}
export default App;
