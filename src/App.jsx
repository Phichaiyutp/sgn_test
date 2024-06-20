import React, { useState } from "react";
import PopulationBarChart from "./components/chart/NewBarChart";
function App() {


  return (
    <div className="mt-10 ml-10">
      <div id="title-barchart-1">
        <p className="text-4xl">Population growth per country, 1950 to 2021</p>
        <p className="text-xl">
          Click on the legend below to filter by continent &#128071;
        </p>
      </div>
      <PopulationBarChart />
    </div>
  );
}

export default App;