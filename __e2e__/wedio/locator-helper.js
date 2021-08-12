module.exports = {
    /**
     * リソースIDを指定するセレクタ
     * @param {string} id resourceId-id
     * @returns xpath
     */
    resourceId(id) {
        return `//*[@resource-id="${id}"]`;
    },

    /**
     * クラス名を指定するセレクタ
     * @param {string} className 
     * @returns UiSelector
     */
    className(className) {
        return `android=new UiSelector().className("${className}")`;
    }
}