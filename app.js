const path = require("path");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const connectRedis = require("connect-redis");

// Models
const User = require("./models/user");

// Helpers
const formHelpers = require("./helpers/form");

// Require the "express" package returns functions that can
// to create an instance of an Express app. We build
// an Express by calling a series of methods to configure
// it before we run it.
// This technique is called the "builder" pattern.
const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.set("view engine", "ejs");

// APPLY HELPER FUNCTIONS

app.locals.errors = undefined;
Object.assign(app.locals, formHelpers);

// app.set('trust proxy', 1) // trust first proxy

// -------------------
// M I D D L E W A R E
// -------------------

// LOGGING
// Calling "logger" returns a middleware function that
// is passed as an argument to "app.use()". Everytime
// a request will be made to our server this middleware function
// will be called and it will log information about that request
// to the console.

app.use(logger("dev"));

// STATIC ASSETS
// Use path.join to combine strings into directory paths.
// Example:
// path.join("/", "Users", "bob") -> "/Users/bob"

// `__dirname` is a global variable inside Node.js scripts
// that returns the full directory path beginning from root (i.e. /)
// to the file that holds `__dirname`.
// console.log("__dirname in ./app.js:", __dirname);

// The static assets middleware will take all files and
// directories from a specified path and serve it all
// publically on the web.
app.use(express.static(path.join(__dirname, "public")));

// URLENCODED

// This middleware will decode data from forms that
// use the POST method.
// When the "extended" option is set to `true`, arrays and objects
// will be support in the url encoding.
app.use(express.urlencoded({ extended: true }));
// The data from the form will be available on the
// `request.body` property instead of the `request.query`.

// METHOD OVERRIDE

app.use(
  methodOverride((req, res) => {
    if (typeof req.body === "object" && req.body._method) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// COOKIE PARSER
app.use(cookieParser());

// CUSTOM MIDDLEWARE

// `app.use` is similar to `app.get`, but it works for
// all HTTP methods (e.g. GET, POST, DELETE, PUT, PATCH, etc)
// all URL paths.
app.use((request, response, next) => {
  // console.log("🍪 Cookies:", request.cookies);
  // Read cookies from the request with `request.cookies`
  // Cookies are represented as object where each key
  // is a cookie name and its value is the cookie's value.
  // You must install & setup "cookie-parser" to
  // read cookies.
  const username = request.cookies.username;

  // Set properties on `response.locals` object to
  // create variables that are global to all of your
  // EJS templates. In code below, we set a property
  // "username" that becomes a variable "username"
  // in all our templates.
  response.locals.username = "";

  if (username) {
    response.locals.username = username;
    // console.log(`🤓 Signed in as ${username}`);
  }

  // The third argument, "next", is a function that
  // when called tells Express that this middleware has completed
  // its job and its time to move to the next middleware in line.
  next();
});

// SESSION

const RedisStore = connectRedis(session);
const sessionMiddleware = session({
  secret: "keyboard cat",
  // Without a `store`, a Express session is lost on restart, because
  // by default the session is saved in memory. In this case, we'll
  // an external db that is extremely fast and is especially tailored
  // for this purpose, Redis, to store our session.
  store: new RedisStore({ port: 6379, host: "localhost" }),
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }
});

app.use(sessionMiddleware);

// CUSTOM USER AUTH. MIDDLEWARE

app.use(async (req, res, next) => {
  const { userId } = req.session;

  res.locals.currentUser = null;

  if (userId) {
    // fetch user
    try {
      const user = await User.find(userId);

      req.currentUser = user;
      res.locals.currentUser = user; // this makes it accessible in view files

      next();
    } catch (error) {
      // If the code above, crashes we're going to take the `error` object and have
      // Express deal with using the `next` function.
      next(error);
    }
  } else {
    next();
  }
});

// URL (Uniform Resource Locator)
// URL http://localhost:4545/hello_world
//  scheme  | host     |port| path

// The "scheme" identifies the protocol being used
// to communicate. Typically, HTTP or HTTPS, but could be SSH, FTP, TCP, etc.

// The "host" identifies the domain or IP that is hosting the server.

// The "path" identifies the location of a resource on the server
// the request is being made to. It's similar to a file path.

// -----------
// R O U T E S
// -----------

const indexRouter = require("./routes/index");
const welcomeRouter = require("./routes/welcome");

app.use("/", welcomeRouter);
// You can split routes into their modules with
// express.Router() instance. When doing so, require the module
// and connect to the app with app.use(<path-prefix>, <router-instance>).
// The app.use(...) will route all routes inside of postsRouter
// prefix all of their URLs with /posts.
app.use("/", indexRouter);

// -------------
// S O C K E T S
// -------------
const knex = require("./db/client");

// Use Express' session middleware as a Socket.io middleware
io.use((socket, next) => {
  // To adapt the Express Session middleware for Socket.io,
  // we need to pass it the same arguments that Express would pass it
  // which are in order: the request, the response and a next function.
  sessionMiddleware(socket.request, socket.request.res, next);

  // The middle will set the session object as a property
  // of `socket.request`. You'll be able to access it as follows:
  // socket.request.session
});

// ...
io.use(async (socket, next) => {
  // console.log(socket.request.session);
  const { userId } = socket.request.session;

  if (userId) {
    socket.currentUser = await User.find(userId);
  }

  next();
});

// .addEventListener
io.on("connection", socket => {
  if (socket.currentUser) {
    console.log(`| IO | ${socket.currentUser.userName} connected`);
  }

  socket.on("disconnect", reason => {
    if (socket.currentUser) {
      console.log(`| IO | ${socket.currentUser.userName} disconnected`);
    }
  });

  socket.on("joinRoom", roomName => {
    console.log("IO User joined room:", roomName);
    // Use the `join` method on the server to have a socket join a
    // room. A room is like group of sockets that we can use to broadcast
    // to only that group.
    socket.join(roomName);
  });

  // In client JavaScript, we call:
  // `socket.emit("newComment", "Hello!")`

  // To receive that data, listen for it on the server side.
  // The code below is waiting for `emit` calls with a first argument
  // of "newComment". The second argument of the `emit` call will be
  // the first argument that the listener callback receives which is
  // `params` in this case.
  socket.on("newComment", async params => {
    console.log("IO Client said:", params);

    const [comment] = await knex("comments")
      .insert(params)
      .returning("*");

    socket.emit("newComment", comment);
    // Emitting on socket will only send a message through socket.
    // To send a message to all connected sockets, use the `broadcast`
    // property. However, this will not send it to the original socket.
    // socket.broadcast.emit("newComment", comment);

    // To emit a message to all sockets in a room (except for the
    // socket itself), use the `to` method with the name of
    // a room, then call `emit` as you normally would.
    socket.to(`post${params.postId}`).emit("newComment", comment);
  });
});

// ------------------
// R U N  S E R V E R
// ------------------

const PORT = 4545;
const HOST = "localhost"; // 127.0.0.1
server.listen(PORT, HOST, () => {
  console.log(`💻 Server listening on http://${HOST}:${PORT}`);
});
