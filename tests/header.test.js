const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();

    await page.goto('localhost:3000'); // direct browser instance to 'localhost:3000'
}); // END create browser/page instance

afterEach(async () => {
    await page.close(); // close Chromium instance after each test
}); // END close Chromium instance

test('The header has the correct text', async () => {

    const text = await page.getContentsOf('a.brand-logo'); // read text of HTML element

    expect(text).toEqual('Blogster'); // confirm element text reads 'Blogster'
}); // END Header text test

test('Clicking login asserts Oauth flow', async () => {
    await page.click('.right a'); // "clicks" 'Login with Google' button

    const url = await page.url(); 

    expect(url).toMatch('/accounts\.google\.com/'); // check to match link url
}); // END Login click test

test('When signed in, shows Logout button', async () => {
    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]'); // read text of HTML element

    expect(text).toEqual('Logout'); // confirm element text reads 'Logout' 
}); // END Logout button text test
