const puppeteer = require('puppeteer');
const $ = require('cheerio');

const scrapeNews = async (req, res, next) => {
    const keyword = req.query.filterBy;

    const eduURL = 'https://edu.gov.il/owlHeb/Pages/NewsAgg.aspx';
    const knessetURL = 'https://main.knesset.gov.il/News/PressReleases/Pages/default.aspx';
    const knessetHTTP = 'https://main.kneseet.gov.il';

    try {

        // EDU
        let results = [];
        const browser = await puppeteer.launch({ headless: false });
        const eduPage = await browser.newPage();
        const knessetPage = await browser.newPage();
        await eduPage.waitForNavigation(eduPage.goto(eduURL, { waitUntil: 'domcontentloaded' }));
        await eduPage.waitForSelector('.secondary');
        let html = await eduPage.content();

        let newsOnEDU = $('.secondary .container', html).map((i, element) => {
            return {
                name: $(element).find('h2').text(),
                summary: $(element).find('.text').text(),
                date: $(element).find('span:first-child').text(),
                link: $(element).find('a').attr('href')
            }
        }).get();

        if (keyword) {
            newsOnEDU = newsOnEDU.filter(
                newsPiece => newsPiece.name.includes(keyword) || newsPiece.summary.includes(keyword)
            );
        }

        results.push(...newsOnEDU);

        // KNESSET
        
        await knessetPage.waitForNavigation(knessetPage.goto(knessetURL));
        await knessetPage.waitForSelector('.submitButton');
        await knessetPage.waitForSelector('input[id=subject]');
        
        if (keyword) {
            await knessetPage.type(`input[id=subject]`, keyword, { delay: 10 });
            await knessetPage.click('.submitButton');
        }

        html = await knessetPage.content();

        const selector = '#KnessetNewsLobbyMainContainerDiv > div > div > div.main-container-left-side > div.item.news-content > ul li';

        const newsOnKnesset = $(selector, html).map((i, element) => {
            return {
                name: $(element).find('.news-header').text(),
                summary: $(element).find('.news-content').text(),
                date: $(element).find('.news-date').text(),
                link: knessetHTTP + $(element).find('a').attr('href')
            }
        }).get();

        results.push(...newsOnKnesset);

        // RESULTS
        await browser.close();
        res.status(200).json({
            news: results
        });
    }
    catch (error) {
        next(error);
    }

};

module.exports = {
    scrapeNews: scrapeNews
};