import { deleteFolder } from "./utils";
const colors = require("colors");
try{
    const f = "dist";
    deleteFolder(f);
    console.log(colors.green("Remove folder: " + f + " successfully"));
} catch(e){
    
}


