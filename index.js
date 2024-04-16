const express = require("express");
const URL = require("./models/url");
const { connectToMongoDb } = require("./connect");
const urlRoute = require("./routes/url");
const path = require('path');
const staticRoute = require("./routes/staticRouter")
const app = express();
const PORT = 8001;

connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDb Connected")
);

app.set("view engine","ejs");
app.set('views',path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/url", urlRoute);

app.use("/",staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  // res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
