//----------------------------------------------------------------------------//
// DEVOPS AND HEROKU AUTO DEPLOYMENT
//----------------------------------------------------------------------------//
// In many environments, apps are deployed through "stages". Typically, a
// collection of services and processes works together to automatically move the
// code through these stages before making it available to the public.
//
// The main motivation is to provide a consistent effort to test the validity of
// the code before releasing it. Automation is the main way to do that.
//
// This collection of processes is called a "pipeline". See Jenkins as a typical
// pipeline system. It's fun stuff!
//
// Typically, an environment will have the following stages (though they may be
// named differently):
// * Dev - the environments where developers write and self-test code
// * Test - an environment where automated tests run against the code and the
//   system.
// * Staging - an environment where the actual deployment is tested (not the
//   functionality of the code, but whether or not the right code and
//   configurations are deployed)
// * Production - the final environment where customers and users can access the
//   app or service.
//
// Many public cloud services, like Heroku, can be used for any of these stages.
// For example, your "Dev" environments may be on a local area network within
// the building. But when developers check code in, that code can automatically
// be deployed to a Test environment, where automated tests run. If they pass,
// then the code can be automatically deployed to the Staging environment, etc.
// These environments can be hosted in a public cloud service, like Heroku.
//
// You can configure Heroku to automatically deploy your software to its
// environment. To do this:
//
// * Create a Heroku account
// * Log in and create an application
// * On the "Deploy" tab, connect the application to your GitHub account
// * Select the github repo you want to deploy to Heroku from
// * Select the branch in the repo you want to deploy to Heroku from
// * Enable Automatic Deployments
//
// This will configure github to allow Heroku to access your github repo/branch,
// and to notify Heroku when code changes are checked into the branch.
//
// This will cause Heroku to deploy and run your code.
//
// Don't forget the "start" script in package.json! This is how Heroku starts
// your app.

//----------------------------------------------------------------------------//
//  DOTENV AND BEST PRACTICES FOR USING ENVIRONMENTS TO CONFIGURE APPS
//----------------------------------------------------------------------------//
//  the dotenv package allows you to specify "environment variables" in a file
//  called ".env", without having to actually create them in your operating
//  system shell environment, but also without preventing you from using the
//  operating system shell environment to create variables that impact how the
//  app works. Using environment variables is a practice that has existed for as
//  long as Unix supported environment variables, and is a common way to allow
//  system administrators to provide environment-specific config data to an app.
//  That way, sensitive config data (like authentication credentials) don't have
//  to be shared or passed around in an insecure manner.
//
//  Check out https://en.wikipedia.org/wiki/Environment_variable if  you are
//  truly curious, or bored. Note the lack of MacOS in the operating systems.
//  This is because MacOS is considered a "Unix or Unix-like operating system",
//  and behaves just like Unix, with "bash" as its shell (note: bash is actually
//  an acronym, meaning Bourne Again SHell, because it's a replacement for the
//  Bourne shell, which was released in 1979.)
//
//  You can create environment variables in the operating system with the
//  following syntax:
//
//    VARNAME=value
//
//  However, note that doing so only creates the variable for the terminal
//  session in which the command is executed. This makes the variable available
//  to shell scripts that are executed in that terminal session.
//
//  To make the environment variable available to *other* applications (besides
//  the shell terminal), you must "export" them. You do that with this syntax:
//
//    export VARNAME=value
//
//  Even so, you can simulate the creation of environment variables, without
//  having to hassle with the operating system or shell scripts etc., by adding
//  "environment variable" definitions to the .env file in the application root
//  directory, and using the dotenv package. dotenv will take variable
//  definitions in the .env file, and add them to the process.env collection,
//  along with *real* environment variables that are exported from the operating
//  system shell terminal environment. In this way, you can develop your app to
//  use the time-honored method of receiving configuration values from an
//  operating system environment, and yet not have to actually mess with
//  environment variables.
//
//  As additional context, note that very often, system owners will create
//  scripts to launch applications. Within those scripts, they will create and
//  export environment variables, so when they get to the actual command that
//  launches the application (such as "node index.js"), the application will
//  have configuration values established from within the script that executed
//  it. In that way, they can keep the definition of environment variables that
//  configure the app together with the command that actually launches the app.
//  By storing that all in an executable script, they effectively created a new
//  application: one that sets configuration variables, then launches your
//  server, which will  use them. This is a typical pattern among Unix/Linux
//  system operators.
//
//  In this command below, we are just taking the export from the dotenv
//  package, and calling the .config() method on it. If you are interested to
//  see what .config() does, have a look at ./node_modules/dotenv/lib/main.js,
//  and see the config() method. It calls another method called parse() (which
//  is also exported). It really just reads the .env file, parses it, and then
//  does this (I copied this line right from the source code):
//
//      const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })
//
//      Object.keys(parsed).forEach(function (key) {
//        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
//          process.env[key] = parsed[key]
//        } else if (debug) {
//          log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
//        }
//      })
//
//  So it just adds them to the existing process.env object, if the "key"
//  (variable name) doesn't already exist in process.env (i.e. if it's not
//  defined and exported as an environment variable). This effectively makes it
//  so that defined environment variables are NOT overriden by the .env file.

require("dotenv").config();
const server = require("./api/server.js");

