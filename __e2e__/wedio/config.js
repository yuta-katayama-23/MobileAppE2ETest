const regex = /__e2e__(\\|\/)wedio/;
const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        platformVersion: "9", // ここはandroidのemulatorのversion
        deviceName: "Android Emulator",
        app: `${__dirname.replace(regex, "")}app/build/outputs/apk/debug/app-debug.apk`,
        automationName: "UiAutomator2",
        newCommandTimeout: 60 // https://appium.io/docs/en/writing-running-appium/caps/
    },
    outputDir: `${__dirname.replace(regex, "")}__e2e__`
};

module.exports = opts