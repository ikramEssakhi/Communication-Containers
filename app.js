const express = require("express");
const request = require("request");
const app = express();
const port = 3000;
mongodb://mongoservice:8007/myworlddb
//import { MongoClient } from 'mongodb';




app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const city = req.body.city;
    const apiKey = "3dccaab845410ed4aea82c43732977c3"; // replace with your own API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    request(url, function(error, response, body) {
        if (error) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            const weatherData = JSON.parse(body);
            if (weatherData.cod === "404") {
                res.sendFile(__dirname + "/failure.html");
            } else {
                const temperature = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;


                var MongoClient = require('mongodb').MongoClient;
                var url = "mongodb://localhost:8007/";

                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("myworlddb");
                    var myobj = { ville:req.body.city, temperature: weatherData.main.temp, weatherDescription: weatherData.weather[0].description};
                    dbo.collection("weather").insertOne(myobj, function(err, res) {
                      if (err) throw err;
                      console.log("1 document inserted");
                      db.close();
                    });
                  });
                
                //{} empty fetches all documents
                //const temperatureoo=db.person.find({name:"naveen"})

                res.write(`<p>Tteeeeeeeeeeest ${temperatureoo}</p>`);

                res.write(`<p>The weather is currently ${weatherDescription}</p>`);
                res.write(`<h1>The temperature in ${city} is ${temperature} degrees Celsius.</h1>`);
                res.write(`<img src="http://openweathermap.org/img/w/${icon}.png">`);
                res.send();
            }
        }
    });
});

app.listen(port, function() {
    console.log(`Server is running on port ${port}.`);
});
