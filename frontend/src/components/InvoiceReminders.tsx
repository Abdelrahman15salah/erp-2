import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Alert, Paper, Chip, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

interface ClientContact {
  email: string;
  phone: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientContact: ClientContact;
  total: number;
  dueDate: string;
  status: string;
  lastReminderSent?: string;
}

const InvoiceReminders = () => {
  const [dueInvoices, setDueInvoices] = useState<Invoice[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  const fetchDueInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/invoices/reminders/due');
      setDueInvoices(response.data);
    } catch (error) {
      console.error('Error fetching due invoices:', error);
      setMessage({ type: 'error', text: 'Error fetching due invoices' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueInvoices();
  }, []);

  const handleSendReminder = async (invoiceId: string) => {
    setSendingReminder(invoiceId);
    try {
      const response = await axios.post(`http://localhost:3000/invoices/reminders/${invoiceId}/send`);
      setMessage({ type: 'success', text: response.data.message });
      // Refresh the list to update lastReminderSent
      fetchDueInvoices();
    } catch (error) {
      console.error('Error sending reminder:', error);
      setMessage({ type: 'error', text: 'Error sending reminder' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSendingReminder(null);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Invoice Reminders
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchDueInvoices}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : dueInvoices.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No due invoices found
        </Alert>
      ) : (
        <List>
          {dueInvoices.map((invoice) => (
            <Paper
              key={invoice._id}
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
              <ListItem
                disablePadding
                secondaryAction={
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={sendingReminder === invoice._id ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={() => handleSendReminder(invoice._id)}
                    disabled={sendingReminder === invoice._id}
                  >
                    Send Reminder
                  </Button>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" component="span">
                        Invoice #{invoice.invoiceNumber}
                      </Typography>
                      <Chip
                        label={invoice.status}
                        size="small"
                        color={getStatusColor(invoice.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Client: {invoice.clientName} ({invoice.clientId})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contact: {invoice.clientContact?.email || 'N/A'} | {invoice.clientContact?.phone || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount: ${(invoice.total || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: {formatDate(invoice.dueDate)}
                      </Typography>
                      {invoice.lastReminderSent && (
                        <Typography variant="body2" color="text.secondary">
                          Last Reminder: {formatDate(invoice.lastReminderSent)}
                        </Typography>
                      )}
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
};

export default InvoiceReminders; 