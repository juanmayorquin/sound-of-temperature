import { data } from "./data/temp_data";
import { useEffect, useRef, useState } from "react";
import frioGod from "/sounds/frio_god.mp3";
import fresco from "/sounds/fresco.mp3";
import forest from "/sounds/forest.mp3";
import fire from "/sounds/fire.mp3";
import fireSjj from "/sounds/fire_sjj.mp3";

let audioContext;
let source;
let analyser;


function Button({ year, handleStart }) {
  return (
    <button
      onClick={() => handleStart(year)}
      className="px-8 py-3 rounded-full bg-green-900 text-white hover:bg-green-800 transition-all"
    >
      {year}
    </button>
  )

}

function App() {

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const decades = [1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  const [year, setYear] = useState(null);
  const [temp, setTemp] = useState(null);
  const [width, setWidth] = useState(null);
  const [month, setMonth] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);
  const [song, setSong] = useState(null);
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

  const handleStart = (year) => {
    if (audioRef.current) {
      setYear(year);
      const yearData = data.find((d) => d.year == year);
      setMonth(0);
      setTemp(yearData.temperatures[0]);
      console.log(yearData);
      setBgColor(calculateBgColor(yearData.temperatures[0]));
      calculateSong(yearData.temperatures[0]);

      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaElementSource(audioRef.current);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      audioRef.current.oncanplaythrough = () => {
        audioRef.current.play();
      };
      setStarted(true);
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      console.error("Audio element not ready");
    }
  };

  const handleMonthChange = (where) => {
    let yearData = data.find((d) => d.year == year);
    if (where === "prev") {
      if (month === 0) {
        yearData = data.find((d) => d.year == year - 1);
        setMonth(11);
        setYear(year - 1)
        calculateSong(yearData.temperatures[11]);
        setTemp(yearData.temperatures[11]);
        setBgColor(calculateBgColor(yearData.temperatures[11]));
      } else {
        setMonth(month - 1);
        calculateSong(yearData.temperatures[month - 1]);
        setTemp(yearData.temperatures[month - 1]);
        setBgColor(calculateBgColor(yearData.temperatures[month - 1]));
      }
    }
    else if (where === "next") {
      if (month === 11) {
        yearData = data.find((d) => d.year == year + 1);
        setMonth(0);
        setYear(year + 1)
        calculateSong(yearData.temperatures[0]);
        setTemp(yearData.temperatures[0]);
        setBgColor(calculateBgColor(yearData.temperatures[0]));
      } else {
        setMonth(month + 1);
        calculateSong(yearData.temperatures[month + 1]);
        setTemp(yearData.temperatures[month + 1]);
        setBgColor(calculateBgColor(yearData.temperatures[month + 1]));
      }
    }
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setYear(newYear);
    const yearData = data.find((d) => d.year == newYear);
    console.log(yearData);
    if (yearData) {
      setTemp(yearData.temperatures[month]);
      setBgColor(calculateBgColor(yearData.temperatures[month]));
    }
    calculateSong(yearData.temperatures[month]);
  };

  const calculateSong = (temperature) => {
    audioRef.current.pause();
    if (temperature != null) {
      if (temperature >= 0.7) {

        setSong(fireSjj);
      } else if (0.36 <= temperature && temperature < 0.7) {
        setSong(fire);
      } else if (0.05 <= temperature && temperature < 0.36) {
        setSong(forest);
      } else if (-0.17 <= temperature && temperature < 0.05) {
        setSong(fresco);
      } else if (temperature < -0.17) {
        setSong(frioGod);
      }
    }
    else {
      setSong(null);
    }
    audioRef.current.load();
    audioRef.current.oncanplaythrough = () => {
      audioRef.current.play();
    };
  };

  const calculateBgColor = (temperature) => {
    if (temperature != null) {
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
    } else {
      return "gray";
    }
  };


  useEffect(()=>{
    setWidth(window.innerWidth)
    if(window.innerWidth > 1024){
      setWidth(700)
    }
    else if(window.innerWidth > 768){
      setWidth(500)
    }
    else if(window.innerWidth > 640){
      setWidth(400)
    }
    else if(window.innerWidth > 480){
      setWidth(300)
    }
  },[width])
  return (
    <>
      <audio src={song} crossOrigin="anonymous" ref={audioRef} loop />
      {started ? (
        <section
          className="h-screen text-white transition-all duration-200"
          style={{ backgroundColor: `var(--${bgColor})` }}
        >
          <div className="flex flex-col h-full w-full justify-between  text-center py-10">
            <h2>{temp > 0 && "+"}{temp}{temp != null ? "°C" : "Registro no disponible"}</h2>
            <div className="flex gap-7 justify-center items-center">
              <button id="prev" onClick={() => handleMonthChange("prev")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-caret-left-filled" width={60} height={60} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" strokeWidth={0} fill="currentColor" />
                </svg>
              </button>
              <h2 className="text-2xl lg:text-8xl font-semibold lg:w-[500px]">{months[month]}, {year}</h2>
              <button id="next" onClick={() => handleMonthChange("next")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-caret-right-filled" width={60} height={60} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" strokeWidth={0} fill="currentColor" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center ">
              <canvas width={width} height={width} ref={canvasRef} />
            </div>
            <input
              id="myinput"
              type="range"
              min="1880"
              max="2023"
              value={year}
              onChange={handleYearChange}
              className="max-w-5xl w-10/12 mx-auto h-10"
            />
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-10 items-center justify-center h-screen text-center">
          <h1 className="text-3xl md:text-5xl">
            Welcome to the <br/> <span className="font-semibold text-forest_green-600">Sound of Temperature</span>
          </h1>
          <div className="flex flex-wrap w-full max-w-6xl gap-2 justify-center p-1">
            {decades.map((decade) => (
              <Button key={decade} year={decade} handleStart={handleStart} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
export default App;