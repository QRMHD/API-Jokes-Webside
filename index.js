import express from "express";
import axios from "axios";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 3000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


app.use(express.static("public"));
app.get('/',(req,res)=>{
    res.render("index.ejs");
})
app.get('/joke', async (req, res) => {
   const jokeResponse = await axios.get('https://v2.jokeapi.dev/joke/Any');
    res.render("Joke.ejs", { setup: jokeResponse.data.setup, delivery: jokeResponse.data.delivery });
})
app.get('/jokear', async (req, res) => {
const jokeResponse = await axios.get('https://v2.jokeapi.dev/joke/Any');
    const data = jokeResponse.data;

    const originalSetup = data.type === 'twopart' ? data.setup : data.joke;
    const originalDelivery = data.type === 'twopart' ? data.delivery : '';

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Translate and localize this English joke into Arabic. 
Make sure the punchline is funny and culturally natural in Arabic.

Setup: ${originalSetup}
Delivery: ${originalDelivery}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setup: {
              type: Type.STRING,
              description: 'The Arabic translation for the setup (or the full joke if single-part)',
            },
            delivery: {
              type: Type.STRING,
              description: 'The Arabic punchline, or an empty string if single-part',
            },
          },
          required: ['setup', 'delivery'],
        },
      },
    });

    const translatedJoke = JSON.parse(response.text.trim());

    res.render('Jokear.ejs', {
      setup: translatedJoke.setup,
      delivery: translatedJoke.delivery,
    });



})









app.listen(port, ()=>{
    console.log(`running on port ${port}`)
})