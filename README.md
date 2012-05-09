okapi-memory
============
okapi-memory is a game that runs in the browser. The user should memorize products of an ecommerce shop running on Demandware. As incentive the user will receive a coupon code when finishing the game.
The game runs best in Chrome/Safari (so you should run it in that browser). Runs as well in FF. No IE as it does not support CSS3 transformations yet.
 
Technical Details
-----------------
- The information about products and images shown in the game are retrieved using DW OCAPI interface (search/product api). 
- JSONP is used to make the data available to the game. 
- The game itself uses CSS3 transformations, so it will run only in the most recent browsers (FF, Chrome, Safari). It does not run in IE as this browser does not support CS3 transformations yet.
- The game can be hosted anywhere (e.g. brand site). It contains static files only (HTML, CSS, JS) and does not require any server-side components.  
