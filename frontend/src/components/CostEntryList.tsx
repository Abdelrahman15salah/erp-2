import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Chip, CircularProgress, Alert } from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCostEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cost-entries`);
      setCostEntries(response.data);
    } catch (error) {
      console.error('Error fetching cost entries:', error);
      setError('Error fetching cost entries');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchCostEntries
  }));

  useEffect(() => {
    fetchCostEntries();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Cost Entries
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : costEntries.length === 0 ? (
        <Alert severity="info">
          No cost entries found
        </Alert>
      ) : (
        <List>
          {costEntries.map((entry) => (
            <Paper
              key={entry._id}
              elevation={0}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" component="span">
                        {entry.category}
                      </Typography>
                      <Chip
                        label={formatCurrency(entry.amount)}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.description}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Paper>
  );
});

export default CostEntryList; 