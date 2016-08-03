var through = require('through2');

var gutil = require('gulp-util');

var pluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-prefixer';

var Transform = require('readable-stream/transform');
var transform = Transform();

module.exports = function (obj, regExpArray) {

    transform._transform = function (chunk, encoding, cb) {
        var css = "";
        var i = 0;

        var key = Object.keys(obj);
        var result = new Array(key.length);
        for (i = 0; i < key.length; i++) {
            result[i] = new Array();
        }


        var myChunk = chunk.toString();
        myChunk = myChunk.replace(/[\r|\n|\t|\f|\b|\v|\s]*/g, "");

        console.log("myChunk: " + myChunk);

        var first = '',
            last = '',
            name = '',
            content = '',
            tem = '',
            myRegExp = '',
            res = [];

        while (myChunk.indexOf("}") !== -1) {

            var tempArr = new Array(Object.keys(obj).length);
            for (i = 0; i < tempArr.length; i++) {
                tempArr[i] = new Array();
            }

            var first = myChunk.indexOf("{");

            if (first == -1) {
                break;
            }

            last = myChunk.indexOf("}");
            name = myChunk.slice(0, first);
            content = myChunk.slice(first, last + 1);


            //console.log( "first：" + first +
            //             " last: " + last +
            //             " name: " + name +
            //             " content: " + content
            //);

            // 遍历 需要 计算的属性
            for (var b = 0; b < regExpArray.length; b++) {

                //console.log("b:  " + b + "  regExpArray.length: " + regExpArray.length + "value: " + regExpArray[b] );

                var myRegExp = new RegExp("\\/\\*" + regExpArray[b] + "\\*\\/", "g");

                //console.log("-------myRegExp-----------");
                //console.log( "myRegExp.test(  " + content + "  ) " + new RegExp("\\/\\*" + regExpArray[b] + "\\*\\/", "g").test(content) );
                //console.log("\r\n");

                if ( myRegExp.test(content) ) {

                    var regExpT = new RegExp("(;?.*;\\/\\*" + regExpArray[b] + "\\*\\/)+", "g");
                    var temp = content.match(regExpT);
                    if (temp) {


                        var r = temp[0].split("/*" + regExpArray[b] + "*/");

                        for (i = 0; i < r.length; i++) {

                            if (r[i]) {

                                r[i] = r[i].replace(/{/g, "");
                                console.log("-------r[" + i + "]: " + r[i] + "-----------");
                                for (var k = 0; k < tempArr.length; k++) {

                                    var tempVar = obj[key[k]][regExpArray[b]];
                                    if( tempVar && tempVar['coefficient'] ){
                                        tempArr[k].push(
                                            r[i].replace(/[0-9]+/g, function (word) {
                                                var tempOperation = tempVar['operation'];
                                                tempOperation = tempOperation ? tempOperation : '';
                                                console.log("tempOperation: ", tempOperation );
                                                if( tempOperation.replace(/\s*/g, "") === '+'){
                                                    return parseInt(word) + parseFloat(tempVar['coefficient']);
                                                }else if( tempOperation.replace(/\s*/g, "") === '-'){
                                                    return parseInt(word) - parseFloat(tempVar['coefficient']);
                                                }else if( tempOperation.replace(/\s*/g, "") === '/'){
                                                    if( parseFloat(tempVar['coefficient']) ){
                                                        return parseInt(word);
                                                    }
                                                    return parseInt(word) / parseFloat(tempVar['coefficient']);
                                                }else{
                                                    return parseInt(word) * tempVar['coefficient'];
                                                }
                                            })
                                        );
                                    }


                                    console.log("tempArr[" + k + "] : " + tempArr[k].join(""));

                                    for (var o = 0; o < result.length; o++) {

                                        result[o] = name + "{" +  tempArr[o].join("") + "}";
                                        //console.log("---result[" + o + "] : " + result[o]);

                                    }

                                }

                                // 已经读取过数据，需要进行清除
                                content = content.slice(r[i].length + ("/*" + regExpArray[b] +"*/").length + 1);

                            }

                        }

                    }

                }

            }

            myChunk = myChunk.slice(last + 1);

        };

        if (key.length == 0) {
            cb(null, chunk);
        } else {
            for (i = 0; i < result.length; i++) {
                css += obj[key[i]]['media'] + "{" + result[i] + "}";
            }
            console.log("css: " + css);
            cb(null, chunk.toString() + css);
        }


    }

    var stream = through.obj(function (file, encoding, cb) {

        if (file.isBuffer()) {
            this.emit("error", new pluginError(PLUGIN_NAME, "不支持 Buffer 类型"))
            return cb();
        }

        //file.contents.on("data", function(chunk, encode, cb){
        //    console.log( "ondata--------------------" );
        //    console.log( chunk.toString() );
        //    console.log( "--------------------" );
        //});

        if (file.isStream()) {
            file.contents = file.contents.pipe(transform);
        }

        //this.push(file);

        cb(null, file);

    })

    return stream;

}
