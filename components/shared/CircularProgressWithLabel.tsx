import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface CircularProgressWithLabelProps {
  value: number; // Progress value (percentage)
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
}) => {
  return (
    <Box position="relative" display="inline-flex">
      {/* CircularProgress component */}
      <CircularProgress
        sx={{ color: "#30D32C" }}
        size={30}
        variant="determinate"
        value={value}
      />

      {/* Text inside the CircularProgress */}
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          className="text-[10px] font-bold"
          component="div"
          color="#30D32C"
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
