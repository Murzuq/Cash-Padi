import textToSpeech from "@google-cloud/text-to-speech";
import { PassThrough } from "stream";

// Creates a client for the Text-to-Speech API
const client = new textToSpeech.TextToSpeechClient();

/**
 * @desc    Synthesize text to speech using Google Cloud TTS
 * @route   POST /api/tts/synthesize
 * @access  Public (for now, could be protected later)
 */
export const synthesizeSpeech = async (req, res) => {
  const { text, voiceName, languageCode, speakingRate, pitch } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required." });
  }

  const request = {
    input: { text: text },
    // Select the language and voice
    voice: {
      name: voiceName || "en-US-Neural2-C",
      languageCode: languageCode || "en-US",
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: parseFloat(speakingRate || 1.0),
      pitch: parseFloat(pitch || 0.0),
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    // Set content type for MP3 audio
    res.set("Content-Type", "audio/mpeg");

    // Convert audioContent (base64) to a buffer and stream it
    const audioBuffer = Buffer.from(response.audioContent, "base64");
    const audioStream = new PassThrough();
    audioStream.end(audioBuffer);

    audioStream.pipe(res); // Pipe the audio stream directly to the response
  } catch (error) {
    console.error("ERROR synthesizing speech:", error);
    res.status(500).json({ message: "Could not synthesize speech." });
  }
};
