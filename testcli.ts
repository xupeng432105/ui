import { deleteFolder } from "./utils";
import * as child_exec from "child_process";
import {Builder} from "selenium-webdriver";
import * as path from "path";
deleteFolder(path.join(__dirname,"test/mochawesome-report"))
child_exec.exec('start cmd /c "cd test && npx mocha -t 1000000 -r ts-node/register **.spec.ts --script-mode --files --reporter mochawesome"').on("close", function(){
    const driver = new Builder()
    .forBrowser('chrome')
    .build();
    driver.get(path.join(__dirname,"test/mochawesome-report/mochawesome.html"));
    deleteFolder(path.resolve(__dirname, "dist_test"))
});