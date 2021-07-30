const wdio = require("webdriverio");
const expect = require("expect.js");

const regex = /__e2e__(\\|\/)test/;
const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        platformVersion: "9", // ここはandroidのemulatorのversion
        deviceName: "Android Emulator",
        app: `${__dirname.replace(regex, "")}app/build/outputs/apk/debug/app-debug.apk`,
        automationName: "UiAutomator2",
        newCommandTimeout: 10 // https://appium.io/docs/en/writing-running-appium/caps/
    },
    outputDir: `${__dirname.replace(regex, "")}`
};

describe('Create session and delete session', () => {
    let client;

    before(async () => {
        client = await wdio.remote(opts);
    });

    describe('Happy Birthday App Test', () => {
        it('check title text', async () => {
            debugger;

            const field = await client.$("//android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.view.ViewGroup/android.widget.TextView");
            const value = await field.getText();
            expect(value).to.equal("Happy Birthday");
        });

        it('check message text', async () => {
            const field = await client.$("//*[@resource-id=\"com.example.happybirthday:id/textView\"]");
            const value = await field.getText();
            expect(value).to.equal("Happy Birthday, Sam!");
        });

        it('check from text', async () => {
            const field = await client.$("//*[@resource-id=\"com.example.happybirthday:id/textView2\"]");
            const value = await field.getText();
            expect(value).to.equal("From Emma.");
        });

        it('わざとNGにする', async () => {
            const field = await client.$("//*[@resource-id=\"com.example.happybirthday:id/textView2\"]");
            const value = await field.getText();
            expect(value).to.equal("hoge");
        });
    })

    after(async () => {
        await client.deleteSession();
    });

})
