import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;
  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.post("/register", function (req, res) {
    var passwort = bcrypt.hashSync(req.body.passwort, 10);
    pool.query(
      "INSERT INTO users (email, passwort) VALUES ($1, $2)",
      [req.body.email, passwort],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/login");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login", function (req, res) {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [req.body.email],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (result.rows.length > 0) {
          // Prüfen, ob ein Ergebnis existiert
          const user = result.rows[0]; // Erstes Ergebnis in einer Variablen speichern
          if (bcrypt.compareSync(req.body.passwort, user.passwort)) {
            // Passwort prüfen
            req.session.userid = user.id; // Benutzer-ID in der Session speichern
            res.redirect("/"); // Weiterleitung nach erfolgreichem Login
          } else {
            res.redirect("/login"); // Falsches Passwort
          }
        } else {
          console.error("Kein Benutzer gefunden."); // Debug-Ausgabe
          res.redirect("/login"); // Weiterleitung bei fehlendem Benutzer
        }
      }
    );
  });

  return app;
}

export { upload };
