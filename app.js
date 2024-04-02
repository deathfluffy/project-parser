import puppeteer from "puppeteer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createItem } from "./items.js";
dotenv.config();

const { DB_HOST, siteUrl, itemSelector, priceSelector, nextPageSelector } =
  process.env;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(siteUrl);

    while (true) {
      await page.waitForSelector(itemSelector);
      await page.waitForSelector(priceSelector);

      const items = await page.evaluate(
        (itemSelector, priceSelector) => {
          const itemElements = document.querySelectorAll(itemSelector);
          const priceElements = document.querySelectorAll(priceSelector);
          const itemsData = [];

          itemElements.forEach((item, index) => {
            const rarity = item.innerText;
            const name = item.nextElementSibling.innerText;
            const price = priceElements[index].innerText;
            itemsData.push({ rarity, name, price });
          });

          return itemsData;
        },
        itemSelector,
        priceSelector
      );

      await mongoose.connect(DB_HOST);
      await Promise.all(items.map((item) => createItem(item)));

      console.log("Skins saved successfully.");

      const nextPageLink = await page.$(nextPageSelector);
      if (!nextPageLink) break;

      await nextPageLink.click();
      await page.waitForNavigation();
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await browser.close();
  }
})();
