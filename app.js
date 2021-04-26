const puppeteer = require('puppeteer');

const poocoinRotomoonUrl = 'https://poocoin.app/tokens/0xa9b21900115843d655c4a8a5cb7adf49e8f4113a'
const bscScanUrl = 'https://bscscan.com/token/0xa9b21900115843d655c4a8a5cb7adf49e8f4113a'

async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const page2 = await browser.newPage()

  await page.goto(poocoinRotomoonUrl, {waitUntil: 'networkidle0'})
  await page2.goto(bscScanUrl, {waitUntil: 'networkidle0'})
  
  async function getPriceAndMarketCap() {
    
      const currentPrice = await page.evaluate(() => {
        const currentPriceSelector = '#root>div>div.d-md-block.flex-grow-1>div.d-flex.flex-column.flex-grow-1.pe-2>div>div.flex-grow-1.ps-2.pt-2.lh-1>div.d-flex.align-items-start.flex-wrap>div.ps-2.d-flex.align-items-center.flex-grow-1>div>div.d-flex.flex-wrap>div:nth-child(2)>span'

        return document.querySelector(currentPriceSelector).textContent.trim().slice(1)
      })

      const marketCap = await page.evaluate(() => {
        const marketCapSelector = '#root > div > div.d-md-block.flex-grow-1 > div.d-flex.flex-column.flex-grow-1.pe-2 > div > div.TokenChart_stats__3732U.d-block.bg-dark-1.shadow.pt-3.text-small > div:nth-child(5) > span:nth-child(4)'

        return document.querySelector(marketCapSelector).textContent.trim().slice(1)
      })

      const coinData = {currentPrice, marketCap}
      console.log(coinData)
      return coinData
  }

  async function getHolders() {
    const currentHolders = await page2.evaluate(() => {
      const holderSelector = '#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8 > div > div'

      return document.querySelector(holderSelector).textContent.trim()
    })
    console.log(currentHolders)
    return currentHolders
  }

  setInterval(async () => {
    await getPriceAndMarketCap()
  }, 5 * 1000)

  setInterval(async () => {
    await getHolders()
  }, 30 * 1000)
  // await browser.close()
}
run()
