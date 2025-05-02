"use client";

import { useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const DonationListener = ({ socketToken }: { socketToken: string }) => {
  useEffect(() => {
    if (!socketToken) return;

    const socket = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'] });

    socket.on("connect", () => {
      console.log("🔌 Connected to Streamlabs socket.");
    })

    socket.on("event", (eventData) => {
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
    })

    socket.on("error", () => {
      console.error("❌ Socket error: Unable to connect to Streamlabs socket.");
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from Streamlabs socket.");
    });

    return () => {
      socket.close();
    };
  }, [socketToken]);

  return null;
};

export default DonationListener;
