import React, { useState, useEffect } from "react";
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";
import axios from "axios";

ChartJS.register(
  annotationPlugin,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PopulationBarChart = React.memo((props) => {
  const [yearData, setYearData] = useState([]); // Data By Year
  const [yearMin, setYearMin] = useState(1950);
  const [yearMax, setYearMax] = useState(2021);
  const [yearRange, setYearRange] = useState(1950); // Select Year
  const [intervalId, setIntervalId] = useState(null); // Play delay
  const yearArray = Array.from(
    { length: yearMax - yearMin + 1 },
    (_, index) => yearMin + index
  );
  const [deactiveRegions, setDeactiveRegions] = useState([]);
  const regions = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
  const regionColorsTab = [
    'bg-[#36a2eb99]', // Asia
    'bg-[#4bc0c099]', // Europe
    'bg-[#ffce5699]', // North America
    'bg-[#9966ff99]', // South America
    'bg-[#ff638499]', // Africa
    'bg-[#ff9f4099]'  // Oceania
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deactiveRegionsStr = deactiveRegions.join(",");
        const response = await axios.get(
          `https://api.planetcloud.cloud/testapisgn/api/barchart?limit=12&sort=Population&sort_type=-1&filter=Year&filter_value=${yearRange}&disabled_regions=${deactiveRegionsStr}`
        );
        const data = response.data;
        if (!data || data.length === 0) {
          console.error("Empty or undefined data received from API");
          return;
        }
        setYearData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [deactiveRegions, yearRange]);

  const regionColors = {
    'Asia': 'rgba(54, 162, 235, 0.6)',
    'Europe': 'rgba(75, 192, 192, 0.6)',
    'North America': 'rgba(255, 206, 86, 0.6)',
    'South America': 'rgba(153, 102, 255, 0.6)',
    'Africa': 'rgba(255, 99, 132, 0.6)',
    'Oceania': 'rgba(255, 159, 64, 0.6)'
  };
  
  const getColorForRegion = (region) => regionColors[region] || 'rgba(0, 0, 0, 0.1)';

  const BarChart =
    Object.keys(yearData).length !== 0 ? (
      <Bar
        options={{
          indexAxis: "y",
          elements: {
            bar: {
              // borderWidth: 0,
            },
          },
          plugins: {
            datalabels: {
              display: true,
              color: "black",
              align: "end",
              anchor: "end",
              font: { size: "14" },
            },
            annotation: {
              annotations: {
                label1: {
                  type: "label",
                  xValue: "center",
                  yValue: 9,
                  backgroundColor: "rgba(245,245,245,0)",
                  content: [yearRange],
                  font: {
                    size: 60,
                  },
                },
                label2: {
                  type: "label",
                  xValue: "center",
                  yValue: 10,
                  backgroundColor: "rgba(245,245,245,0)",
                  content: [`Total:  ${yearData.reduce((total, item) => total + item["Population"], 0).toLocaleString()}`],
                  font: {
                    size: 40,
                  },
                },
              },
            },
            legend: {
              display: false,
            },
            title: {
              display: false,
              text: "Chart.js Horizontal Bar Chart",
            },
          },
        }}
        data={{
          labels: yearData.map((item) => item["Country name"]),
          datasets: [
            {
              label: "Population",
              data: yearData.map((item) => item["Population"]),
              backgroundColor: yearData.map(item => getColorForRegion(item["Region"])),
              borderColor: yearData.map(item => getColorForRegion(item["Region"]).replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
        }}
        height={100}
      />
    ) : null;

  const handleRegionToggle = (region) => {
    setDeactiveRegions((prevDeactiveRegions) =>
      prevDeactiveRegions.includes(region)
        ? prevDeactiveRegions.filter((r) => r !== region)
        : [...prevDeactiveRegions, region]
    );
  };

  const handleSliderChange = (event) => {
    setYearRange(parseInt(event.target.value));
  };

  const toggleLoop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      const id = setInterval(() => {
        setYearRange((prevYearRange) => {
          if (prevYearRange < yearMax) {
            return prevYearRange + 1;
          } else {
            clearInterval(intervalId);
            return yearMin;
          }
        });
      }, 1000); // Change the dataset every second
      setIntervalId(id);
    }
  };

  return (
    <div id="content-barchart-1" className="mt-4">
      <div className="flex">
        <div className="flex gap-4">
          <p>Region</p>
          {regions.map((region, index) => (
            <button
              className="flex flex-row items-center"
              key={index}
              onClick={() => handleRegionToggle(region)}
            >
              <div className={`w-4 h-4 ${regionColorsTab[index]}`}></div>
              <span
                className={`pl-1 ${
                  deactiveRegions.includes(region) ? "line-through" : ""
                }`}
              >
                {region}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-10 static">{BarChart}</div>
      {BarChart && (
        <div className="flex gap-4 w-full justify-center mt-4">
          <button
            className="w-10 h-10 rounded-full bg-blue-500 focus:outline-none"
            onClick={toggleLoop}
          >
            {intervalId ? (
              <FaRegCirclePause size={40} />
            ) : (
              <FaRegCirclePlay size={40} />
            )}
          </button>
          <div class="flex  w-8/12 flex-col text-slate-700 dark:text-slate-300">
            <input
              id="rangeSlider"
              type="range"
              class="z-10 mb-1 mt-4 h-2 w-full appearance-none bg-slate-100 focus:outline-blue-700 dark:bg-slate-800 dark:focus:outline-blue-600 [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-blue-700 active:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:dark:bg-blue-600 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-blue-700 [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:dark:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full rounded-full"
              value={yearRange}
              min={yearMin}
              max={yearMax}
              step="1"
              onChange={handleSliderChange}
              className="bg-black hover:bg-white"
            />
            <div class="flex items-center justify-between px-2 text-center text-slate-700 dark:text-slate-300">
              <span
                class="w-0 -translate-x-1 text-xs even:hidden md:even:inline-block"
                aria-hidden="true"
              >
                {yearMin}
              </span>
              {yearArray.map((item, index) => {
                if (item !== yearMin && item !== yearMax) {
                  return index % 5 === 0 ? (
                    <span
                      key={index}
                      className="text-xs font-bold opacity-50 even:hidden md:even:inline-block"
                      aria-hidden="true"
                    >
                      {item}
                    </span>
                  ) : (
                    <span
                      key={index}
                      className="text-xs font-bold opacity-50 even:hidden md:even:inline-block"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  );
                }
                return null;
              })}
              <span
                class="w-0 -translate-x-2 text-xs even:hidden md:even:inline-block"
                aria-hidden="true"
              >
                {yearMax}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default PopulationBarChart;
