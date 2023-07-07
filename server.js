require("dotenv").config();
const { db } = require("./database/config");
// const initModel = require("./models");
const app = require("./app");

//autenticarme con la base de datos
db.authenticate()
  .then(() => console.log("database Authenticated 😊"))
  .catch((err) => console.log(err));

// initModel();

// sincronizarme con la base de datos
db.sync()
  .then(() => console.log("Database synced 👍👌"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3100;
app.listen(port, () => {
  console.log(`app running on port ${port}... 😁`);
});
