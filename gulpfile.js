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
const plumber = require('gulp-plumber')

const clearBuildDir = () => {
    return del('dist/*', {force:true})
}

const htmlBuild = () => {
    return gulp.src('app/**/*.html')
        .pipe(plumber())
        .pipe(size({title: 'html:'}))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({title: 'min-html:'}))
        .pipe(gulp.dest('dist'))
}

const sassBuildDev = () => {
    return gulp.src('app/scss/*.scss')
        .pipe(plumber())
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
}

const tsBuildDev = () => {
    return tsProject.src()
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(size({title: 'ts:'}))
        .pipe(tsProject())
        .pipe(size({title: 'js:'}))
        .pipe(minify())
        .pipe(size({title: 'min-js:'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
}

const sassBuild = () => {
    return gulp.src('app/scss/*.scss')
        .pipe(plumber())
        .pipe(size({title: 'scss:'}))
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(size({title: 'css:'}))
        .pipe(cssnano())
        .pipe(size({title: 'nano-css:'}))
        .pipe(gulp.dest('dist/css'))
}

const tsBuild = () => {
    return tsProject.src()
        .pipe(plumber())
        .pipe(size({title: 'ts:'}))
        .pipe(tsProject())
        .pipe(stripDebug())
        .pipe(size({title: 'js:'}))
        .pipe(minify())
        .pipe(size({title: 'min-js:'}))
        .pipe(gulp.dest('dist/js'))
}

const imgBuild = () => {
    return gulp.src('app/images/**/*')
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
}

const copyPublicDir = () => {
    return gulp.src('public/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/'))
}

exports.watch = () => {
    gulp.watch('app/**/*.html', htmlBuild)
    gulp.watch('app/scss/**/*.scss', sassBuildDev)
    gulp.watch('app/ts/**/*.ts', tsBuildDev)
    gulp.watch('app/images/*', imgBuild)
    gulp.watch('public/**/*', copyPublicDir)
}
exports.buildDev = gulp.series(clearBuildDir, htmlBuild, sassBuildDev, tsBuildDev, imgBuild)
exports.build = gulp.series(clearBuildDir, htmlBuild, sassBuild, tsBuild, imgBuild, copyPublicDir)
