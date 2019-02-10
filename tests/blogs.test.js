const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();

    await page.goto('localhost:3000');
}); // END create browser/page instance

afterEach(async () => {
    await page.close();
}); // END close Chromium instance

describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('Can see blog create form', async () => {
        const label = await page.getContentsOf('form label');
    
        expect(label).toEqual('Blog Title');
    });
});