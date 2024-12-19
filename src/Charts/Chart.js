




import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
  Box,
} from "@mui/material";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import moment from "moment";
import config from "../config/ServiceApi";
import Loader from "../components/Loader/Loader";
import ConstructionIcon from '@mui/icons-material/Construction';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Chart = () => {
  const [chartData, setChartData] = useState({ monthlyData: [] });
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("No token found. Please log in again.");
          return;
        }

        const occupancyResponse = await fetch(
          `${config.baseURL}${config.graphoccupancy}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const occupancyData = await occupancyResponse.json();

        const squareFootageResponse = await fetch(
          `${config.baseURL}${config.graphsquarefootage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const squareFootageData = await squareFootageResponse.json();

        const mergedData = occupancyData
          .filter((item) => item.date)
          .map((occupancyItem) => {
            const formattedDate = moment(occupancyItem.date, "DD-MM-YY").format(
              "YYYY-MM-DD"
            );
            const matchingSquareFootage = squareFootageData.find(
              (squareFootageItem) =>
                moment(squareFootageItem.date, "DD-MM-YYYY").format(
                  "YYYY-MM-DD"
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
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const getFilteredData = () => {
    if (timePeriod === "weekly") return [];
    if (timePeriod === "current") return [];
    return chartData.monthlyData;
  };

  const filteredData = getFilteredData();

  // Calculate sum of occupancy and square footage
  const totalOccupancy = filteredData.reduce(
    (sum, item) => sum + item.totalOccupancy,
    0
  );
  const totalSquareFootage = filteredData.reduce(
    (sum, item) => sum + item.totalSquareFootage,
    0
  );

  const barData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: "Total Square Footage Created",
        data: filteredData.map((item) => item.totalSquareFootage),
        backgroundColor: "#FF9800",
        yAxisID: "y1",
      },
      {
        label: "Square Footage Booked (Occupied)",
        data: filteredData.map((item) =>
          item.totalOccupancy ? item.totalOccupancy.toFixed(2) : "0.00"
        ),
        backgroundColor: "#2196F3",
        yAxisID: "y2",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y1: { position: "left" },
      y2: { position: "right" },
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

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Card sx={{ boxShadow: 3, backgroundColor: "#fff", p: 1 }}>
            <CardContent>
              <Bar data={barData} options={barOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ boxShadow: 3, backgroundColor: "#fff", p: 4 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ textAlign: "center", color: "#757575", mb: 2 }}
              >
                The colors represent data categories displayed in the chart .
              </Typography>
              <Grid container spacing={4}>
                {barData.datasets.map((dataset, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      sx={{
                        backgroundColor: dataset.backgroundColor,
                        height: 80,
                        width: 100,
                        borderRadius: "10%",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {index === 0 && (
                        <ConstructionIcon sx={{ color: "#fff", fontSize: 32 }} />
                      )}
                      {index === 1 && (
                        <HomeIcon sx={{ color: "#fff", fontSize: 32 }} />
                      )}
                      {index === 2 && (
                        <PersonIcon sx={{ color: "#fff", fontSize: 32 }} />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        mt: 1,
                        fontWeight: "bold",
                      }}
                    >
                    
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "#757575",
                        mt: 0.5,
                      }}
                    >
                      {index === 0
                        ? "Total Square Footage Created"
                        : index === 1
                        ? "Square Footage Booked (Occupied)"
                        : "Other Data"}
                    </Typography>
                    
                  </Grid>
                ))}
              </Grid>
              {/* Display total occupancy and square footage */}
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6">
                  Total Square Footage Created: {totalSquareFootage.toFixed(2)}sqft
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Total Occupancy (Booked): {totalOccupancy.toFixed(2)}%
                </Typography>
                
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 3 }}>
  <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
  
    <Table>
   
      <TableHead>
    
        <TableRow>
          <TableCell sx={{ borderRight: "1px solid #ddd" }}>Date</TableCell>
          <TableCell sx={{ borderRight: "1px solid #ddd" }}>Total Occupancy</TableCell>
          <TableCell>Total Square Footage Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredData.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
              "&:hover": {
                backgroundColor: "#f1f1f1", // Light gray hover color
              },
            }}
          >
            <TableCell sx={{ borderRight: "1px solid #ddd" }}>{row.date}</TableCell>
            <TableCell sx={{ borderRight: "1px solid #ddd" }}>
              {totalOccupancy.toFixed(2)} %
            </TableCell>
            <TableCell>{totalSquareFootage.toFixed(2)} sqft</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Grid>


    </Grid>
  );
};

export default Chart;
