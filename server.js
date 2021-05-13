
const host = "https://demo-json-server123.herokuapp.com/";
const express = require("express");
const server = express();
const fileupload = require("express-fileupload");
server.use(fileupload());

server.get('/',(req,res,next)=>{
  res.status(200).send("OK")
})

server.post("/upload", function (req, res, next) {
  const file = req.files.photo;
  const filename = (new Date()).getTime()
  file.mv(`./uploads/ ${filename}.${(file.name).split('.')[1]}`, function (err, result) {
    if (err) throw err;
    res.send({
      success: true,
      message: "File uploaded!",
      url : `${__dirname}/uploads/ ${filename}.${(file.name).split('.')[1]}`
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Demo JSON Server is running");
});
