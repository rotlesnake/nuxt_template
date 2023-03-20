module.exports.deleteSubstring = function (str, ch1, ch2) {
    var pos1 = str.indexOf(ch1);
    var pos2 = str.indexOf(ch2, pos1) + ch2.length;

    return str.substr(0, pos1) + str.substr(pos2);
};

module.exports.myTrim = function (str) {
    return str.replace(/^\s+|\s+$/gm, "");
};

module.exports.in_array = function (needle, haystack) {
    var found = 0;
    for (var i = 0, len = haystack.length; i < len; i++) {
        if (haystack[i] == needle) return i;
        found++;
    }

    return -1;
};

module.exports.dateToSeconds = function (dt) {
    var date = new Date(dt);
    var seconds = date.getTime() / 1000;

    return seconds;
};

module.exports.debounce = function (callback, timeout) {
    return function (args) {
        let previousCall = this.lastCall;
        this.lastCall = Date.now();
        if (previousCall && this.lastCall - previousCall <= timeout) {
            clearTimeout(this.lastCallTimer);
        }
        this.lastCallTimer = setTimeout(() => callback(args), timeout);
    };
};
