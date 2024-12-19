import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  Typography,
  Grid,
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
} from '@mui/material';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import moment from 'moment';
import config from "../config/ServiceApi";
import Loader from '../components/Loader/Loader'; 
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Chart = () => {
  const [chartData, setChartData] = useState({
    monthlyData: [],
  });

  const [timePeriod, setTimePeriod] = useState('monthly');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert('No token found. Please log in again.');
          return;
        }


        const occupancyResponse = await fetch(
           `${config.baseURL}${config.graphoccupancy}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const occupancyData = await occupancyResponse.json();

      
        const squareFootageResponse = await fetch(
          `${config.baseURL}${config.graphsquarefootage}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const squareFootageData = await squareFootageResponse.json();

        // Normalize and merge data based on date
        const mergedData = occupancyData
          .filter((item) => item.date) // Exclude null dates
          .map((occupancyItem) => {
            const formattedDate = moment(occupancyItem.date, 'DD-MM-YY').format(
              'YYYY-MM-DD'
            );
            const matchingSquareFootage = squareFootageData.find(
              (squareFootageItem) =>
                moment(squareFootageItem.date, 'DD-MM-YYYY').format(
                  'YYYY-MM-DD'
                ) === formattedDate
            );
            return {
              date: formattedDate,
              totalOccupancy: occupancyItem.totalOccupancy || 0,
              totalSquareFootage:
                matchingSquareFootage?.totalSquareFootage || 0,
            };
          });

        setChartData({ monthlyData: mergedData });
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const getFilteredData = () => {
    if (timePeriod === 'weekly') {
      return [];
    }
    if (timePeriod === 'current') {
      return [];
    }
    return chartData.monthlyData;
  };

  const filteredData = getFilteredData();


//   var a = 5.678948;
// let b = 10.257683;

// let result2 = b.toFixed(2);
// console.log(result1);
// console.log(result2);
  // Bar chart data configuration
  const barData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: 'Total Square Footage Created',
        data: filteredData.map((item) => item.totalSquareFootage),
        backgroundColor: '#FF9800', // Softer, contrasting color
        yAxisID: 'y1',
      },
      {
        label: 'Square Footage Booked (Occupied)',
        // data: filteredData.map((item) => item.totalOccupancy),
        data: filteredData.map((item) =>
          item.totalOccupancy ? item.totalOccupancy.toFixed(2) : '0.00'
        ),
        backgroundColor: '#2196F3', // Soft blue for contrast
        yAxisID: 'y2',
      
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
        },
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
        grid: {
          display: false, 
        },
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Square Footage (Created)',
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Square Footage (Occupied)',
        },
      },
    },
  };


  if (loading) {
    return <Loader />;
  }


  return (
    <Grid container spacing={4} alignItems="flex-start" sx={{ mt: 3 }}>
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

      <Grid item xs={12}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Metrics Comparison (Bar Chart)
            </Typography>
            <Bar data={barData} options={barOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} container spacing={2}>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
              Square Footage Created
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Square Footage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={row.date}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                      '&:hover': { backgroundColor: '#eaeaea' }, // Hover effect
                    }}
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.totalSquareFootage}  sqft</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
              Booked Square Footage
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Occupancy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={row.date}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                      '&:hover': { backgroundColor: '#eaeaea' }, 
                    }}
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.totalOccupancy ? row.totalOccupancy.toFixed(2) : '0.00'} %</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Chart;
