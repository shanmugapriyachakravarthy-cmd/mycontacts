const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectionDb = require("./config/dbConnection");
const port = process.env.PORT || 5000;
connectionDb();
app.use(express.json()); // this is for body parser
app.use("/api/contacts", require("./routes/contactRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
