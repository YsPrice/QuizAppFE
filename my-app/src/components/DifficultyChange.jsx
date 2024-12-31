import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const DifficultyToggle = ({ difficulty, setDifficulty }) => {
  const difficulties = [
    { level: "EASY", color: "success" }, // Green
    { level: "MEDIUM", color: "warning" }, // Yellow
    { level: "HARD", color: "error" }, // Red
  ];

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2, gap: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Difficulty:
      </Typography>
      {difficulties.map(({ level, color }) => (

        <Button
          key={level}
          variant={difficulty === level ? "contained" : "outlined"}
          color={difficulty === level ? color : "default"}
          onClick={() => handleDifficultyChange(level)}
        >
          {level}
        </Button>
      ))}
    </Box>
  );
};


export default DifficultyToggle