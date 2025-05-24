import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cost-entries`, {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date)
      });
      alert('Cost entry added successfully!');
      setFormData({ category: '', amount: '', date: '', description: '' });
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (error) {
      console.error('Error adding cost entry:', error);
      alert('Error adding cost entry');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Cost Entry
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Cost Entry
        </Button>
      </form>
    </Box>
  );
};

export default CostEntryForm; 