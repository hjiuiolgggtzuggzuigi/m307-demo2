import { createApp, upload } from "./config.js";

const app = createApp({
  user: "autumn_field_7551",
  host: "bbz.cloud",
  database: "autumn_field_7551",
  password: "a10c4fb3242bbb1f2504be3605836b1a",
  port: 30211,
});

app.get("/", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  const posts = await app.locals.pool.query(
    "SELECT posts.*, email FROM posts INNER JOIN users ON posts.user_id = users.id"
  );
  const likes = await app.locals.pool.query("select * from likes");
  const kommentare = await app.locals.pool.query(
    "select * from kommentare INNER JOIN users ON kommentare.user_id = users.id"
  );
  res.render("storys", {
    posts: posts.rows,
    likes: likes.rows,
    kommentare: kommentare.rows,
  });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});

app.post("/houzchopf", upload.single("bild"), async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (titel, inhalt, datum, bild, user_id) VALUES ($1, $2, $3, $4, $5)",
    [
      req.body.titel,
      req.body.inhalt,
      req.body.datum,
      req.file.filename,
      req.session.userid,
    ]
  );

  res.redirect("/");
});

app.post("/voupfoschte", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO kommentare (inhalt, datum) VALUES ($1, $2)",
    [req.body.inhalt, req.body.datum]
  );

  res.redirect("/");
});
