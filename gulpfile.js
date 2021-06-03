const gulp = require('gulp')
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const sourcemaps = require('gulp-sourcemaps')
const ts = require('gulp-typescript')
const stripDebug = require('gulp-strip-debug')
const minify = require('gulp-uglify')
const tsProject = ts.createProject('tsconfig.json')
const imagemin = require('gulp-imagemin')
const size = require('gulp-size')

const clearBuildDir = (cb) => {
    del('dist/*', {force:true})
    return cb()
}

const htmlBuild = (cb) => {
    gulp.src('app/**/*.html')
        .pipe(size({title: 'html:'}))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({title: 'min-html:'}))
        .pipe(gulp.dest('dist'))
    return cb()
}

const sassBuildDev = (cb) => {
    gulp.src('app/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(size({title: 'scss:'}))
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(size({title: 'css:'}))
        .pipe(cssnano())
        .pipe(size({title: 'nano-css:'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
    return cb()
}

const tsBuildDev = (cb) => {
    tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(size({title: 'ts:'}))
        .pipe(tsProject())
        .pipe(size({title: 'js:'}))
        .pipe(minify())
        .pipe(size({title: 'min-js:'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
    return cb()
}

const sassBuild = (cb) => {
    gulp.src('app/scss/*.scss')
        .pipe(size({title: 'scss:'}))
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(size({title: 'css:'}))
        .pipe(cssnano())
        .pipe(size({title: 'nano-css:'}))
        .pipe(gulp.dest('dist/css'))
    cb()
}

const tsBuild = (cb) => {
    tsProject.src()
        .pipe(size({title: 'ts:'}))
        .pipe(tsProject())
        .pipe(stripDebug())
        .pipe(size({title: 'js:'}))
        .pipe(minify())
        .pipe(size({title: 'min-js:'}))
        .pipe(gulp.dest('dist/js'))
    cb()
}

const imgBuild = (cb) => {
    gulp.src('app/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
    return cb()
}

exports.watch = () => {
    gulp.watch('app/**/*.html', htmlBuild)
    gulp.watch('app/scss/**/*.scss', sassBuildDev)
    gulp.watch('app/ts/**/*.ts', tsBuildDev)
    gulp.watch('app/images/*', imgBuild)
}
exports.buildDev = gulp.series(clearBuildDir, htmlBuild, sassBuildDev, tsBuildDev, imgBuild)
exports.build = gulp.series(clearBuildDir, htmlBuild, sassBuild, tsBuild, imgBuild)
