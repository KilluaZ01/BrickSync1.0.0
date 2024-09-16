import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Spinner } from "flowbite-react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

const CumulativeCashFlowChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/financial/getDailySummary");
        const data = await response.json();

        if (response.ok && data.data) {
          // Process the data
          const labels = data.data.map((item) => item.day);
          const revenueData = data.data.map((item) => item.revenue);
          const expensesData = data.data.map((item) => item.expenses);
          const profitData = data.data.map((item) => item.profit);

          // Calculate cumulative sums
          const cumulativeRevenue = revenueData.reduce((acc, value, index) => {
            acc.push((acc[index - 1] || 0) + value);
            return acc;
          }, []);

          const cumulativeExpenses = expensesData.reduce(
            (acc, value, index) => {
              acc.push((acc[index - 1] || 0) + value);
              return acc;
            },
            []
          );

          const cumulativeProfit = profitData.reduce((acc, value, index) => {
            acc.push((acc[index - 1] || 0) + value);
            return acc;
          }, []);

          // Set chart data
          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Cumulative Revenue",
                data: cumulativeRevenue,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: false,
              },
              {
                label: "Cumulative Expenses",
                data: cumulativeExpenses,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
              },
              {
                label: "Cumulative Profit",
                data: cumulativeProfit,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: false,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner color="success" />
      </div>
    );
  }

  return (
    <div className="h-auto w-auto p-2">
      {chartData && (
        <Line
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Cumulative Amount",
                },
                beginAtZero: true,
              },
            },
            maintainAspectRatio: false,
          }}
        />
      )}
    </div>
  );
};

export default CumulativeCashFlowChart;
