const wdio = require("webdriverio");
const assert = require("assert");

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        platformVersion: "9", // ここはandroidのemulatorのversion
        deviceName: "Android Emulator",
        app: `${__dirname.replace("__e2e__", "")}app/build/outputs/apk/debug/app-debug.apk`,
        automationName: "UiAutomator2"
    }
};

async function main() {
    const client = await wdio.remote(opts);

    const field = await client.$("//*[@resource-id=\"com.example.happybirthday:id/textView\"]");
    const value = await field.getText();
    assert.strictEqual(value, "Happy Birthday, Sam!");

    await client.deleteSession();
}

main();