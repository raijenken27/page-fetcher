const request = require('request');
const fs = require('fs');
const readline = require('readline');

// Check if both URL and file path arguments are provided
if (process.argv.length !== 4) {
  console.error('Usage: node fetcher.js <URL> <file-path>');
  process.exit(1);
}

const url = process.argv[2];
const filePath = process.argv[3];

// Check if the file already exists
if (fs.existsSync(filePath)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`File "${filePath}" already exists. Do you want to overwrite it? (Y/N): `, (answer) => {
    if (answer.trim().toLowerCase() === 'y') {
      downloadAndSave();
    } else {
      console.log('Operation canceled.');
    }
    rl.close();
  });
} else {
  downloadAndSave();
}

function downloadAndSave() {
  // Make an HTTP request to the provided URL
  request(url, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.error('Error:', error || `HTTP Status Code: ${response.statusCode}`);
    } else {
      // Write the response body to the local file
      fs.writeFile(filePath, body, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          const fileSize = Buffer.byteLength(body, 'utf8');
          console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
        }
      });
    }
  });
}
