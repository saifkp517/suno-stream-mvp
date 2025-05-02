import dotenv from "dotenv";
import { io } from "socket.io-client";
import player from "play-sound";
import axios from "axios";

dotenv.config();

const socketToken = process.argv[2];
const play = player();

if (!socketToken) {
  console.error("❌ No SOCKET_TOKEN found in arguments");
  process.exit(1);
}

// Create a function to establish a new connection
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'] });

streamlabs.on('connect', () => {
  console.log("✅ Connected to Streamlabs");
});


//Perform Action on event
streamlabs.on('event', (eventData) => {
  if (!eventData.for && eventData.type === 'donation') {
    //code to handle donation events
    console.log(eventData.type);
  }
  if (eventData.for === 'twitch_account') {
    switch (eventData.type) {
      case 'follow':
        //code to handle subscription events
        interface RequestBody {
          prompt: string;
          style: string;
          title: string;
          customMode: boolean;
          instrumental: boolean;
          model: string;
          negativeTags: string;
          callBackUrl: string;
        }

        console.log("🎉 New Follower:", eventData.message);

        const requestBody: RequestBody = {
          prompt: "A calm and relaxing piano track with soft melodies",
          style: "Classical",
          title: "Peaceful Piano Meditation", 
          customMode: true,
          instrumental: true,
          model: "V3_5",
          negativeTags: "Heavy Metal, Upbeat Drums",
          callBackUrl: "http://localhost:3000/api/suno-callback"
        };

        axios.post('https://apibox.erweima.ai/api/v1/generate', requestBody, {
          headers: {
            Authorization: `Bearer cdf1f6b9548b334dba8ce8aeb6c13bdc`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("✅ API Response:", response.data);
        })
        .catch(error => {
          console.error("❌ API Error:", error.response ? error.response.data : error.message);
        });
        //default case
        console.log(eventData.type);
    }
  }
});

streamlabs.on('close', () => {
  console.log("❌ Connection closed");
  process.exit(1);
}
);