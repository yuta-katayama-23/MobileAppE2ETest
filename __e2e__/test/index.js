const wdio = require("webdriverio");
const expect = require("expect.js");
const by = require("../wedio/locator-helper");
const opts = require("../wedio/config");

describe('Create session and delete session', () => {
    let client;

    before(async () => {
        client = await wdio.remote(opts);
    });

    describe('Happy Birthday App Test', () => {
        it('check title text', async () => {
            const field = await client.$("//android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.view.ViewGroup/android.widget.TextView");
            const value = await field.getText();
            expect(value).to.equal("Happy Birthday");
        });

        it('check message text', async () => {
            const field = await client.$(by.resourceId("com.example.happybirthday:id/textView"));
            const value = await field.getText();
            expect(value).to.equal("Happy Birthday, Sam!");
        });

        it('check from text', async () => {
            const field = await client.$(by.resourceId("com.example.happybirthday:id/textView2"));
            const value = await field.getText();
            expect(value).to.equal("From Emma.");
        });
    })

    after(async () => {
        await client.deleteSession();
    });

})
