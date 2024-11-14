const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const Company = require("../models/Company");

const router = express.Router();

router.post("/scrape", async (req, res) => {
  let { url } = req.body;

  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const companyData = {
      name:
        $('meta[property="og:site_name"]').attr("content") || $("title").text(),
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "",
      logo:
        $('meta[property="og:image"]').attr("content") ||
        $('link[rel="icon"]').attr("href") ||
        "",
      facebookUrl: $('a[href*="facebook.com"]').attr("href") || "",
      linkedinUrl: $('a[href*="linkedin.com"]').attr("href") || "",
      twitterUrl: $('a[href*="twitter.com"]').attr("href") || "",
      instagramUrl: $('a[href*="instagram.com"]').attr("href") || "",
      address:
        $('[itemprop="address"]').text() ||
        $("address").text() ||
        $('meta[name="address"]').attr("content") ||
        $('p:contains("Address")').text() ||
        "",
      phone:
        $('a[href^="tel:"]').text() || $('p:contains("Phone")').text() || "",
      email:
        $('a[href^="mailto:"]').text() || $('p:contains("Email")').text() || "",
    };

    const newCompany = new Company(companyData);
    await newCompany.save();

    res.status(200).json(newCompany);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error scraping data. Ensure the URL is correct." });
  }
});

router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

router.delete("/companies", async (req, res) => {
  const { ids } = req.body;
  await Company.deleteMany({ _id: { $in: ids } });
  res.status(204).send();
});

module.exports = router;
