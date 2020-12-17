import { Builder } from "selenium-webdriver";
import { assert, should } from "chai";
var path = require("path");
var driver = new Builder()
    .forBrowser('chrome')
    .build();

driver.get(path.resolve(__dirname, "../dist_test/index.html"));

describe('Test tab', () => {

    after(function () {
        driver.close();
    });

    describe("Init", () => {
        it("Test pane0 should hide, pane1 shoud show", (done) => {
            driver.executeScript('var $testTab1 = $("#testTab1");\
                               $testTab1.find(".tab-nav-item")[1].click();').then(() => {
                return driver.findElement({ id: "testTab1" }).findElements({ className: "tab-content-pane" }).then(eles => {
                    var p1 = eles[0].getCssValue("display");
                    var p2 = eles[1].getCssValue("display");
                    return Promise.all([p1, p2]).then(displays => {
                        assert.equal(displays[0], "none");
                        assert.equal(displays[1], "block");
                        done();
                    })
                })
            });
        });

        it("Test nav0 should inactive, nav1 shoud active", (done) => {
            driver.executeScript('var $testTab1 = $("#testTab1");\
                               $testTab1.find(".tab-nav-item")[1].click();').then(() => {
                return driver.findElement({ id: "testTab1" }).findElements({ className: "tab-nav-item" }).then(eles => {
                    var p1 = eles[0].getAttribute("class");
                    var p2 = eles[1].getAttribute("class");
                    return Promise.all([p1, p2]).then(classes => {
                        assert.notMatch(classes[0], /active/);
                        assert.match(classes[1], /active/);
                        done();
                    })
                })
            });
        });
    })

});


