const e = require("express");
const fs = require("fs");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const host = __dirname;
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/api", (req, res) => {
  res.send("Welcome to API of Totoro Milk Tea shop");
});

server.get("/api/get_image_ads/*", (req, res) => {
  const files = fs.readdirSync(`./image_ads`);
  const filename = req.path.split("/")[3];
  if (files.findIndex((file) => file == filename) >= 0) {
    fs.readFile("./image_ads/1620907308770.jpg", function (err, data) {
      if (err) throw err; // Fail if the file can't be read.
      let stingBase64 = Buffer.from(data).toString("base64");
      res.json({
        image: `data:image/jpeg;base64,${stingBase64}`,
      });
    });
  } else res.json({ image: "Not Found" });
});
// put ads
server.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/api/image") {
    const date = new Date();
    let updateAt = date.getTime();

    const data = req.body;
    const image = data["image"];

    // process to a image file if it is a new image

    if (image.indexOf(".png") < 0 && image.indexOf(".jpg") < 0) {
      const fileType = image
        .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
        .split("/")[1];
      var endFile = "";
      if (fileType == "jpeg") {
        endFile = "jpg";
      } else if (fileType == "png") {
        endFile = "png";
      }

      const filename = date.getTime() + "." + endFile;
      // create new image ads
      fs.writeFile(
        `image_ads/${filename}`,
        image.split(",")[1],
        "base64",
        function (err) {
          console.log(err);
        }
      );

      data.image = `${host}/image_ads/${filename}`;
      req.body = data;
    }
  }
  // Continue to JSON Server router
  next();
});

// set port
const PORT = process.env.PORT || 3000;
// Use default router
server.use("/api", router);
// Start server
server.listen(PORT, () => {
  console.log("JSON Server is running");
});
