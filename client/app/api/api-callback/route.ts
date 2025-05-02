// pages/api/suno-callback.js

export async function POST(req, res) {
  
    try {
      const { code, msg, data } = req.body;
  
      console.log("🎧 Suno Callback Received:");
      console.log("✅ Status Code:", code);
      console.log("💬 Message:", msg);
      console.log("📦 Data:", JSON.stringify(data, null, 2));
  
      // Optionally save to DB or queue for playback
      const taskId = data?.task_id;
      const audioList = data?.data;
  
      if (!audioList || !Array.isArray(audioList)) {
        return res.status(400).json({ msg: "Invalid data payload" });
      }
  
      // Example: Broadcast audio_url to OBS or save it
      audioList.forEach(audio => {
        console.log("🎶 Audio URL:", audio.audio_url);
        console.log("🖼️ Cover Image:", audio.image_url);
        // Send this to OBS/WebSocket/Database/etc.
      });
  
      return res.status(200).json({ msg: "Callback received successfully" });
  
    } catch (error) {
      console.error("❌ Error handling Suno callback:", error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
  