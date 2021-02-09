const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const reload = require("reload");

app.use(express.static('.'));

app.get('/', (req, res)=> {
    res.render('index');
  });


reload(app).then(function(reloadReturned){
    http.listen(port,() => {
        console.log('listening on 3000');
    });
}).catch(function (params) {
    console.error('Reload fucked');
})

  