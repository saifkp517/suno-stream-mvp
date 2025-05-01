import express from 'express';
import cors from 'cors';
import tmi from 'tmi.js';
import { exec } from 'child_process';
import path from 'path';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json()); // for parsing application/json

// Endpoint to receive and store token
app.post('/api/store-token', (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: 'Access token missing' });
    }

    console.log('Received Access Token:', accessToken);

    const client = new tmi.Client({
        options: { debug: true },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: 'koala637',
            password: "oauth:" + accessToken // e.g., oauth:your_oauth_token
        },
        channels: ['#koala637'] // Replace with your target channel
    });

    client.connect();

    client.on('connected', (addr, port) => {
        console.log(`Connected to ${addr}:${port}`);
    });

    let chatBuffer = [];

    try {
        client.on('message', (channel, tags, message, self) => {
            // if (self) return; // Ignore messages from the bot itself
            console.log(`Message from ${tags.username}: ${message}`);

            if(message === "donation") {
            const soundPath = path.join(__dirname, 'sound.mp3');
            exec(`start ${soundPath}`, (error) => {
                if (error) {
                    console.error('Error playing sound:', error);
                } else {
                    console.log('Playing sound...');
                }
            });
            }   
            // Store the most recent 500 messages in a buffer
            chatBuffer.push(message);
            if (chatBuffer.length > 500) chatBuffer.shift(); // Keep buffer at 500 messages

            // Process mood (for example, basic sentiment analysis)
            // analyzeMood(message);
        });
    } catch (error) {
        console.error('Error connecting to Twitch:', error);
        return res.status(500).json({ error: 'Failed to connect to Twitch' });
    }


});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
