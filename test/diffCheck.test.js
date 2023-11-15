#!/usr/bin/env node

'use strict';

var jsdiff = require('diff');
var fs = require('fs');

var expectYaml = fs.readFileSync('docs/swagger.yaml', 'utf8');
var actualYaml = fs.readFileSync('test/resolved.yaml', 'utf8');
var diffYaml = jsdiff.diffJson(expectYaml, actualYaml);


if (diffYaml.length !== 1) {
  console.error("FAIL - docs/swagger.yaml does not match test/resolved.yaml !!")
} else {
  console.log("SUCCESS - resolved.yaml matches expected.yaml")
}
