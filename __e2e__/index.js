const wdio = require("webdriverio");

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

    await client.deleteSession();
}

main();