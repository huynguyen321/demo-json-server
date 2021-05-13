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

// 'http://totoromilkteaapi.herokuapp.com/';
server.use((req, res, next) => {
  if (req.path.indexOf("/app/image_ads")) {
    fs.readFile("image.jpg", function (err, data) {
      if (err) throw err; // Fail if the file can't be read.
     // res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write('<html><body><img src="data:image/jpeg;base64,');
      res.write(Buffer.from(data).toString("base64"));
      res.end('"/></body></html>');
    });
  }
  next()
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
  console.log("TotoroMilkTea website's JSON Server is running");
});
