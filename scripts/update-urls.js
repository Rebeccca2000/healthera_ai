// scripts/update-urls.js
const fs = require('fs');
const path = require('path');

const updateFiles = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      updateFiles(filePath);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      content = content.replace(
        /['"]\/healthera_ai\//g, 
        '`${APP_CONFIG.baseUrl}/`'
      );
      
      content = content.replace(
        /['"]\/api\//g,
        '`${APP_CONFIG.apiUrl}/`'
      );
      
      fs.writeFileSync(filePath, content);
    }
  });
};

updateFiles('./src');