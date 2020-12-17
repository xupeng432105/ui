/**
 * Internal logger
 * @namespace ESCMS.logger
 */
export function logger() { }
/**
 * 1: dev, 2:prod
 */
logger.env = 2;
/**
 * 
 * @param msg The msg to show
 * @param msgType 1:normal,2:warning,3:error, default is 1
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
 * @param msg The msg to show
 * @param msgType 1:normal,2:warning,3:error, default is 1
 * ```
 * ESCMS.logger.dev("Some message wiil not be shown in prod env")
 * ```
 */
logger.dev = function (msg, msgType?) {
    if (logger.env == 1) {
        logger.showMsg(msg, msgType);
    }
}

/**
 * 
 * @param msg The msg to show
 * @param msgType 1:normal,2:warning,3:error, default is 1
 * ```
 * ESCMS.logger.prod("Some message wiil be shown in any env")
 * ```
 */
logger.prod = function (msg, msgType) {
    logger.showMsg(msg, msgType);
}