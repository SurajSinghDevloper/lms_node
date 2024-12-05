import https from 'https';
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';

export const startSignalingServer = () => {
    // Determine environment and set up server accordingly
    const isProduction = process.env.ENV_TYPE === 'PROD';
    let server;

    if (isProduction) {
        // Production: Use HTTPS with valid SSL certificates
        server = https.createServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/lmsapp.co.in/fullchain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/lmsapp.co.in/privkey.pem'),
        });
    } else {
        // Development: Use HTTP with self-signed certificate or no SSL
        logger.info('Running in development mode');
        server = http.createServer();  // Use HTTP for local development
    }

    // Set up WebSocket server
    const wss = new WebSocketServer({ server });

    wss.on('connection', (socket) => {
        logger.info('Client connected');

        socket.on('message', (message) => {
            const data = JSON.parse(message);

            if (data.type === 'auth') {
                // Verify JWT token
                try {
                    const payload = jwt.verify(data.token, 'your_secret_key');
                    logger.info(`Authenticated user: ${payload.userId}`);
                } catch (error) {
                    logger.error('Invalid token');
                    socket.close();
                    return;
                }
            } else {
                // Broadcast offer, answer, or ICE candidate to all connected clients
                wss.clients.forEach((client) => {
                    if (client !== socket && client.readyState === WebSocketServer.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });
            }
        });

        socket.on('close', () => logger.info('Client disconnected'));
    });

    // Listen on appropriate port for development and production
    const signalingPort = process.env.SIGNALLING_PORT || (isProduction ? 443 : 3001);
    server.listen(signalingPort, () => {
        const protocol = isProduction ? 'wss' : 'ws';
        logger.info(`${protocol}://localhost:${signalingPort} - Signaling server running`);
    });
};

