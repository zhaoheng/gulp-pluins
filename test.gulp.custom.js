var gulp = require("gulp");
var gulpCustom = require("./gulp.custom.pluin.js");

gulp.src('./test.css', {buffer: false})
    .pipe(gulpCustom({
        iphone4: {
            media: "@media screen and (max-width:330px)",
            px: {
            },
            go: {
                coefficient: 0.8,
                operation: '+'
            }
        },
        iphone5: {
            media: "@media screen and (max-width:330px) and (min-height: 500px)",
            px: {
                coefficient: 0.9
            },
            go: {
                coefficient: 2,
                operation: '*'
            }
        },
        iphone6: {
            media: "@media screen and (min-width:375px)",
            px: {
                coefficient: 1.1
            },
            go: {
                coefficient: 3,
                operation: '/'
            }
        },
        iphone6Plus: {
            media: "@media screen and (min-width:414px)",
            px: {
                coefficient: 1.3
            },
            go: {
                coefficient: 4
            }
        },
        ipadMini: {
            media: "@media screen and (min-width:768px)",
            px: {
                coefficient: 1.5
            },
            go: {
                coefficient: 5
            }
        }
    },['px','go'])).pipe(gulp.dest('test'));
