import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

interface CostEntry {
  _id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface CostEntryListRef {
  fetchCostEntries: () => void;
}

const CostEntryList = forwardRef<CostEntryListRef>((props, ref) => {
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);

  const fetchCostEntries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cost-entries`);
      setCostEntries(response.data);
    } catch (error) {
      console.error('Error fetching cost entries:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchCostEntries
  }));

  useEffect(() => {
    fetchCostEntries();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Cost Entries
      </Typography>
      <Paper elevation={2}>
        <List>
          {costEntries.map((entry) => (
            <ListItem key={entry._id}>
              <ListItemText
                primary={`${entry.category} - $${entry.amount}`}
                secondary={`${new Date(entry.date).toLocaleDateString()} - ${entry.description}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
});

export default CostEntryList; 