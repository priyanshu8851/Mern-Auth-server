require('dotenv').config();

const fs = require("fs");
const cron = require("node-cron");
const moment = require("moment-timezone");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmployeeModel = require('./models/Employee');
const authrouter =  require("./routes/authRoutes") 
const logger = require("./logger");
const data = require("./data")
const app = express();
const {sendEmail}= require('./data');
app.use(express.json());

sendEmail();

async function backupDatabase() {
  try {
    // Fetch all users from the database
    const users = await EmployeeModel.find({});
    const data = JSON.stringify(users, null, 2);
    // console.log(data);
    // Format the timestamp for the filename
    const timeStamp = moment().tz("Asia/Kolkata").format("YYYY-MM-DD_HH-mm-ss");

   
    // Create the backup file
    const fileName = `backup/users_${timeStamp}.json`;

    fs.writeFileSync(fileName, data, "utf8");

    // Log success message
    logger.info(`Database backup saved to ${fileName}`);
  } catch (error) {
    // Log any errors that occur during the backup process
    logger.error(`Error creating database backup: ${error.message}`);
  }
  
}

// Schedule the backup task to run every minute
cron.schedule("* * * * *", backupDatabase, {
  timezone: "Asia/Kolkata",
});


app.use(cors({
  origin: "http://localhost:5173", // Make sure this matches the frontend origin exactly
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers if necessary
  credentials: true // If you plan to use cookies or authorization headers
}));



app.use('/api/auth', authrouter )



mongoose.connect("mongodb://127.0.0.1:27017/employee")
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('Could not connect to MongoDB', err));




app.listen(3001, () => {
  console.log("Server is running on port 3001");
  logger.info("Server running on http://localhost:3001");
});


