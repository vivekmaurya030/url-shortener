const express = require("express");
const {handleGenerateNewShortURL, handleGetAnalytics}= require("../controller/url")
const router = express.Router();
 
router.post("/",handleGenerateNewShortURL);

router.get("/analytics/:shortId",handleGetAnalytics)
// router.route("/:shortId",handleGetShortUrl)
module.exports = router;