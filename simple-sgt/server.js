const express = require("express");
const { getRoutes } = require("./src/routes");
const app = express();
const port = process.env.PORT || 4445;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

getRoutes(app);

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));