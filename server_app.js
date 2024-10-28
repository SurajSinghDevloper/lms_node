const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const { logger, morganMiddleware } = require('./src/config/logger');
const routes = require('./src/main_routes/index');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');

const app = express();
app.use(express.json());

app.use(morganMiddleware);
// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

app.use('/api/v1/lmsb', routes);
// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start Server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
