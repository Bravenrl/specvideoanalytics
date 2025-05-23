import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import { dest, parallel, series, src, watch } from 'gulp';
import cleanCSS from 'gulp-clean-css';
import fileinclude from 'gulp-file-include';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import svgstore from 'gulp-svgstore';
import terser from 'gulp-terser';
import { htmlValidator } from 'gulp-w3c-html-validator';
import csso from 'postcss-csso';
import dartSass from 'sass';

const sass = gulpSass(dartSass);
const browser = browserSync.create();

// Styles
export const styles = () =>
  src('src/scss/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: [
            'last 2 versions',
            'not dead',
            'not ie <= 11',
            'not op_mini all',
            'not < 0.25%',
          ],
        }),
        csso(),
      ])
    )
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());

// HTML
const minifyHtml = () =>
  src(['src/**/*.html', '!src/components/**/*.html'])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(htmlValidator.analyzer())
    .pipe(htmlValidator.reporter())
    .pipe(dest('build'))
    .pipe(browser.stream());

// Js
const compressScripts = () =>
  src('src/js/index.js', { allowEmpty: true })
    .pipe(terser())
    .pipe(rename('index.min.js'))
    .pipe(dest('build/js'))
    .pipe(browser.stream());

// Images

// Sprite
const createSprite = () =>
  src('src/img/icons/**/*.svg')
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));

// Server
const server = done => {
  browser.init({
    server: {
      baseDir: 'build',
    },
    cors: false,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher
const watcher = () => {
  watch('src/scss/**/*.scss', series(styles));
  watch('src/*.html', series(minifyHtml));
};

// Copy
const createCopy = done => {
  src(
    [
      'src/fonts/*.{woff2,woff}',
      'src/*.ico',
      'src/img/*.{webp,png,jpg,gif,svg}',
      'src/*.webmanifest',
      'src/sitemap.xml',
      'src/robots.txt',
    ],
    { encoding: false, base: 'src' }
  ).pipe(dest('build'));
  done();
};

const copyFavicons = done => {
  src(['src/img/favicon/*.{webp,png,jpg,gif,svg,ico}'], {
    encoding: false,
  }).pipe(dest('build/'));
  done();
};
// Clean
const clean = async done => {
  await deleteAsync(['build/']);
  done();
};

// Build

const build = series(
  clean,
  createCopy,
  copyFavicons,
  parallel(styles, minifyHtml, compressScripts, createSprite)
);

// Default

export default series(
  clean,
  createCopy,
  copyFavicons,
  parallel(styles, minifyHtml, compressScripts, createSprite),
  series(server, watcher)
);

export { build };
