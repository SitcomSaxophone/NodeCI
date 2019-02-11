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

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('The form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });

    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('form button');
        });
        test('Submitting takes user to review screen', async () => {
            const reviewText = await page.getContentsOf('h5');

            expect(reviewText).toEqual('Please confirm your entries');
        });
        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const cardTitle = await page.getContentsOf('.card-title');
            const cardContent = await page.getContentsOf('p');

            expect(cardTitle).toEqual('My Title');
            expect(cardContent).toEqual('My Content');
        });
    });
}); //END 'When logged in' describe