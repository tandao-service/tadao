import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getGraphSales } from "@/lib/actions/transactions.actions";

const SalesLineGraph: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<string>("day");
  const [chartData, setChartData] = useState<any>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGraphSales(timeFrame);
        const formattedData = response.map((data: any) => ({
          date: data._id,
          sales: data.totalSales,
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchData();
  }, [timeFrame]);

  const options = {
    chart: {
      id: "Subscriptions-line-chart",
      toolbar: {
        show: false,
      },
      background: isDarkMode ? "#2D3236" : "#ffffff", // Adjust background
    },
    xaxis: {
      categories: chartData.map((data: any) => data.date),
      title: {
        text: timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1),
      },
      labels: {
        style: {
          colors: isDarkMode ? "#e5e7eb" : "#374151", // Text color for dark mode
        },
      },
    },
    yaxis: {
      title: {
        text: "Subscriptions (KES)",
      },
      labels: {
        style: {
          colors: isDarkMode ? "#e5e7eb" : "#374151", // Text color for dark mode
        },
      },
    },
    title: {
      text: "Subscriptions Over Time",
      align: "center",
      style: {
        color: isDarkMode ? "#e5e7eb" : "#374151", // Title color for dark mode
      },
    },
    stroke: {
      curve: "smooth" as "smooth",
    },
    theme: {
      mode: isDarkMode ? "dark" : "light", // Adjust theme mode
    },
  };

  const series = [
    {
      name: "Sales",
      data: chartData.map((data: any) => data.sales),
    },
  ];

  return (
    <div
      className={`p-2 w-full rounded-xl ${
        isDarkMode
          ? "dark:bg-[#2D3236] dark:text-gray-300"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <h2 className="title font-bold m-2">Subscription Line Graph</h2>

      <div className="time-frame-select flex gap-3">
        <button
          className="w-[100px] dark:bg-emerald-700 bg-black text-white text-xs p-1 rounded-sm hover:bg-gray-700"
          onClick={() => setTimeFrame("day")}
        >
          Day
        </button>
        <button
          className="w-[100px] dark:bg-emerald-700 bg-black text-white text-xs p-1 rounded-sm hover:bg-gray-700"
          onClick={() => setTimeFrame("week")}
        >
          Week
        </button>
        <button
          className="w-[100px] dark:bg-emerald-700 bg-black text-white text-xs p-1 rounded-sm hover:bg-gray-700"
          onClick={() => setTimeFrame("month")}
        >
          Month
        </button>
      </div>

      <ReactApexChart
        options={options as any}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default SalesLineGraph;
