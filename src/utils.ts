import { LIB_NAME } from "./cons";

/**
         * Internal logger
         * @namespace ESCMS.logger
         */
export function logger() { }
/**
 * 1: dev, 2:prod
 * @memberof ESCMS.logger
 */
logger.env = 2;
/**
 * @memberof ESCMS.logger
 * @param {String} msg - The msg to show
 * @param {Number} msgType - 1:normal,2:warning,3:error, default is 1
 * @private
 */
logger.showMsg = function (msg, msgType) {
    if (msgType == 1 || msgType == undefined)
        console.log(msg);
    else if (msgType == 2)
        console.warn(msg);
    else if (msgType == 3)
        console.error(msg);
}
/**
 * The message will not be output when ESCMS.logger.env == 1,so it is used to print those message for debug
 * @memberof ESCMS.logger
 * @param {String} msg - The msg to show
 * @param {Number} msgType - 1:normal,2:warning,3:error, default is 1
 * @example
 * ESCMS.logger.dev("Some message wiil not be shown in prod env")
 */
logger.dev = function (msg, msgType?) {
    if (logger.env == 1) {
        logger.showMsg(msg, msgType);
    }
}
/**
 * @memberof ESCMS.logger
 * @param {String} msg - The msg to show
 * @param {Number} msgType - 1:normal,2:warning,3:error, default is 1
 * @example
 * ESCMS.logger.prod("Some message wiil be shown in any env")
 */
logger.prod = function (msg, msgType) {
    logger.showMsg(msg, msgType);
}

export function libIsLoaded() {
    return window[LIB_NAME] != undefined;
}

/**
 * Check obj is a function
 * @memberof ESCMS.utils
 * @param {*} obj 
 * @function
 */
export function isFunction(obj): boolean {
    return typeof obj === "function";
}
/**
 * Check obj is an array
 * @memberof ESCMS.utils
 * @param {*} obj 
 * @function
 */
export function isArray(obj): boolean {
    return Object.prototype.toString.apply(obj) === "[object Array]";
}
/**
 * Check obj is an object 
 * @memberof ESCMS.utils
 * @param {*} obj 
 * @function
 */
export function isObject(obj): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * Check obj is an empty object
 * @memberof ESCMS.utils
 * @param {*} obj 
 */
export function isEmptyObject(obj): boolean {
    return isObject(obj) && JSON.stringify(obj) === "{}";
}
/**
 * Check a parentObj is parent of obj
 * @param {*} obj 
 * @param {*} parentObj 
 */
export function isParentNode(obj, parentObj): boolean {
    if (obj && obj.tagName && obj.tagName.toUpperCase() != "BODY") {
        if (obj == parentObj) {
            return true;
        } else {
            return isParentNode(obj.parentNode, parentObj);
        }
    } else {
        return false;
    }
}
/**
 * @memberof ESCMS.utils
 * @function
 * @param {any} obj - any data type
 * @returns true/false
 * @example
 * ESCMS.utils.isDom(obj)
 */
export function isDom(obj): boolean {
    return (typeof HTMLElement === 'object') ?
        (function (obj) {
            return obj instanceof HTMLElement;
        })(obj) :
        (function (obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        })(obj)
}

