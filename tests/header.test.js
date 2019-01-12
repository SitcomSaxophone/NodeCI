const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => { // create new Chromium broswer/page instance before each test
    browser = await puppeteer.launch({
        headless: false,
    });
    page = await browser.newPage();
    await page.goto('localhost:3000'); // direct browser instance to 'localhost:3000'
}); // END create browser/page instance

afterEach(async () => {
    await browser.close(); // close Chromium instance after each test
}); // END close Chromium instance

test('The header has the correct text', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML); // read text of HTML element

    expect(text).toEqual('Blogster'); // confirm element text reads 'Blogster'
}); // END Header text test

test('Clicking login asserts Oauth flow', async () => {
    await page.click('.right a'); // "clicks" 'Login with Google' button

    const url = await page.url(); 

    expect(url).toMatch('/accounts\.google\.com/'); // check to match link url
}); // END Login click test

test('When signed in, shows Logout button', async () => {
    const id = '5c3010e21d4d9cde4c0d2b94'; // set users id from DB

    const Buffer = require('safe-buffer').Buffer;

    const sessionObject = { // create session object
        passport: {
            user: id
        }
    }

    const sessionString = Buffer.from( // stringify sessonObject
        JSON.stringify(sessionObject)
    ).toString('base64');

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString); // set session signature

    await page.setCookie({ name: 'session', value: sessionString }); // set user cookie-session
    await page.setCookie({ name: 'session.sig', value: sig }); // set user session signature
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]'); // wait for element to render

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML); // read text of HTML element

    expect(text).toEqual('Logout'); // confirm element text reads 'Logout' 
}); // END Logout button text test
