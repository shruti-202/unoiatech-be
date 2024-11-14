const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: String,
  description: String,
  logo: String,
  facebookUrl: String,
  linkedinUrl: String,
  twitterUrl: String,
  instagramUrl: String,
  address: String,
  phone: String,
  email: String,
});

module.exports = mongoose.model("Company", CompanySchema);
