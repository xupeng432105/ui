import { Builder } from "selenium-webdriver";
import { assert, should } from "chai";
var path = require("path");
var driver = new Builder()
    .forBrowser('chrome')
    .build();
driver.get(path.resolve(__dirname, "../dist_test/index.html"));

describe('ESCMS.liminitedViewer', () => {

    after(function(){
        driver.close();
    });

    it("ESCMS.liminitedViewer.init($obj)", (done) => {
        driver.findElement({ id: "testLiminitedViewer1"}).findElement({className: "es-limited-viewer-content"}).then(ele => {
            assert.exists(ele, "Element es-limited-viewer-content not exist");
            done();
        })
    });
    
    it("ESCMS.liminitedViewer.unfold($obj)", (done) => {
        driver.executeScript('$("#Button_testLiminitedViewer2").click();').then(() => {
            return driver.findElement({ id: "testLiminitedViewer2" }).then(ele => {
                return ele.getCssValue("max-height").then(val => {
                    assert.equal(val, '1000px', "Max height should be 1000px");
                    done();
                });
            })
        });
    });

    it("ESCMS.liminitedViewer.fold($obj)", (done) => {
        driver.executeScript('$("#Button_testLiminitedViewer3").click();').then(() => {
            return driver.findElement({ id: "testLiminitedViewer3" }).then(ele => {
                return ele.getCssValue("max-height").then(val => {
                    assert.notEqual(val, '1000px', "Max height shoud not be 1000px");
                    done();
                });
            })
        });
    });
});


