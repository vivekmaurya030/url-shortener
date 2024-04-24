const express = require("express");
const URL = require("./models/url");
const { connectToMongoDb } = require("./connect");
const path = require('path');
const cookieParser = require("cookie-parser");
const {restrictToLoggedinUserOnly, checkAuth} = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 8001;

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user")


connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDb Connected")
);

app.set("view engine","ejs");
app.set('views',path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user",checkAuth, userRoute);

app.use("/",checkAuth,staticRoute);

app.get("/url/:shortId", async (req, res) => {
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

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
