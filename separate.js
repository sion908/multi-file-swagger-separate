#!/usr/bin/env node

'use strict';

var resolve = require('json-refs').resolveRefs;
var YAML = require('js-yaml');
var fs = require('fs');

var program = require('commander');


program
  .version('2.0.0')
  .option('-o --output-file [output]',
          'output file name. (Default is `separated`)',
          'json')
  .option('-k1 --key-level1 [list_key1]',
          "list for one-level separation. separate by ','' (Default is `info,securityDefinitions,tags`)",
          'string')
  .option('-k2 --key-level2 [list_key2]',
          "list for two-level separation. separate by ','' (Default is `paths,definitions`)",
          'string')
  .usage('[options] <yaml file ...>')
  .parse(process.argv);

if (program.outputFormat !== 'json' && program.outputFormat !== 'yaml') {
  console.error(program.help());
  process.exit(1);
}

var file = program.args[0];

if (!fs.existsSync(file)) {
  console.error('File does not exist. ('+file+')');
  process.exit(1);
}

const key_1 = ['info', 'securityDefinitions','tags'];
const key_2 = ['paths', 'definitions'];

var original = YAML.safeLoad(fs.readFileSync(file).toString());
const keys = key_2.concat(key_1);
console.log('keys',keys)

const created_files = [];
const writeFile = (filename, data) =>{
  fs.writeFile(
    filename,
    YAML.dump(data),
    'utf8',
    (e)=>{
      if(e){
        console.log(e.message);
        process.exit(1)
      }
    }
  )
  created_files.push(filename);
}

try{
  for (const dir_name of keys){
    if(!fs.existsSync(`${dir_name}/`)){
      fs.mkdirSync(`${dir_name}`);
    }
    const dir_origin = original[dir_name];
    console.log(`${dir_name}/index.yaml`);
    if (key_2.includes(dir_name)) {
      for(const indexes of Object.keys(dir_origin)) {
        const filename = indexes.replace(/^\//,'').replace(/\//g,'-') + '.yaml';
        writeFile(`${dir_name}/${filename}`, dir_origin[indexes]);
        dir_origin[indexes] = {$ref: './'+filename}
        console.log('  ', filename);
      }
    }
    writeFile(`${dir_name}/index.yaml`, dir_origin);
    original[dir_name] = {$ref: `./${dir_name}/index.yaml`}
  }
  writeFile(`${program.args[1]? program.args[1]: 'separated'}.yaml`, original);
  console.log('succssess');
} catch(e) {
  console.log(e.message);
  created_files.forEach(file_name => {
    fs.unlink(file_name, e=>{
      console.log(e.message);
    })
  });
  console.log('削除が完了しました');
}
