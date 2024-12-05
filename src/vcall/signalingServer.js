import https from 'https';
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

export const startSignalingServer = () => {
    const isProduction = process.env.ENV_TYPE === 'PROD';
    let server;

    if (isProduction) {
        server = https.createServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/lmsapp.co.in/fullchain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/lmsapp.co.in/privkey.pem'),
        });
    } else {
        server = http.createServer();
        logger.info('Running in development mode');
    }

    const wss = new WebSocketServer({ server });

    wss.on('connection', (socket) => {
        socket.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                switch (data.type) {
                    case 'auth':
                        handleAuth(socket, data.token);
                        break;
                    case 'offer':
                        handleOffer(socket, data);
                        break;
                    case 'answer':
                        handleAnswer(socket, data);
                        break;
                    case 'candidate':
                        handleCandidate(socket, data);
                        break;
                    default:
                        console.error('Unhandled message type:', data.type);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        socket.on('close', () => {
            console.log('Client disconnected');
            if (socket.userId) {
                broadcastUserLeft(socket.userId);
            }
        });
    });

    function handleAuth(socket, token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = payload.user._id;
            console.log(`Authenticated user: ${socket.userId}`);
            broadcastUserJoined(socket.userId);
        } catch (error) {
            console.error('Invalid token');
            socket.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            socket.close();
        }
    }

    function handleOffer(socket, data) {
        if (!data.targetUserId) {
            console.error('Offer must include targetUserId');
            return;
        }

        const targetClient = findClient(data.targetUserId);
        if (targetClient) {
            targetClient.send(JSON.stringify({
                type: 'offer',
                offer: data.offer,
                from: socket.userId,
            }));
            console.log(`Offer sent to user: ${data.targetUserId}`);
        } else {
            console.error(`Target user not found or not connected: ${data.targetUserId}`);
        }
    }

    function handleAnswer(socket, data) {
        if (!data.targetUserId) {
            console.error('Answer must include targetUserId');
            return;
        }

        const targetClient = findClient(data.targetUserId);
        if (targetClient) {
            targetClient.send(JSON.stringify({
                type: 'answer',
                answer: data.answer,
                from: socket.userId,
            }));
            console.log(`Answer sent to user: ${data.targetUserId}`);
        } else {
            console.error(`Target user not found or not connected: ${data.targetUserId}`);
        }
    }

    function handleCandidate(socket, data) {
        if (!data.targetUserId) {
            console.error('Candidate must include targetUserId');
            return;
        }

        const targetClient = findClient(data.targetUserId);
        if (targetClient) {
            targetClient.send(JSON.stringify({
                type: 'candidate',
                candidate: data.candidate,
                from: socket.userId,
            }));
            console.log(`Candidate sent to user: ${data.targetUserId}`);
        } else {
            console.error(`Target user not found or not connected: ${data.targetUserId}`);
        }
    }

    function findClient(userId) {
        return Array.from(wss.clients).find(
            (client) => client.userId === userId && client.readyState === WebSocket.OPEN
        );
    }

    function broadcastUserJoined(userId) {
        console.log(`Broadcasting user joined: ${userId}`);
        wss.clients.forEach((client) => {
            if (client.userId !== userId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'user-joined', userId }));
            }
        });
    }

    function broadcastUserLeft(userId) {
        console.log(`Broadcasting user left: ${userId}`);
        wss.clients.forEach((client) => {
            if (client.userId !== userId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'user-left', userId }));
            }
        });
    }

    const signalingPort = process.env.SIGNALLING_PORT || (isProduction ? 443 : 3001);
    server.listen(signalingPort, () => {
        const protocol = isProduction ? 'wss' : 'ws';
        logger.info(`${protocol}://localhost:${signalingPort} - Signaling server running`);
    });
};
