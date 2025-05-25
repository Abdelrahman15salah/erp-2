import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import axios from 'axios';

interface CostEntryFormProps {
  onEntryAdded?: () => void;
}

const CostEntryForm: React.FC<CostEntryFormProps> = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cost-entries`, {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date)
      });
      setMessage({ type: 'success', text: 'Cost entry added successfully!' });
      setFormData({ category: '', amount: '', date: '', description: '' });
      if (onEntryAdded) {
        onEntryAdded();
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding cost entry:', error);
      setMessage({ type: 'error', text: 'Error adding cost entry' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Add Cost Entry
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Add Cost Entry
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CostEntryForm; 