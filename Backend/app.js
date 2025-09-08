import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/busRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from backend with CORS 🚀");
});

app.use('/',router)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
