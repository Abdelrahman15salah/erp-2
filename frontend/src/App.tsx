import React, { useRef } from 'react';
import { Container, Tab, Tabs, Box } from '@mui/material';
import CostEntryForm from './components/CostEntryForm';
import CostEntryList from './components/CostEntryList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceReminders from './components/InvoiceReminders';

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
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Cost Entry" />
          <Tab label="Invoice" />
          <Tab label="Reminders" />
        </Tabs>
      </Box>
      {value === 0 && (
        <>
          <CostEntryForm onEntryAdded={handleCostEntryAdded} />
          <CostEntryList ref={costEntryListRef} />
        </>
      )}
      {value === 1 && <InvoiceForm />}
      {value === 2 && <InvoiceReminders />}
    </Container>
  );
}

export default App;
