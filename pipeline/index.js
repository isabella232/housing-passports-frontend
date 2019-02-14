/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

async function main (program) {
  try {
    if (program.args.length !== 1) {
      console.log('Please provide one source file');
      process.exit(1);
    }

    if (!program.O) {
      console.log('Please specify an output directory');
      process.exit(1);
    }

    const data = await fs.readJSON(program.args[0]);
    await fs.ensureDir(program.O);

    console.log('Found', data.features.length, 'to process');

    // Create tasks.
    const tasks = data.features.map(async feat => {
      const fid = feat.properties.id !== undefined ? feat.properties.id + '' : 'no-id';
      const dest = path.join(program.O, `${fid}.json`);

      let images = [];
      // If images path was provided search for images.
      if (program.I) {
        const imgDir = path.join(program.I, fid);
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

// /////////////////////////////////////////////////////////////////////////////
//                              SCRIPT SETUP                                 ///
// /////////////////////////////////////////////////////////////////////////////

program
  .version('0.1.0')
  .arguments('<file>')
  .option('-o <dir>', 'output folder')
  .option('-i <dir>', 'images folder')
  .parse(process.argv);

main(program);