//----------------------------------------------------------------------------//
//  THE PORT ENVIRONMENT VARIABLE
//----------------------------------------------------------------------------//
//  you can destructure the environment variables if yuo want to, but a good
//  practice is to set up a default just in case it's not a defined environment
//  variable, AND it's not in .env. In order to do that, destructuring doesn't
//  really work, because not being in process.env means the destructured
//  variable will be undefined. Nevertheless, I put the destructuring syntax
//  below just for reference.
//
//  We are using the PORT environment variable name because when our app runs in
//  Heroku's environment, the PORT environment variable will be defined by
//  Heroku, with the value of the port that has been assigned to our app. That
//  way, we can listen on that port.
//
//  Note that the URL to access your app on Heroku won't include the port
//  number. Your app will likely be assigned to listen on a port number that is
//  >50000... but when you hit the URL for your app on Heroku, Heroku's firewall
//  will redirect the request to your app on the port it's listening on. The
//  request will come in on [hostname]:443 (the https port), and the firewall
//  will redirect it to [ip_address]:[port], where ip_address is the address of
//  the host where your app has been launched by Heroku, and port is the
//  assigned port that Heroku publishes to our app in the PORT environment
//  variable.
//
//  So, we need to look for PORT and use it to listen on the right port when
//  running in Heroku.
//
//  And to simulate an environment variable for our dev environment, we can do
//  what Heroku does and define a PORT environment variable (or define one in
//  .env), and access it from process.env.
//
//  The syntax below just checks to see if PORT is defined, and uses its value
//  if it is, and uses 5000 as a default if it's not.
const port = process.env.PORT || 5000;
// const { PORT } = process.env;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});

//----------------------------------------------------------------------------//
//  DEPLOY TO HEROKU FROM GITHUB
//----------------------------------------------------------------------------//
//  Once we have our app developed and tested, we are ready to deploy it to
//  Heroku. We do this by creating an "app" in Heroku, and configuring it to
//  automatically deploy from our github repo, when we push to it.
//
//  You can find instructions for configuring automatic deploys from github to
//  Heroku here: https://devcenter.heroku.com/articles/github-integration
//
//  Note that in order for Heroku to successfully start our application once it
//  is automatically deployed, we MUST have a "start" script in the package.json
//  file. This is what Heroku looks for to know how to launch our application
//  ince it is deployed.
//
//  In addition, though this is covered in other places, remember that Heroku is
//  a shared environment. Many applications from different accounts are running
//  in the same environment. Each app that needs to listen for TCP connections
//  (such as from an HTTP/S client) must be guaranteed to listen on a unique
//  port. Since it is impossible to collaborate with other app developers (who
//  knows where they are, who they are?), Heroku instead makes the TCP port that
//  you need to listen on available to you through an environment variable that
//  it creates called PORT. By reading that variable, we can use it to make our
//  app listen on a TCP port that we know is not being used by anyone else
//  (because Heroku will ensure that it is just for us.) In additon, Heroku will
//  modify its firewall to direct inbound traffic addressed to our app's URL on
//  port 80 or 443 to the machine where our app is running, a`nd the port number
//  assigned to our app (and published in our environment's PORT variable.)

//----------------------------------------------------------------------------//
//  THE HEROKU CLI
//----------------------------------------------------------------------------//
//  Also, consider installing the Heroku CLI. It is very useful, though you will
//  need to read documentation to know what you can do with it.
//
//  You can download the heroku cli here:
//
//    https://devcenter.heroku.com/articles/heroku-cli
//
//  You can also install it from npm:
//
//    npm install heroku --global
//        or
//    npm i heroku -g
//
//  Once installed, you need to log into the heroku account, so the cli commands
//  will work against your account and applications.
//
//    heroku login -i
//
//  The "-i" command line parm tells the Heroku CLI to prompt you for username
//  and password in the command line. Otherwise, it will launch a browser and
//  make you log in there, then swtich back to the CLI.
//
//  You won't have to do this every time... the first time you do it, it will
//  create a file in your "home" directory (different locations for Windows and
//  Mac... you should know where it is...) called .netrc (for MacOs and
//  Linux-like OS's) or _netrc (on Windows). The "netrc" format is a well-known
//  format for storing credentials, and different utilities and applications
//  know how to use the values there. (The netrc file/format was originally
//  created for use with FTP clients, but is now used by many apps that need to
//  access remote systems... see https://linux.die.net/man/5/netrc )
//
//  Heroku stores your email address and an API token in the .netrc file, so the
//  next time you try to do something with the Heroku CLI (like show logs for
//  your running app), you don't have to log in again. You will have to provide
//  the name of the app it should show logs for though... see below.

//----------------------------------------------------------------------------//
//  VIEWING HEROKU APP LOGS
//----------------------------------------------------------------------------//
//  You can view console messages (created by your app) and other log entries
//  (created by the Heroku environment) by clicking More | View Logs (in the
//  upper-right corner of the Heroku dashboard.).
//
//  You can also use the Heroku CLI to view your apps log files. After you have
//  logged into the Heroku account from the CLI, the following command will
//  allow you to "tail" the log file (see
//  https://en.wikipedia.org/wiki/Tail_(Unix) to learn about what "tail" is.)
//  The CLI command to view the scrolling log file in real time is:
//
//    heroku logs --tail -a <app_name>
//
//  ...where <app_name> is the name of your Heroku app.
//
//  You can get a list of your Heroku apps from the CLI with this command:
//
//     heroku apps
//================================================
// require("dotenv").config();
// const server = require("./api/server.js");
// console.log(process.env.WHATEVERWEWANT);
// const port = process.env.PORT || 5000;
// server.listen(port, () => {
//   console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
// });
