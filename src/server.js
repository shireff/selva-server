import express from "express";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import servicesRoutes from "./routes/services.js";
import productsRoutes from "./routes/products.js";
import blogRoutes from "./routes/blog.js";
import testimonialsRoutes from "./routes/testimonials.js";
import notificationsRoutes from "./routes/notifications.js";
import { configureSwagger } from "./swagger.js";
import { configureMiddleware } from "./middlewares/middlewares.js";
import { configureErrorHandling } from "./middlewares/errorHandling.js";
import connectDB from "./database.js";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// Swagger configuration
configureSwagger(app, PORT);

// Security middleware
configureMiddleware(app);

// ...existing code...
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://unpkg.com; style-src 'self' https://unpkg.com 'unsafe-inline'"
  );
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/notifications", notificationsRoutes);

// Initialize endpoint for frontend
app.get("/api/initialize", (req, res) => {
  res.json({
    status: "success",
    message: "Application initialized successfully",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
configureErrorHandling(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📚 API Documentation available at http://localhost:${PORT}/api-docs`
  );
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});

export default app;
