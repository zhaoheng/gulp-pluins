/**
 * Created by Administrator on 2016/8/1.
 */
var stream = require('readable-stream');
var fs = require('fs');


var Transform = stream.Transform();

Transform._transform = function(chunk, encoding, cb){
    console.log( chunk.toString().toUpperCase() );
}


fs.createReadStream('./file.txt').pipe(Transform);

