import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Alert } from '@mui/material';
import axios from 'axios';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  dueDate: string;
  status: string;
}

const InvoiceReminders = () => {
  const [dueInvoices, setDueInvoices] = useState<Invoice[]>([]);
  const [message, setMessage] = useState('');

  const fetchDueInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/invoices/reminders/due');
      setDueInvoices(response.data);
    } catch (error) {
      console.error('Error fetching due invoices:', error);
    }
  };

  useEffect(() => {
    fetchDueInvoices();
  }, []);

  const handleSendReminder = async (invoiceId: string) => {
    try {
      const response = await axios.post(`http://localhost:3000/invoices/reminders/${invoiceId}/send`);
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error sending reminder:', error);
      setMessage('Error sending reminder');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Invoice Reminders
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <List>
        {dueInvoices.map((invoice) => (
          <ListItem
            key={invoice._id}
            secondaryAction={
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSendReminder(invoice._id)}
              >
                Send Reminder
              </Button>
            }
          >
            <ListItemText
              primary={`Invoice #${invoice.invoiceNumber}`}
              secondary={`Client: ${invoice.clientId} - Due: ${new Date(invoice.dueDate).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default InvoiceReminders; 