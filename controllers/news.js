const puppeteer = require('puppeteer');
const $ = require('cheerio');
const eduUrls = ['https://edu.gov.il/owlHeb/Pages/NewsAgg.aspx',
    'https://edu.gov.il/owlHeb/Pages/NewsAgg.aspx#k=#s=11',
    'https://edu.gov.il/owlHeb/Pages/NewsAgg.aspx#k=#s=21',
    'https://edu.gov.il/owlHeb/Pages/NewsAgg.aspx#k=#s=31',
    'https://edu.gov.il/owlHeb/Pages/NewsAgg.aspx#k=#s=41'
]

const knessetUrl = 'https://main.knesset.gov.il/News/PressReleases/Pages/default.aspx';
const knessetBasrUrl = 'https://main.knesset.gov.il';


exports.scrapeNews = async(req, res) => {

    const { filterBy } = req.query;

    try {
        let results = []
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        for (let i = 0; i < eduUrls.length; i++) { // scrape edu.gov
            await page.goto(eduUrls[i]);
            await page.waitFor(800);

            const html = await page.content();


            const newsOnjList = $('.secondary .container', html).map((i, e) => {
                return {
                    name: $(e).find('h2').text(),
                    summary: $(e).find('.text').text(),
                    date: $(e).find('span:first-child').text(),
                    link: $(e).find('a').attr('href')
                }
            }).get();

            results.push(...newsOnjList);
        }
        if (filterBy) results = results.filter(e => e.name.includes(filterBy))

        // scrape edu.gov        
        await page.goto(knessetUrl);

        if (filterBy) {
            await page.waitFor(2000);
            await page.type('input[id=subject]', filterBy, { delay: 20 })
            await page.click('.submitButton');
            await page.waitFor(1000);
        }
        await page.waitFor(300);

        const html = await page.content();


        const newsOnjList = $('#KnessetNewsLobbyMainContainerDiv > div > div > div.main-container-left-side > div.item.news-content > ul li', html).map((i, e) => {
            return {
                name: $(e).find('.news-header').text(),
                summary: $(e).find('.news-content').text(),
                date: $(e).find('.news-date').text(),
                link: knessetBasrUrl + $(e).find('a').attr('href')
            }
        }).get();

        results.push(...newsOnjList);

        await browser.close();

        res.status(200).json({
            news: results
        });
        //res.send

    } catch (err) {
        res.status(404).json({
            err: err
        })
    }
}