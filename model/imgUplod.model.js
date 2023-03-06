const mongoose = require("mongoose");

const imgUploaderSchema = new mongoose.Schema({
  name: String,
  img: String,
});

module.exports = mongoose.model("ImgDatabase", imgUploaderSchema);
