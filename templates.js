const fs = require('fs');
const templateFolder = './src/templates';
const minify = require('html-minifier').minify; // https://github.com/kangax/html-minifier

var result = `
if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}
if(typeof ProductJS.templates !== 'object') {
    ProductJS.templates = {};
} 
`;

var files = fs.readdirSync(templateFolder);

files.forEach(file => {
    if(file.indexOf('.html') > -1) {
        var name = file.replace('.html', '')
        var contents = minify(fs.readFileSync(`${templateFolder}/${file}`).toString(), {
            maxLineLength: 0,
            collapseWhitespace: true
        }).replace(/'/g, "\\'");


        console.log(name);
        result += `
if(typeof(ProductJS.templates.${name}) !== 'string') {
    ProductJS.templates.${name} = '${contents}';
}`;
    }
});

console.log(result);
fs.writeFileSync("./build/templates.js", result);
