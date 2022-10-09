const express = require("express");
const exphbs = require("express-handlebars");
const https = require("https");
const app = express();

const PORT = process.env.PORT || 3000;

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
    },
  })
);

app.set("view engine", ".hbs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/freshers", (req, res) => {
  res.render("freshers");
});

app.get("/hrmanager", (req, res) => {
  https.get(
    "https://resume-filtering-web.herokuapp.com/api/applicant/",
    (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        let jsonData = JSON.parse(data);

        res.render("hr", {
          data: {
            skill: null,
            reqArr: jsonData.response,
          },
        });
      });
    }
  );
});

app.get("/hrmanager/search", (req, res) => {
  const { skill } = req.query;
  https.get(
    "https://resume-filtering-web.herokuapp.com/api/applicant/",
    (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        let jsonData = JSON.parse(data);
        let reqArr = jsonData.response.filter((resume) =>
          resume.skills.includes(skill)
        );

        res.render("hr", {
          data: {
            skill: skill,
            reqArr,
          },
        });
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
