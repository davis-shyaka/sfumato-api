const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Admin = mongoose.mongo.Admin;

// Connect to mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => console.log(err.message));

// get a list of all databases
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((MongooseNode) => {
//     /* I use the default nativeConnection object since my connection object uses a single hostname and port. Iterate here if you work with multiple hostnames in the connection object */

//     const nativeConnetion = MongooseNode.connections[0];

//     //now call the list databases function
//     new Admin(nativeConnetion.db).listDatabases(function (err, results) {
//       console.log(results); //store results and use
//       console.log("Individual databases:");
//       results.databases.forEach((db) => {
//         console.log(`- ${db.name}`);
//       });
//     });
//   })
//   .catch((err) => console.log(err.message));
