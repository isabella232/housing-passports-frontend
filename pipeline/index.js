/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

async function splitCommand (file, command) {
  try {
    if (!command.O) {
      console.log('Please specify an output directory');
      process.exit(1);
    }

    const data = await fs.readJSON(file);
    await fs.ensureDir(command.O);

    console.log('Found', data.features.length, 'to process');

    // Create tasks.
    const tasks = data.features.map(async feat => {
      const fid = feat.properties.id !== undefined ? feat.properties.id + '' : 'no-id';
      const dest = path.join(command.O, `${fid}.json`);

      let images = [];
      // If images path was provided search for images.
      if (command.I) {
        const imgDir = path.join(command.I, fid);
        try {
          const contents = await fs.readdir(imgDir);
          images = contents.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
          });
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          console.log(`Image folder not found: '${imgDir}'`);
        }
      }

      return fs.writeJSON(dest, {
        ...feat.properties,
        images
      });
    });

    await Promise.all(tasks);

    console.log('Done');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function point2json (file, dest) {
  try {
    const data = await fs.readJSON(file);

    const centroids = data.features.map(f => {
      if (f.geometry.type !== 'Point') {
        throw new Error('Non Point feature type found in source geoJSON');
      }
      const [lon, lat] = f.geometry.coordinates;
      return {
        i: f.properties.ID,
        c: [Math.round(lon * 1e6) / 1e6, Math.round(lat * 1e6) / 1e6]
      };
    });

    await fs.writeJSON(dest, centroids);

    console.log('Done');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// /////////////////////////////////////////////////////////////////////////////
//                              SCRIPT SETUP                                 ///
// /////////////////////////////////////////////////////////////////////////////

program
  .version('0.1.0');

program.command('split <file>')
  .option('-o <dir>', 'output folder')
  .option('-i <dir>', 'images folder')
  .action(splitCommand);

program.command('point2json <file> <dest>')
  .description('Extracts the point coordinates from the input file geoJSON into a JSON array')
  .action(point2json);

program.parse(process.argv);
