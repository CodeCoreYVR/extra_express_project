const express = require("express");
const router = express.Router();

// The following method creates a "route" with a callback that
// used to build the response that'll be sent back to the client.
// In the code below, HTTP requests made to the path "/hello_world"
// are handled by this callback which sends back the text
// "Hello, World!"

// The first argument to the method "get" is the URL path and the
// second is a callback.
router.get("/hello_world", (request, response) => {
  // The "request" argument is an object that represents the request
  // being made by the client. It contains information about the client
  // and everything the client is asking for.

  // The "response" argument is an object that represents the server's
  // reply to the client. We build out the content to send back to
  // the client with it.
  response.send("Hello, Peoples!");
});

router.get("/", (request, response) => {
  console.log('#####');
  console.log(request.currentUser);
  console.log('#####');
  // `response.render(<ejs-filepath>)` is used
  // to render a template from the "views/" directory at
  // the relative file path of <ejs-filepath>. When writing
  // the file path, you can ignore the extension.

  // In the call below, the file at "./views/welcome.ejs" is
  // rendered into HTML and is sent as the content of the response
  // to the client.
  response.render("welcome");
});

router.get("/survey", (request, response) => {
  console.log("---------------------------");
  console.log("Request's Query String Data");
  console.log("---------------------------");
  console.log(request.query);

  // "request.query" is a property that holds an object
  // which contains of all the key-value pairs from
  // a URL's query string.
  // For example:
  // .../survey?fullName=Steve&color=%2300fdff
  // request.query === { fullName: "Steve", color: "#00fdff"} // true

  response.render("survey");
});

router.get("/survey/results", (request, response) => {
  // response.send(request.query);
  const fullName = request.query.fullName;
  const color = request.query.color;
  const timeOfDay = request.query.timeOfDay;

  // (Optional) `response.render` can take an object as
  // a second argument where all its key-value pairs will
  // turned into variables inside of the template that is rendered.
  // This is how we share data with template files.
  response.render("surveyResults", {
    fullName: fullName,
    color: color,
    timeOfDay: timeOfDay
  });
});

// URL http://localhost:4545/survey?fullName=Steve&color=%2300fdff
//   scheme | host     |port| path | query string (search string)

// A "query" is a way to store data in the data in the URL.
// It use the URL Encoding format.

// Following a url's path and seperated by a "?" will be a
// a query string which holds key-value pairs of data.
// The format appears as follows:
// ?[key_1]=[value_1]&[key_2]=[value_2]&[key_3]=[value_3]

// When a form is submitted, its data will by default be included
// into the URL with the above format.

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
router.post("/sign_in", (request, response) => {
  const username = request.body.username;

  // `response.cookie(<cookie-name>, <cookie-value>, <options)`
  // The above method is added to the `response` object by
  // the `cookie-parser` middleware. Use to send cookies to
  // the browser.
  // - The first argument is a string that's the name of the cookie
  // - The second, a value for the cookie
  // - (optional) The last, options for the cookie

  response.cookie("username", username, { maxAge: COOKIE_MAX_AGE });

  // Like `response.send` and `response.render`, `response.redirect`
  // ends the response with a redirect status code and a location (i.e. URL) where
  // the browser should make a GET request to (should browse to).
  response.redirect("/");
});

router.post("/sign_out", (request, response /*, next */) => {
  response.clearCookie("username");
  response.redirect("/");
});

module.exports = router;
