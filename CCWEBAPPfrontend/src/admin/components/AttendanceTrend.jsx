import React, { useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Chart from 'chart.js/auto';

function AttendanceTrend({ attendanceData, isExpanded, onToggle }) {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  useEffect(() => {
    if (chartRef.current && isExpanded) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Prepare data for the chart
      const days = Object.keys(attendanceData).map(Number);
      const presentDays = days.filter(day => attendanceData[day]);
      
      // Get current week
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentWeek = Math.floor((currentDay - 1) / 7);
      
      // Group by week
      const weeklyData = Array(5).fill(0); // 5 weeks in a month
      presentDays.forEach(day => {
        const week = Math.floor((day - 1) / 7);
        weeklyData[week]++;
      });

      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [{
            label: 'Days Present',
            data: weeklyData,
            borderColor: weeklyData.map((_, index) => 
              index < currentWeek ? 'rgb(34, 197, 94)' : 
              index === currentWeek ? 'rgb(59, 130, 246)' : 
              'rgb(59, 130, 246)'
            ),
            borderDash: weeklyData.map((_, index) => 
              index < currentWeek ? [] : 
              index === currentWeek ? [5, 5] : 
              [5, 5]
            ),
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 7,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [attendanceData, isExpanded]);

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="text-sm font-medium text-gray-500">Weekly Attendance Trend</div>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </div>

      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="h-48">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceTrend; 