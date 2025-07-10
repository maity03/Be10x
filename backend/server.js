import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/mongoDb.js";
import authRoutes from "./routes/authRoutes.js";
import fundRoutes from "./routes/fundRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://be10x.onrender.com",
    credentials: true,
  })
);

await connectDB();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
// Wildcard route for SPA (must come last, only for non-API requests)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
