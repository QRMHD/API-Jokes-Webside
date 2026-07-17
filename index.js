import express from "express";
import axios from "axios";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.get('/',(req,res)=>{
    res.render("index.ejs");
})
app.get('/joke', async (req, res) => {
   const jokeResponse = await axios.get('https://v2.jokeapi.dev/joke/Any');
    res.render("Joke.ejs", { setup: jokeResponse.data.setup, delivery: jokeResponse.data.delivery });
})










app.listen(port, ()=>{
    console.log(`running on port ${port}`)
})