var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var mongoose = require("mongoose");
var promise = require("promise");
const url ="mongodb+srv://simosa:virtualgifts@cluster0-rcmpp.mongodb.net/test?retryWrites=true&w=majority"
// const url2 = "mongodb+srv://avik:iampandey@cluster0-fhwix.mongodb.net/test?retryWrites=true&w=majority";
// const url3 = "mongodb+srv://avik:iampandey@cluster0-fhwix.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(url, {
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000


})
    .then(() => {
        console.log('Connection to the Atlas Cluster is successful!')
    })
    .catch((err) => console.error(err));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

// var arr = [];
var paraSchema = new mongoose.Schema({
  name: String
});
var wordSchema = new mongoose.Schema({
  name: String,
  ids: [String]
});
var para = mongoose.model("para", paraSchema);
var word = mongoose.model("word", wordSchema);

app.get('/',function(req,res) {
  res.render("index.ejs");
});

var id = "";
app.post('/save', function(req, res){
  console.log("submitted");
  if(req.body != "")
  {
  var item = new para({
    name: req.body.item,

  });

  para.create(item, function(err, para){
    if(err) console.log("err2");
    else{
      console.log("inserted item"+item);
      id = para._id;
    }
  });

  var words = item.name.split(" ");

  var uniwords = [];

  uniwords = words.filter(function(elem,pos){
    return words.indexOf(elem) == pos;
  });

  for (let i = 0, p = Promise.resolve(); i < uniwords.length; i++) {
    p = p.then(_ => new Promise(resolve =>
        setTimeout(function () {

        if(word.find(uniwords[i])!="")
        {
          console.log("yes found");
          //word.update({ $or: [{name: uniwords[i]}] }, { $push: { ids: id }, { upsert: true }, function(){});
          var uni = uniwords[i];
          word.update(
              { name: uni },
              { $push: { ids: id }},
              );
          console.log(uniwords[i]);

          //word.findOneAndUpdate({name: uni}, {$push: { ids: id }});

          // word.update({name: uni}, {$push: { ids: id }}, function(err, raw) {
          //   if (err) {
          // res.send(err);
          //     }
          // res.send(raw);
          //  });
        }


          var item2 = new word({
            name: uniwords[i],
            ids: id
          });


          word.create(item2, function(err, para){
            if(err) console.log("err2");
            else{
              console.log("inserted item2"+item2);
            }
          });

            resolve();
        }, Math.random() * 1000)
    ));
}



  console.log(uniwords);

}

  res.redirect("/");
});



app.post('/delete',function(req,res ){
   para.remove({}).then((result)=>{
     console.log(result);
   });
   word.remove({}).then((result)=>{
     console.log(result);
   });
  res.redirect("/");
});

function del(){
  para.remove({}).then((result)=>{
    console.log(result);
  });
}

app.post('/search',function(req,res){
  var search_word = req.body;


  res.redirect("/output");
});

app.listen(3000, function() {
  console.log("server started on");
});
