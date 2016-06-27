'use strict';
require('express')().use(require('express').static(__dirname + '/app'))
.listen(8080, ()=>{
  console.log(('client up on 8080'));
});
