import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Input,
} from '@mui/material';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Chart = () => {
  const [chartData, setChartData] = useState({
    totalIncome: 0,
    totalSquareFeet: 0,
    propertyOccupancy: 0,
    monthlyData: [
      { month: 'January', totalSquareFeet: 5000, occupiedSquareFeet: 4000 },
      { month: 'February', totalSquareFeet: 6000, occupiedSquareFeet: 5000 },
      { month: 'March', totalSquareFeet: 5500, occupiedSquareFeet: 4800 },
      { month: 'April', totalSquareFeet: 7000, occupiedSquareFeet: 6000 },
      { month: 'May', totalSquareFeet: 6500, occupiedSquareFeet: 5500 },
    ],
    weeklyData: [
      // Example weekly data
      { week: 'Week 1', totalSquareFeet: 1500, occupiedSquareFeet: 1200 },
      { week: 'Week 2', totalSquareFeet: 1600, occupiedSquareFeet: 1400 },
      { week: 'Week 3', totalSquareFeet: 1400, occupiedSquareFeet: 1300 },
      { week: 'Week 4', totalSquareFeet: 1700, occupiedSquareFeet: 1600 },
    ],
    currentData: { totalSquareFeet: 5500, occupiedSquareFeet: 4800 }, // Current data
  });
  
  const [timePeriod, setTimePeriod] = useState('monthly'); // Default time period: monthly

  useEffect(() => {
    // Fetch the data (Replace with your API call or dynamic logic)
    const fetchData = async () => {
      try {
        const data = {
          totalIncome: 10000, // Example data
          totalSquareFeet: 5000, // Example data
          propertyOccupancy: 75, // Example data (in percentage)
        };
        setChartData((prevData) => ({ ...prevData, ...data }));
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  // Filter the data based on selected time period
  const getFilteredData = () => {
    if (timePeriod === 'weekly') {
      return chartData.weeklyData;
    }
    if (timePeriod === 'current') {
      return [chartData.currentData];
    }
    return chartData.monthlyData; // Default to monthly
  };

  const filteredData = getFilteredData();

  // Bar chart data configuration
  const barData = {
    labels: filteredData.map((item) => item.month || item.week),
    datasets: [
      {
        label: 'Total Square Feet Created',
        data: filteredData.map((item) => item.totalSquareFeet),
        backgroundColor: '#FF9800',
        borderWidth: 1,
      },
      {
        label: 'Square Footage Booked (Occupied)',
        data: filteredData.map((item) => item.occupiedSquareFeet),
        backgroundColor: '#2196F3',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.dataset.label;
            const value = tooltipItem.raw;
            return `${label}: ${value} sq ft`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const progressData = [
    { label: 'Total Income', value: chartData.totalIncome, maxValue: 20000 },
    { label: 'Total Square Feet', value: chartData.totalSquareFeet, maxValue: 10000 },
    { label: 'Property Occupancy', value: chartData.propertyOccupancy, maxValue: 100 },
  ];

  return (
    <Grid container spacing={4} alignItems="flex-start" sx={{ mt: 3 }}>
      {/* Time Period Dropdown */}
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="time-period-label">Select Time Period</InputLabel>
          <Select
            labelId="time-period-label"
            value={timePeriod}
            label="Select Time Period"
            onChange={handleTimePeriodChange}
          >
            
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="current">Current</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Bar Chart Section */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Metrics Comparison (Bar Chart)
            </Typography>
            <Bar data={barData} options={barOptions} />
          </CardContent>
        </Card>
      </Grid>

      {/* Circular Progress Bars Below Bar Chart */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Circular Progress Overview
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {progressData.map((item, index) => (
                <Grid item xs={4} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgressbar
                      value={(item.value / item.maxValue) * 100}
                      text={`${Math.round((item.value / item.maxValue) * 100)}%`}
                      styles={buildStyles({
                        textColor: '#000',
                        pathColor: '#4CAF50',
                        trailColor: '#f0f0f0',
                      })}
                    />
                    <Typography sx={{ mt: 2, fontSize: 14, fontWeight: 'bold' }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Table for Metrics Data Below Bar Graph */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Metrics Data (Table)
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time Period</TableCell>
                    <TableCell align="right">Total Square Footage Created</TableCell>
                    <TableCell align="right">Square Footage Booked (Occupied)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.month || row.week}</TableCell>
                      <TableCell align="right">{row.totalSquareFeet}</TableCell>
                      <TableCell align="right">{row.occupiedSquareFeet}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Chart;
