const fs = require("fs");
const io = require("./io");

const main = async (paths, message) => {
  let allExists = true;
  paths.forEach((path) => {
    allExists = allExists && fs.existsSync(path);
  });

  if (allExists) {
    const response = await io.question(message, "yellow");
    return response === "n";
  }

  return false;
};

module.exports = main;
