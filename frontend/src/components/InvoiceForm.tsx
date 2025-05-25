import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, Paper, Divider, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/invoices', {
        ...formData,
        dueDate: new Date(formData.dueDate)
      });
      setMessage({ type: 'success', text: 'Invoice created successfully!' });
      setFormData({
        clientId: '',
        items: [{ name: '', quantity: 1, unitPrice: 0 }],
        tax: 0,
        discount: 0,
        dueDate: ''
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setMessage({ type: 'error', text: 'Error creating invoice' });
      setTimeout(() => setMessage(null), 3000);
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

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * formData.tax) / 100;
    return subtotal + taxAmount - formData.discount;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Create Invoice
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Client ID"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          {formData.items.map((item, index) => (
            <Paper key={index} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    required
                  />
                </Box>
                <Box sx={{ flex: '0 1 100px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    required
                  />
                </Box>
                <Box sx={{ flex: '0 1 150px', minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Unit Price"
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                    required
                  />
                </Box>
                <Box sx={{ flex: '0 0 auto' }}>
                  <IconButton 
                    onClick={() => removeItem(index)} 
                    color="error"
                    disabled={formData.items.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addItem}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add Item
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Tax Rate (%)"
              name="tax"
              type="number"
              value={formData.tax}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Subtotal: ${calculateSubtotal().toFixed(2)}
              </Typography>
              <Typography variant="h6">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Create Invoice
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default InvoiceForm; 