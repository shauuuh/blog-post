import express, { text } from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));

app.use(express.static("public"));

let items = [];

app.get("/",(req,res) => {
  res.render("index.ejs",{ items });
  console.log(items);
});

app.post("/submit",(req,res) => {
  //const textPost = req.body["post-text"];
  const newItem = {
    id : items.length + 1,
    title : req.body["title-post"],
    text : req.body["post-text"],
  };
  //console.log(newItem);
  items.push(newItem);
  res.redirect('/');
  //res.render("index.ejs", newItem);
});

app.post("/edit/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  const data = {
    id_item : item.id,
    title : item.title,
    text : item.text,
  }  
  res.render('edit.ejs',data)
});

app.post("/update/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  item.text = req.body["post-text"];
  item.title = req.body["title-post"];
  res.redirect('/');
});

app.post("/delete/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  items = items.filter(item => item.id !== id);
  console.log(items);
  res.redirect('/');
});

app.listen(port, ()=>{
  console.log(`Listening on port ${port}` );
});
