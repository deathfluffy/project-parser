import puppeteer from "puppeteer";
import dotenv from 'dotenv'
import mongoose from "mongoose";;
import { createItem } from './items.js'
dotenv.config();
const { DB_HOST } = process.env;
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://csgoskins.gg");

    await page.waitForSelector(".text-gray-400.text-sm.block.truncate");

    const items = await page.evaluate(() => {
      const itemElements = document.querySelectorAll(
        ".text-gray-400.text-sm.block.truncate"
      );
      const itemsData = [];
      itemElements.forEach((item) => {
        const rarity = item.innerText;
        const name = item.nextElementSibling.innerText;
        itemsData.push({ rarity, name });
      });
      return itemsData;
    });

    await mongoose.connect(DB_HOST);
    console.log("Database connection")

    await Promise.all(items.map(item => createItem(item)));

    console.log('Data saved successfully.');

    await browser.close();
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();