export function parseJSON(json) {
    if (typeof json === 'string') {
        try {
            return JSON.parse(json);
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    else {
        return null;
    }
}
/**
 * A cookie wrapper function
 * @param {*} name 
 * @param {*} value 
 * @param {*} options 
 */
export function cookie(name, value?, options?) {
    if (isFunction($["cookie"])) {
        return ($ as any).cookie(name, value, options);
    }
}
/**
 * Can be used to merge  custom configuration to the default configuration, always for internal usage
 * @memberof ESCMS.utils
 * @function
 * @param {Object} obj1 - default configuration object
 * @param {Object} obj2 - custom configuration object
 * @returns merged configuration object
 * @example
 * ESCMS.utils.mergeCfg(cfg1,cfg2)
 */
export function mergeCfg(obj1, obj2) {
    var ret = {};
    var keys = Object.keys(obj1);
    if (!obj2) return obj1;
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (!(obj1[k] instanceof Object)) {

            if (typeof obj1[k] == "string" || typeof obj1[k] == "number" || typeof obj1[k] == "boolean") {
                if (obj2[k] != undefined && obj2[k] != null) {
                    ret[k] = obj2[k];
                }
                else {
                    ret[k] = obj1[k];
                }
            }
        }
        else if (typeof obj1[k] == "function") {
            if (typeof obj2[k] == "function") {
                // ret[k] = (function (k) {
                //     return function _tmp() {
                //         obj1[k].apply(this, _tmp.arguments);
                //         obj2[k].apply(this, _tmp.arguments);
                //     };
                // })(k);
                ret[k] = obj2[k];
            }
            else {
                ret[k] = eval("(" + obj1[k].toString() + ")");
            }
        }
        else if (!(obj1[k] instanceof Array) && !isDom(obj1[k])) {
            if (
                obj2[k] != undefined &&
                obj2[k] != null &&
                (obj2[k] instanceof Object && !(obj2[k] instanceof Array))
            ) {
                ret[k] = mergeCfg(obj1[k], obj2[k]);
            }
            else {
                ret[k] = obj1[k];
            }
        }
        else if (obj1[k] instanceof Array) {
            if (obj2[k] instanceof Array) {
                ret[k] = obj2[k].concat();
            }
            else {
                ret[k] = obj1[k].concat();
            }
        }
        else if (isDom(obj1[k])) {
            if (obj2[k] != null && obj2[k] != undefined) {
                if (isDom(obj2[k])) {
                    ret[k] = obj2[k];
                }
                else {
                    console.log(obj2[k] + " is not a dom element");
                }
            }
            else {
                ret[k] = obj1[k];
            }
        }
    }
    return ret;
}
/**
 * To filter the element in param `filterArr` from param `sourceArr`
 * @memberof ESCMS.utils
 * @function
 * @param {String[]} sourceArr 
 * @param {String[]} filterArr
 * @returns {String[]} - A new array
 */
export function filterStringArray(sourceArr: any[], filterArr: any[]): any[] {
    var regx = new RegExp(filterArr.join("|") + "/g");
    if (!isArray(sourceArr) || !isArray(filterArr))
        return [];
    return sourceArr.join(",").replace(regx, "").split(",");
}
/**
 * To merge custom css classes with root element css classes and filter some not-allowed classes
 * @memberof ESCMS.utils
 * @function
 * @param {String[]} customCssClasses 
 * @param {String[]} rootCssClasses 
 * @param {String[]} notAllowedCssClasses - optional 
 */
export function mergeCustomCssClasses(customCssClasses: string[], rootCssClasses: string[], notAllowedCssClasses?: string[]): string[] {
    if (!isArray(customCssClasses)
        || !isArray(rootCssClasses)
        || (notAllowedCssClasses && !isArray(notAllowedCssClasses)))
        return [];
    customCssClasses = filterStringArray(customCssClasses, isArray(notAllowedCssClasses) ? rootCssClasses.concat(notAllowedCssClasses) : rootCssClasses);
    return rootCssClasses.concat(customCssClasses);
}
/**
 * Can be used to pad chars
 * @memberof ESCMS.utils
 * @function
 * @param {Number|String} val - The value need to been padded
 * @param {String} char - The pad char
 * @param {Number} len - The length of the target value
 * @returns A padded char 
 * @example
 * ESCMS.utils.leftPad(1,"0",3) //"001"
 */
export function leftPad(val, char, len) {
    var ret = "";
    var _val = "" + val;
    if (_val.length < len) {
        for (var i = 0; i < len - _val.length; i++) {
            ret += char;
        }
    }
    ret += val;
    return ret;
}
/**
 * Remove duplicate object in array by key
 * @memberof ESCMS.utils
 * @function
 * @param {Object} arr 
 * @param {String} key 
 * @returns A new distinct array
 * @example
 * var arr = [{name:"a"},{name:"a"}]
 * ESCMS.utils.distinctJSONArrayByKey(arr, "name") //[{name:"a"}]
 */
export function distinctJSONArrayByKey(arr, key) {
    var temp = {};
    var newArr = [];
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i][key] && !temp[arr[i][key]]) {
                temp[arr[i][key]] = 1;
                newArr.push(arr[i]);
            }
        }
    }
    return newArr;
}
/**
 * Highlight keywords in some content
 * @param {*} content 
 * @param {*} keywords 
 * @param {*} tag - avaliable, default "span"
 * @param {*} classname - avaliable, default "highlight"
 * @example
 * ESCMS.utils.highlight("I'm some text", 'I') //<span class='highlight'>I</span>'m some text
 */
