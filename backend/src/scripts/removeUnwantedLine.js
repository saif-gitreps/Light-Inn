import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the built file where the line exists
const filePath = resolve(__dirname, "../../dist/middlewares/auth.middleware.js");

// Function to remove the unwanted line
function removeUnwantedLine(file, lineToRemove) {
   if (existsSync(file)) {
      let content = readFileSync(file, "utf8");
      // Remove the specified line
      const updatedContent = content
         .split("\n")
         .filter((line) => !line.includes(lineToRemove))
         .join("\n");

      // Write the updated content back to the file
      writeFileSync(file, updatedContent, "utf8");
      console.log(`Removed line '${lineToRemove}' from ${file}`);
   } else {
      console.error(`File not found: ${file}`);
   }
}

// Line to remove and file update
const lineToRemove = `import { Request } from "express";`;
removeUnwantedLine(filePath, lineToRemove);
