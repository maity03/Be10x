import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/mongoDb.js";
import authRoutes from "./routes/authRoutes.js";
import fundRoutes from "./routes/fundRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

dotenv.config();
await connectDB();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);

app.get("/", (req, res) => {
  res.send("Hello i am working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
