// const mongoose=require('mongoose');
// mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
//     console.log("mongodb is connected");
// }).catch((error)=>{
//     console.log("mondb not connected");
//     console.log(error);
// });



const mongoose = require('mongoose');
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true});

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

db.once('open',function(){
        console.log('connected')
    });
    
    require('./Category');
    require('./Recipe');


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://virajdesai3011:Viraj30112001@cluster0.jhaue.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });




// const mongoose = require('mongoose');

// const mongodb_url="mongodb+srv://virajdesai3011:Viraj30112001@cluster0.jhaue.mongodb.net/Recipes?retryWrites=true&w=majority";

// mongoose.connect(mongodb_url, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
//     console.log("mongodb is connected");
// }).catch((error)=>{
//     console.log("mondb not connected");
//     console.log(error);
// });

//     require('./Category');
//     require('./Recipe');



// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function(){
//   console.log('Connected')
// });

// // Models
// require('./Category');
// require('./Recipe');


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://virajdesai3011:Viraj30112001@cluster0.jhaue.mongodb.net/Recipes?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });





// const monngodb_url="mongodb+srv://virajdesai3011:Viraj301101--@cluster0.jhaue.mongodb.net/Recipes?retryWrites=true&w=majority";

// mongoose.connect(monngodb_url, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
//     console.log("mongodb is connected");
// }).catch((error)=>{
//     console.log("mondb not connected");
//     console.log(error);
// });