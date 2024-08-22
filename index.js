import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;
const API_URL = "https://picsum.photos/200";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "shau2799",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));

let items = [];

app.get("/", async(req,res) => {
  try {
    const response = await db.query("SELECT * FROM posts ORDER BY id DESC");
    items = response.rows;
    res.render("index.ejs",{ items });
    console.log(items);
  } catch (error) {
    console.log(err);
  }
});

app.post("/submit", async(req,res) => {
  try {
    const result = await axios.get(API_URL, {responseType: 'stream'});
    const title = req.body["title-post"];
    const text = req.body["post-text"];
    //const image = result.data.responseUrl;
    /*
    const newItem = {
      id : items.length + 1,
      title : req.body["title-post"],
      text : req.body["post-text"],
      image : result.data.responseUrl,
    };*/
    await db.query("INSERT INTO posts (title,txt_content,url_image) VALUES ($1,$2,$3)",[title,text,result.data.responseUrl]);
    //items.push(newItem);
    res.redirect('/');
    //res.render("index.ejs", newItem);
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit/:id", async(req,res)=>{
  const id = parseInt(req.params.id);
  const item = items.findIndex(item => item.id === id);
  const response = await db.query("SELECT * FROM posts WHERE id = $1",[id]);
  const data = {
    id_item : response.id,
    title : response.title,
    text : response.txt_content,
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
