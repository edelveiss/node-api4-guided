const express = require("express");

const Shouts = require("../shouts/shouts-model.js");

const router = express.Router();

router.use(express.json());

//----------------------------------------------------------------------------//
// GET / middleware handler...
//----------------------------------------------------------------------------//
router.get("/", (req, res, next) => {
  // This "message of the day" variable was created to demonstrate creating
  // environment variables in the Heroku platform. You can define environment
  // variables that Heroku will create in the OS environment it makes for your
  // app by clicking on the "Settings" tab for your app in Heroku.
  //
  // Our app will not be retrieving the PORT variable from a definition in
  // this way... Heroku automatically creates the PORT environment variable
  // for us (we don't need to tell it to). But there are times when we still
  // want other configuration environment variables that our app can use. And
  // since we don't have access to the shell environment before our
  // application is executed by Heroku, we need to define the variables we
  // want Heroku to create and export for our app using this feature
  // (Settings).
  const messageOfTheDay = process.env.MOTD || "Helo World!";
  res.status(200).json({ api: up, message: messageOfTheDay });
});

router.get("/shouts", (req, res, next) => {
  Shouts.find()
    .then((shouts) => {
      res.status(200).json(shouts);
    })
    .catch((error) => next(error));
});

router.post("/shouts", (req, res, next) => {
  Shouts.add(req.body)
    .then((shout) => {
      res.status(201).json(shout);
    })
    .catch((error) => next(error));
});

router.use(errorHandler);

function errorHandler(error, req, res, next) {
  // do something with error before responding
  // like saving it to a database, sending a mail to the admin
  // or using an external logging service
  res.status(500).json(error.message);
}

module.exports = router;
//===========================================
// const express = require("express");

// const Shouts = require("../shouts/shouts-model.js");

// const router = express.Router();

// router.use(express.json());

// router.get("/", (req, res) => {
//   const motd = process.env.MOTD || "hello world!";
//   res.status(200).json({ api: "up", motd: motd });
// });

// router.get("/shouts", (req, res, next) => {
//   const motd = process.env.MOTD || "hello world!";
//   Shouts.find()
//     .then((shouts) => {
//       res.status(200).json({ motd: motd, shouts });
//     })
//     .catch((error) => next(error));
// });

// router.post("/shouts", (req, res, next) => {
//   Shouts.add(req.body)
//     .then((shout) => {
//       res.status(201).json(shout);
//     })
//     .catch((error) => next(error));
// });

// router.delete("/shouts/:id", (req, res) => {
//   Shouts.remove(req.params.id)
//     .then((count) => {
//       if (count) {
//         res.status(204).end();
//       } else {
//         res.status(404).json({ message: "not found" });
//       }
//     })
//     .catch((error) => next(error));
// });

// router.use(errorHandler);

// function errorHandler(error, req, res, next) {
//   // do something with error before responding
//   // like saving it to a database, sending a mail to the admin
//   // or using an external logging service
//   res.status(500).json(error.message);
// }

// module.exports = router;
