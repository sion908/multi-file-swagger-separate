# multi-file-[Swagger](http://swagger.io) utils

Example of how to split up a large Swagger spec into smaller files.

### [Read the blog post](http://azimi.me/2015/07/16/split-swagger-into-smaller-files.html)


### Usage
Install the node tool:

```bash
  npm install i -d @sion908/multi-file-swagger-utils
```

Run the command like so:

```bash
  npx multi-file-swagger-utils -b docs/base.yaml -o test/resolved.yaml
```

This will resolve every json pointer ($ref) externally or internally and then save it in a yaml file. Which can then be used for code generation and so on.

## feature

create resolve

#### License
MIT

### Thanks

https://www.npmjs.com/package/multi-file-swagger
