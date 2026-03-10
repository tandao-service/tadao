"use client"; // don't forget this part if you use app dir to mark the whole
// file as client-side components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface PieChartProps {
  title: string;
  value: number;
  series: Array<number>;
  colors: Array<string>;
}
const PieChart = ({ title, value, series, colors }: PieChartProps) => {
  return (
    <Box
      id="chart"
      flex={1}
      display="flex"
      bgcolor="#F3F3F3"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      pl={3.5}
      py={2}
      gap={2}
      borderRadius="15px"
      minHeight="110px"
      width="fit-content"
    >
      <Stack direction="column">
        <Typography fontSize={14} color="#808191">
          {title}
        </Typography>
        <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
          {value}
        </Typography>
      </Stack>
      <ApexChart
        type="donut"
        options={{
          chart: { type: "donut" },
          colors: colors,
          legend: { show: false },
          dataLabels: { enabled: false },
        }}
        series={series}
        height={"100px"}
        width={"100px"}
      />
    </Box>
  );
};

export default PieChart;
