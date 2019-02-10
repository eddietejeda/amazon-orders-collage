const csv = require('fast-csv');
const fs = require('fs-extra');
const moment = require('moment');
const readline = require('readline');

function generateHeatmap(csvPath){
  const heatmap = {};
  // parse the csv of orders
  csv
    .fromPath(csvPath, { headers: true })
    .on('data', (row) => {
      const orderDate = row['Order Date'];
      const timestamp = moment(orderDate, "MM-DD-YYYY").unix();
      
      heatmap[timestamp] = heatmap[timestamp] ? heatmap[timestamp] + 1 : 1;
    })
    .on('end', () => {
      const heatmapPath = "./output/heatmap.json"
      fs.writeFile(heatmapPath, JSON.stringify(heatmap, null, 4));      
      console.log(`Done!\nJSON saved to ${heatmapPath}`);
      
    })
    .on('error', (error) => {
      console.error(error);
    });
    
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('Download CSV from https://www.amazon.com/gp/b2b/reports/; Then provide path to CSV here: ', (csvPath) => {
  generateHeatmap(csvPath);
  rl.close();
});


