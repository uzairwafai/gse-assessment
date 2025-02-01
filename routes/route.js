const express = require("express");
const router = express.Router();
const handler = require("../controllers/handler");


//get request
router.get("/resolve-contact", handler.get);
// Post request
router.post("/resolve-contact", handler.resolveContact);

module.exports = router;
