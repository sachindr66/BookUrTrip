import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend with CORS 🚀");
});

// Test busBook route directly
app.post('/busBook', (req, res) => {
  console.log('BusBook route hit!');
  console.log('Request body:', req.body);
  res.json({ message: 'BusBook route is working!', receivedData: req.body });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 Test busBook at: http://localhost:${PORT}/busBook`);
  console.log(`🏠 Home page: http://localhost:${PORT}/`);
});

