const express= require("express");
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodoverride= require("method-override");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const path =require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs',ejsMate);
const{ listingSchema}=require("./schema.js");


main()
.then(()=>{console.log("connection successful");})
.catch((err) => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const validateListing =(req,res,next)=>{
    let{error}= listingSchema.validate(req.body);
    if(error){
        let errMg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMg);
    }
    else{
        next();
    }
};


//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));
//new route
app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));
//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing   = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));
//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));
//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let delListing=Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
}));
//reviews post route
app.post("/listings/:id/review",async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
});
    
app.get("/",(req,res)=>{
    console.log("server is working.....");
});
//app.get("/test",async (req,res)=>{
//    let samplelisting=new Listing({
//        title:"newhotel",
 //       description:"by the mountain",
 //       price:1500,
 //       location:"Goa",
 //       country:"India",
 //   });
 //   await samplelisting.save();
 //   console.log("test completed");
 //   res.send("testing done...");
//
//})
app.all("/{*any}",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="error occured!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("connection connected.");
});