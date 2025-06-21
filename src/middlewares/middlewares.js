import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import express from "express";

export const configureMiddleware = (app) => {
  // Security middleware
  app.use(helmet());

  // CORS middleware with dynamic origin based on environment
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://selva-nail-shop.vercel.app"],
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });
  app.use("/api/", limiter);

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  app.use(morgan("combined"));
};
