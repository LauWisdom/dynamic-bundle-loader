const loaderUtils = require("loader-utils");

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
    this.cacheable && this.cacheable();

    let result = `
    module.exports = function() {
        return import(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)})
    }
    `

    return result
}
