import * as fs from "fs";
import * as path from "path";
const colors = require("colors");
/**
 * Check directory exist before mkdirSync
 * @param {*} path 
 */
export function mkDir(path) {
    if(!fs.existsSync(path)) {
        try {
            fs.mkdirSync(path);
            logDirSuccess(path);
        } catch (e) {
            logDirFail(path);
        }
    }
}

/**
 * 
 * @param {*} sourceFilePath 
 * @param {*} targetFolderPath 
 */
export function copyFileSync(sourceFilePath, targetFolderPath) {
    var targetFilePath;
    if (fs.existsSync(targetFolderPath)) {
        if (fs.lstatSync(targetFolderPath).isDirectory()) {
            targetFilePath = targetFolderPath + "/" + path.basename(sourceFilePath);
            writeFile(targetFilePath, fs.readFileSync(sourceFilePath), { "flag": "w+" });
        }
    }
}

/**
 * 
 * @param {*} sourceFolderPath 
 * @param {*} targetFolderPath 
 */
export function copyFolderSync(sourceFolderPath, targetFolderPath) {
    mkDir(targetFolderPath);
    if(fs.lstatSync(sourceFolderPath).isDirectory()) {
        var filePaths = fs.readdirSync(sourceFolderPath);
        for(var i = 0; i < filePaths.length; i++) {
            var curFilePath = path.join(sourceFolderPath,"/", filePaths[i]);
            if(fs.lstatSync(curFilePath).isDirectory()) {
                copyFolderSync(curFilePath, path.join(targetFolderPath, "/", filePaths[i]));
            } else {
                copyFileSync(curFilePath, targetFolderPath);
            }
        }
    }
}

/**
 * Sync write file with string
 * @param {*} path 
 * @param {*} data 
 * @param {*} options 
 */
export function writeFile(path, data, options) {
    try {
        fs.writeFileSync(path, data, options);
        logFileSuccess(path)
    } catch (e) {
        logFileFail(path);
    }
}

/**
 * @private
 * @param {*} dirName 
 */
export function logDirSuccess(dirName) {
    console.log("Create dir: " + dirName + colors.green( " successfully"));
}

/**
 * @private
 * @param {*} fileName 
 */
export function logFileSuccess(fileName) {
    console.log("Create file: " + fileName + colors.green(" successfully"));
}

/**
 * @private
 * @param {*} dirName 
 */
export function logDirFail(dirName) {
    console.log("Create dir: " + dirName +  colors.red(" failed"));
}

/**
 * @private
 * @param {*} fileName 
 */
export function logFileFail(fileName) {
    console.log("Create file: " + fileName + colors.red(" failed"));
}

/**
 * 
 * @param path 
 */
export function deleteFolder(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
