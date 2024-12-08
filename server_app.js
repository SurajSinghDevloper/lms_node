import express from "express";
import cors from "cors";
import connectDB from "./src/config/database.js";
import { logger, morganMiddleware } from "./src/config/logger.js";
import routes from "./src/main_routes/index.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";
import { startSignalingServer } from "./src/vcall/signalingServer.js";

const app = express();
app.use(express.json());

app.use(morganMiddleware);
// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

app.use("/api/v1/lmsb", routes);
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

startSignalingServer();

// Start Server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
