let express = require("express");
let port = process.env.PORT || 8000;
let app = express();
let authRoutes = require("./routes/auth");
let bodyParser = require("body-parser");
let adminRoutes = require("./routes/admin");
let userRoutes = require("./routes/user");
let blogRoutes = require("./routes/blog");
require("./db");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/user",userRoutes);
app.use("/api/blog",blogRoutes);

console.log('git learning bro')
console.log('git ignore')

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});