export function highlightText(content, keywords, tag, classname) {
    tag = tag || "span";
    classname = classname || "highlight";
    content = content.replace(keywords, "<" + tag + " class='" + classname + "'>" + keywords + "</" + tag + ">");
    return content;
}
/**
 * Fuzzy highlight keywords in some content
 * @memberof ESCMS.utils
 * @param {String} content 
 * @param {String} keywords 
 * @param {String} tag - avaliable, default "span"
 * @param {String} classname  - avaliable, default "highlight"
 * @example
 * ESCMS.utils.fuzzyHighlightText("I'm some text", 'it')//<span class='highlight'>I</span>'m some <span class='highlight'>t</span>ext
 */
export function fuzzyHighlightText(content, keywords, tag, classname) {
    var reg1 = new RegExp(keywords, "i");
    keywords = $.trim(keywords);
    classname = classname || "highlight";
    tag = tag || "span";
    if (reg1.test(content)) {
        var exec = reg1.exec(content);
        content = highlightText(content, exec[0], tag, classname);
        return content;
    }
    else {
        var arr_keywords = keywords ? keywords.split("") : [];
        var arr_content = content ? content.split("") : [];
        var pos = 0;

        for (var i = 0; i < arr_keywords.length; i++) {
            for (var j = pos; j < arr_content.length; j++) {
                if (arr_content[j].toLowerCase() == arr_keywords[i].toLowerCase()) {
                    pos = j + 1;
                    arr_content[j] = highlightText(arr_content[j], arr_content[j], tag, classname);
                    break;
                }
            }
        }
        return arr_content.join("");
    }
}
/**
 * Highlight first letters or text block, e.g. highlight ("dy" || "dynamic l" || "le" ||  "dl") in "Dynamic Lead"
 * @param {String} content 
 * @param {String} keywords 
 * @param {String} tag - avaliable, default "span"
 * @param {String} classname  - avaliable, default "highlight"
 */
export function fuzzyHighlightText2(content, keywords, tag?, classname?) {
    if (content === undefined || content === null || content === "")
        return content;
    //Dynamic Lead: match "dy" || "dynamic l"
    if (content.toLowerCase().indexOf(keywords.toLowerCase()) == 0
        || (content.toLowerCase().indexOf(keywords.toLowerCase()) > 0 && new RegExp("\\b *").test(keywords))
    ) {
        var exec = new RegExp(keywords, "i").exec(content);
        content = highlightText(content, exec[0], tag, classname);
        return content;
    }
    else if (content.toLowerCase().indexOf(keywords.toLowerCase()) > 0) {
        //Dynamic Lead: match "le"
        var words = content.split(" ");
        for (var i = 0; i < words.length; i++) {
            if (keywords.length <= words[i].length && words[i].toLowerCase().indexOf(keywords.toLowerCase()) == 0) {
                // eslint-disable-next-line no-redeclare
                var exec = new RegExp(keywords, "i").exec(words[i]);
                words[i] = highlightText(words[i], exec[0], tag, classname);
                return words.join(" ");
            }
        }
    }
    else {
        //Dynamic Lead: match "dl"
        var keywordsArr = keywords.replace(" ", "").split("");
        // eslint-disable-next-line no-redeclare
        var words = content.split(" ");
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < keywordsArr.length; i++) {
            for (var j = i; j < words.length; j++) {
                if (words[j] && words[j].toLowerCase().indexOf(keywordsArr[i].toLowerCase()) == 0) {
                    // eslint-disable-next-line no-redeclare
                    var exec = new RegExp(keywordsArr[i], "i").exec(words[j]);
                    words[j] = highlightText(words[j], exec[0], tag, classname);
                    break;
                }
            }
        }
        return words.join(" ");
    }
    return content;
}
/**
 * @param {Object} dom 
 * @param {String} attrName
 */
export function checkDisabledAttrExist(dom, disabledAttrName) {
    return $(dom).attr(disabledAttrName) !== undefined && $(dom).attr(disabledAttrName) as any !== "false";
}

export const utils = {
    isFunction: isFunction,
    isArray: isArray,
    isObject: isObject,
    isEmptyObject: isEmptyObject,
    isParentNode: isParentNode,
    isDom: isDom,
    parseJSON: parseJSON,
    cookie: cookie,
    mergeCfg: mergeCfg,
    filterStringArray: filterStringArray,
    mergeCustomCssClasses: mergeCustomCssClasses,
    leftPad: leftPad,
    distinctJSONArrayByKey: distinctJSONArrayByKey,
    highlightText: highlightText,
    fuzzyHighlightText: fuzzyHighlightText,
    fuzzyHighlightText2: fuzzyHighlightText2,
    checkDisabledAttrExist: checkDisabledAttrExist,
    libIsLoaded: libIsLoaded
}