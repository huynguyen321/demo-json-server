const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const fs = require("fs");
const host = __dirname;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/api/image") {
    const date = new Date();
    req.body.createdAt = date.getTime();

    const data = req.body;

    const image = data["image"];

    const fileType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0].split("/")[1];
    var endFile = "";
    if (fileType == "jpeg") {
      endFile = "jpg";
    } else if (fileType == "png") {
      endFile = "png";
    }

    const filename = date.getTime() + "." + endFile;
    // create new image ads
    fs.writeFile(
      `image/${filename}`,
      image.split(",")[1],
      "base64",
      function (err) {
        console.log(err);
      }
    );
    data.image = `${host}/image/${filename}`;
    req.body = data;
  }
  // Continue to JSON Server router
  next();
});

// Use default router

const PORT = process.env.PORT || 3000;
server.use("/api", router);
server.listen(PORT, () => {
  console.log("Demo JSON Server is running");
});
