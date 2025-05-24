# Cost Management System

A full-stack application for managing costs, invoices, and reminders built with NestJS, MongoDB, and React.

## Features

- Cost entry management
- Invoice generation and management
- Due date reminders
- Tax calculations
- Modern UI with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Project Structure

```
├── backend/           # NestJS backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── config/
│   └── .env          # Environment variables (create from .env.example)
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   └── App.tsx
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string and other configurations.

5. Start the development server:

```bash
npm run start:dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## API Endpoints

### Cost Entries

- `POST /cost-entries` - Create a new cost entry
- `GET /cost-entries` - Get all cost entries
- `GET /cost-entries/:id` - Get a specific cost entry
- `PUT /cost-entries/:id` - Update a cost entry

### Invoices

- `POST /invoices` - Create a new invoice
- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get a specific invoice
- `PUT /invoices/:id` - Update an invoice
- `POST /invoices/calculate-tax` - Calculate tax
- `GET /invoices/reminders/due` - Get due reminders
- `POST /invoices/reminders/:id/send` - Send a reminder

## Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
