1.Run `npm install` to install all the dependencies(maybe you have to install webpack/webpack-cli -g, I forget)
2.Run `npm start` to enter dev mode, it will watch the local files and open a browser window for you
    or Run `npm run build` to build a `dist` folder
    or Run `npm run bcc` to build and copy the js/css bundles to target folders and delete the `dist` folder
	or Run `npm run doc` to generate docs
	or Run `npm run doc_l` to generate docs and open in browser

NOTE: if 'chromedriver' is installed failed, please try more times.


TIPS: for convinience, added command line && file watch
1. Run "npm link" then you can run 
	"newui s" to replace "npm run start", 
	"newui b" to replace "npm run build", 
	"newui bcc" to replace "npm run bcc",
	"newui t" to replace "npm run test",
2. Run "node watchfile" to watch file changes and automatically run "npm run bcc" to prevent you forget build and replace the files in portal(If you exec tips1, you can run "newui w" instead)