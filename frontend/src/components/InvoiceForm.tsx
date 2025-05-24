import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    clientId: '',
    items: [{ name: '', quantity: 1, unitPrice: 0 }] as InvoiceItem[],
    tax: 0,
    discount: 0,
    dueDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/invoices', {
        ...formData,
        dueDate: new Date(formData.dueDate)
      });
      alert('Invoice created successfully!');
      setFormData({
        clientId: '',
        items: [{ name: '', quantity: 1, unitPrice: 0 }],
        tax: 0,
        discount: 0,
        dueDate: ''
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create Invoice
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Client ID"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
        />
        
        {formData.items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <TextField
              label="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            />
            <TextField
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
            />
            <TextField
              label="Unit Price"
              type="number"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
            />
            <IconButton onClick={() => removeItem(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        
        <Button onClick={addItem} sx={{ mt: 2 }}>
          Add Item
        </Button>

        <TextField
          fullWidth
          margin="normal"
          label="Tax Rate (%)"
          name="tax"
          type="number"
          value={formData.tax}
          onChange={handleChange}
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Discount"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleChange}
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Invoice
        </Button>
      </form>
    </Box>
  );
};

export default InvoiceForm; 