import express, { text } from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));

app.use(express.static("public"));

let items = [];

app.get("/",(req,res) => {
  res.render("index.ejs",{ items });
});

app.post("/submit",(req,res) => {
  //const textPost = req.body["post-text"];
  const newItem = {
    id : items.length + 1,
    text : req.body["post-text"],
  };
  console.log(newItem);
  items.push(newItem);
  res.redirect('/');
  //res.render("index.ejs", newItem);
});

app.post("/update/:id",(req,res)=>{
  const id = parseInt(req.body.id);
});

app.post("/delete/:id",(req,res)=>{
  const id = parseInt(req.body.id);
  items = items.filter(item => item.id !== id);
  res.redirect('/');
});

app.listen(port, ()=>{
  console.log(`Listening on port ${port}` );
});
