import fs from "fs";
import path from "path";

function getAllFiles(dirPath, files = []) {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

const routeFolder = "./students/student-form";
const outputFile = "output.txt";

// Clear the file before writing (optional)
fs.writeFileSync(outputFile, "", "utf-8");

getAllFiles(routeFolder).forEach((file) => {
  fs.appendFileSync(outputFile, `\n// ${file}\n`, "utf-8");
  fs.appendFileSync(outputFile, fs.readFileSync(file, "utf-8"), "utf-8");
});
