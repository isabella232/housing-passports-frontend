'use strict';

const fs = require('fs');
const gulp = require('gulp');
const cp = require('child_process');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('fancy-log');
const notifier = require('node-notifier');
const historyApiFallback = require('connect-history-api-fallback');
const through2 = require('through2');

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

const bs = browserSync.create();

// Environment
// Set the correct environment, which controls what happens in config.js
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DS_ENV = process.env.DS_ENV || process.env.NODE_ENV;

// When being built by circle is set to staging unless we're in the prod branch
if (process.env.CIRCLE_BRANCH) {
  if (process.env.CIRCLE_BRANCH === process.env.PRODUCTION_BRANCH) {
    process.env.NODE_ENV = 'staging';
    process.env.DS_ENV = 'staging';
  } else {
    process.env.NODE_ENV = 'production';
    process.env.DS_ENV = 'production';
  }
}

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Helper functions --------------------------------//
// ---------------------------------------------------------------------------//

const isProd = () => process.env.NODE_ENV === 'production';
const readPackage = () => JSON.parse(fs.readFileSync('package.json'));

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Callable tasks ----------------------------------//
// ---------------------------------------------------------------------------//

function clean () {
  return del(['.tmp', 'dist']);
}

function serve () {
  bs.init({
    port: 3000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': './node_modules'
      },
      ghostMode: false,
      middleware: [
        historyApiFallback()
      ]
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/assets/graphics/**/*',
    '!app/assets/icons/collecticons/**/*'
  ], bs.reload);

  gulp.watch('app/assets/icons/collecticons/**', collecticons);
  gulp.watch('app/assets/scripts/**/**', javascript);
  gulp.watch('package.json', vendorScripts);
}

module.exports.clean = clean;
module.exports.serve = gulp.series(
  collecticons,
  gulp.parallel(
    vendorScripts,
    javascript
  ),
  serve
);
module.exports.default = gulp.series(
  clean,
  collecticons,
  gulp.parallel(
    vendorScripts,
    javascript
  ),
  () => gulp.src('app/assets/styles/collecticons.css').pipe(gulp.dest('dist/assets/styles/')),
  gulp.parallel(
    html,
    imagesImagemin
  ),
  finish
);

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Browserify tasks --------------------------------//
// ------------------- (Not to be called directly) ---------------------------//
// ---------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// main.js
function javascript () {
  // Ensure package is updated.
  const pkg = readPackage();
  return browserify({
    entries: ['./app/assets/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {},
    bundleExternal: false,
    fullPaths: true
  })
    .external(pkg.dependencies ? Object.keys(pkg.dependencies) : [])
    .bundle()
    .on('error', function (e) {
      notifier.notify({
        title: 'Oops! Browserify errored:',
        message: e.message
      });
      console.log('Javascript error:', e); // eslint-disable-line
      if (isProd()) {
        throw new Error(e);
      }
      // Allows the watch to continue.
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/assets/scripts/'))
    .pipe(bs.stream());
}

// Vendor scripts. Basically all the dependencies in the package.js.
// Therefore be careful and keep the dependencies clean.
function vendorScripts () {
  // Ensure package is updated.
  const pkg = readPackage();
  var vb = browserify({
    debug: true,
    require: pkg.dependencies ? Object.keys(pkg.dependencies) : []
  });
  return vb.bundle()
    .on('error', log.bind(log, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/assets/scripts/'))
    .pipe(bs.stream());
}

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Collecticon tasks -------------------------------//
// --------------------- (Font generation related) ---------------------------//
// ---------------------------------------------------------------------------//
function collecticons () {
  var args = [
    'node_modules/collecticons-processor/bin/collecticons.js',
    'compile',
    'app/assets/icons/collecticons/',
    '--font-embed',
    '--font-dest', 'app/assets/fonts',
    '--font-name', 'Collecticons',
    '--font-types', 'woff',
    '--style-format', 'css',
    '--style-dest', 'app/assets/styles/',
    '--style-name', 'collecticons',
    '--class-name', 'collecticon',
    '--author-name', 'Development Seed',
    '--author-url', 'https://developmentseed.org/',
    '--no-preview',
    '--catalog-dest', 'app/assets/scripts/collecticons/'
  ];

  return cp.spawn('node', args, { stdio: 'inherit' });
}

// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Helper tasks -----------------------------------//
// ----------------------------------------------------------------------------//

function finish () {
  return gulp.src('dist/**/*')
    .pipe($.size({ title: 'build', gzip: true }));
}

// After being rendered by jekyll process the html files. (merge css files, etc)
function html () {
  return gulp.src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe(cacheUseref())
    // Do not compress comparisons, to avoid MapboxGLJS minification issue
    // https://github.com/mapbox/mapbox-gl-js/issues/4359#issuecomment-286277540
    // https://github.com/mishoo/UglifyJS2/issues/1609 -> Just until gulp-uglify updates
    .pipe($.if('*.js', $.uglify({ compress: { comparisons: false, collapse_vars: false } })))
    .pipe($.if(/\.(css|js)$/, $.rev()))
    .pipe($.revRewrite())
    .pipe(gulp.dest('dist'));
}

function imagesImagemin () {
  return gulp.src([
    'app/assets/graphics/**/*'
  ])
    .pipe($.imagemin([
      $.imagemin.gifsicle({ interlaced: true }),
      $.imagemin.jpegtran({ progressive: true }),
      $.imagemin.optipng({ optimizationLevel: 5 }),
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling.
      $.imagemin.svgo({ plugins: [{ cleanupIDs: false }] })
    ]))
    .pipe(gulp.dest('dist/assets/graphics'));
}

/**
 * Caches the useref files.
 * Avoid sending repeated js and css files through the minification pipeline.
 * This happens when there are multiple html pages to process.
 */
function cacheUseref () {
  let files = {
    // path: content
  };
  return through2.obj(function (file, enc, cb) {
    const path = file.relative;
    if (files[path]) {
      // There's a file in cache. Check if it's the same.
      const prev = files[path];
      if (Buffer.compare(file.contents, prev) !== 0) {
        this.push(file);
      }
    } else {
      files[path] = file.contents;
      this.push(file);
    }
    cb();
  });
}
