const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components'];
const projectRoot = '/Users/nasrullahtanim/Downloads/SlideIn Venture/slidein-venture';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            results.push(fullPath);
        }
    });
    return results;
}

let allFiles = [];
targetDirs.forEach(d => {
    const fullDir = path.join(projectRoot, d);
    if (fs.existsSync(fullDir)) {
        allFiles = allFiles.concat(walkDir(fullDir));
    }
});

let changedCount = 0;
allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Replace hex codes
    let newContent = content
        .replace(/#7A0A0E/gi, '#FF6200')
        .replace(/#8B0000/gi, '#FF6200')
        .replace(/#C24B4B/gi, '#FFA770')
        // Replace image URLs for logos
        .replace(/\/logos\/camera-red\.png/g, '/logos/camera-orange.png')
        .replace(/\/logos\/bubble-red\.png/g, '/logos/bubble-orange.png')
        .replace(/\/logos\/logo-red\.png/g, '/logos/logo-orange.png');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Done. Updated ${changedCount} files.`);
