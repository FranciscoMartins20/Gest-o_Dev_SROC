const express = require('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const CorsOptions = {
    origin: '*',
    credentials:true,
    optionSucessStatus:200

}

app.use(cors( CorsOptions ));
app.use('/', router)


const port= 4000;
const server = app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});