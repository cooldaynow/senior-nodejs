import fs from 'node:fs';
import { pipeline, Transform } from 'node:stream';
import path from 'node:path';

// const { chain } = require('stream-chain');
// const { parser } = require('stream-json');
// const { streamValues } = require('stream-json/streamers/StreamValues');
// const { pick } = require('stream-json/filters/Pick');
// const { filter } = require('stream-json/filters/Filter');
const StreamArray = require('stream-json/streamers/StreamArray');

const file = fs.createReadStream(path.join(__dirname, './1.json'));

const fields = ['age'];
const transform = new Transform({
  objectMode: true,
  transform({ value }, encoding, callback) {
    if (fields.length) {
      const fieldsEntrires = fields.map((field) => [field, value[field]]);
      const filteredObj = Object.fromEntries(fieldsEntrires);
      this.push(filteredObj);
    } else {
      this.push(value);
    }
    callback();
  },
});

pipeline(file, StreamArray.withParser(), transform, console.error);
