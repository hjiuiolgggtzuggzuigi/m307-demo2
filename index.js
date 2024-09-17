import { createApp } from "./config.js";

const app = createApp({
  user: "autumn_star_7622",
  host: "168.119.168.41",
  database: "demo",
  password: "uaioysdfjoysfdf",
  port: 18324,
});

/* Startseite */
app.get("/storys", async function (req, res) {
  res.render("storys", {});
});

app.get("/registrieren", async function (req, res) {
  res.render("registrieren", {});
});

app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
