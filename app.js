import puppeteer from "puppeteer";
import fs from "fs";
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

    fs.writeFileSync("items.json", JSON.stringify(items, null, 2));
    console.log("Items data saved to items.json successfully.");
    await browser.close();
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
