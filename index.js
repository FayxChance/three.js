const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;

app.use(express.static('.'));

app.get('/', (req, res)=> {
    res.render('index');
  });

  http.listen(port,() => {
  
    console.log('listening on 3000');
  });
  