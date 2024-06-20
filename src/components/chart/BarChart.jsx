import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      //borderWidth: 0,
    },
  },
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      align: "end",
      anchor: "end",
      font: { size: "14" }
    },
    legend: {
      position: 'top',
      //display: false
    },
    title: {
      display: false,
      text: 'Chart.js Horizontal Bar Chart',
    },
  },
};

const labels = ['testJanuary', 'testFebruary', 'testMarch', 'testApril', 'testMay', 'testJune', 'testJuly'];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomData = () => {
  return labels.map(() => getRndInteger(0, 1000));
};

const generateAllData = () => {
  return Array.from({ length: 5 }, () => ({
    labels,
    datasets: [
      {
        label: 'Asia',
        data: generateRandomData(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Europe',
        data: generateRandomData(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Africa',
        data: generateRandomData(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Oceania',
        data: generateRandomData(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Americas',
        data: generateRandomData(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  }));
};

function BarChart(activeRegions) {
  console.log(activeRegions)
  const allData = generateAllData();
  const [dataIndex, setDataIndex] = useState(0);
  const [data, setData] = useState(allData[dataIndex]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    setData(allData[dataIndex]);
    console.log(data)
  }, [dataIndex]);

  const handleSliderChange = (event) => {
    setDataIndex(parseInt(event.target.value));
  };

  const toggleLoop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      const id = setInterval(() => {
        setDataIndex((prevIndex) => (prevIndex + 1) % allData.length);
      }, 1000); // Change the dataset every second
      setIntervalId(id);
    }
  };

  return (
    <div>
      <Bar options={options} data={data} height={100} />
      <input
        type="range"
        min="0"
        max="4"
        value={dataIndex}
        onChange={handleSliderChange}
        step="1"
      />
      <p>Current Dataset: {dataIndex + 1}</p>
      <button onClick={toggleLoop}>
        {intervalId ? 'Play time-lapse' : 'Pause time-lapse'}
      </button>
    </div>
  );
}

export default BarChart;
