var stream = require('stream');
var util = require('util');
var fs =require('fs');

function Love() {
  stream.Readable.call(this);
  this._max = 5;
  this._index = 0;
}
util.inherits(Love, stream.Readable);

Love.prototype._read = function() {
  var i = this._index++;
  if (i > this._max) {
    this.push('beautiful');
    this.push(null);
  }
  else {
    var str = '' + i;
    var buf = new Buffer(str, 'utf8');
    this.push(buf);
  }
};

function Story() {
  stream.Writable.call(this);
  this._storage = new Buffer('');
}
util.inherits(Story, stream.Writable);

Story.prototype._write = function(chunk, encoding, callback) {
  this._storage = Buffer.concat([this._storage, chunk]);
  callback();
};

function Knight() {
  stream.Transform.call(this);
}
util.inherits(Knight, stream.Transform);

Knight.prototype._transform = function(chunk, encoding, callback) {
  this.push(chunk);
  callback();
};

Knight.prototype._flush = function(callback) {
  this.push('dark knight');
  callback();
};

var reader = new Love();
var writer = new Story();
var transform = new Knight();

writer.on('finish', function() {
  fs.writeFileSync('./output.txt', this._storage);
});

reader.pipe(transform).pipe(writer);
