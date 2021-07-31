module.exports = {
    /**
     * リソースIDを指定するセレクタ
     * @param {string} id resourceId-id
     * @returns xpath
     */
    resourceId(id) {
        return `//*[@resource-id="${id}"]`;
    }
}