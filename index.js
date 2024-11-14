require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scrapeRoutes = require('./routes/scrape');

const app = express();
app.use(cors({ origin: '*' })); 
app.use(
  cors({
    credentials: true,
    origin: ["https://unoiatechh.vercel.app"],
  })
);

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

app.use('/api', scrapeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
