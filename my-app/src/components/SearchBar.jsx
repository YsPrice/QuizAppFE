import React from 'react';
import { TextField, MenuItem, Box } from '@mui/material';

export default function SearchBar({ searchTerm, setSearchTerm, sortOption, setSortOption }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
      <TextField
        label="Search Quizzes"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <TextField
        label="Sort By"
        variant="outlined"
        select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        sx={{ width: 200 }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="title">Title</MenuItem>
        <MenuItem value="difficulty">Difficulty</MenuItem>
      </TextField>
    </Box>
  );
}
