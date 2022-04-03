let mongoose = require("mongoose");
require("dotenv").config();
let url = process.env.MONGO_URI;
 
mongoose.connect(url,(err)=>{
    // eslint-disable-next-line no-console
    if(err) console.log(err);
    // eslint-disable-next-line no-console
    else console.log("successfully connected to db");
});

