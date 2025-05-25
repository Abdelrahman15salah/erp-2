import React, { useRef } from 'react';
import { Container, Tab, Tabs, Box, AppBar, Toolbar, Typography, ThemeProvider, createTheme, CssBaseline, Paper } from '@mui/material';
import CostEntryForm from './components/CostEntryForm';
import CostEntryList from './components/CostEntryList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceReminders from './components/InvoiceReminders';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [value, setValue] = React.useState(0);
  const costEntryListRef = useRef<{ fetchCostEntries: () => void }>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCostEntryAdded = () => {
    if (costEntryListRef.current) {
      costEntryListRef.current.fetchCostEntries();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ERP System
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
            <Tabs 
              value={value} 
              onChange={handleChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label="Cost Entry" />
              <Tab label="Invoice" />
              <Tab label="Reminders" />
            </Tabs>
          </Paper>

          <Box sx={{ mt: 3 }}>
            {value === 0 && (
              <>
                <CostEntryForm onEntryAdded={handleCostEntryAdded} />
                <CostEntryList ref={costEntryListRef} />
              </>
            )}
            {value === 1 && <InvoiceForm />}
            {value === 2 && <InvoiceReminders />}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
