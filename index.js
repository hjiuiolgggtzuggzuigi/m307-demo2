import { createApp } from "./config.js";

const app = createApp({
  user: "autumn_field_7551",
  host: "bbz.cloud",
  database: "autumn_field_7551",
  password: "a10c4fb3242bbb1f2504be3605836b1a",
  port: 30211,
});

/* Startseite */
app.get("/storys", async function (req, res) {
  const posts = await app.locals.pool.query("select * from posts");
  res.render("storys", { posts: posts.row });
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
