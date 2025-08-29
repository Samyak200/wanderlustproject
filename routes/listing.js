const express=require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} =  require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { render } = require("ejs");

//index and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing,isLoggedIn,wrapAsync(listingController.createListing));
//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

//show,update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;
