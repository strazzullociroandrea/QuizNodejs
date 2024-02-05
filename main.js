const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const persone = [ { "username": "Mario", "timestamp": 292827662, "rating": 0 }, { "username": "Sandra", "timestamp": 292822727, "rating": 10 }, { "username": "Luigi", "timestamp": 292822117, "rating": 0 } ];
/** 
Funzione asincrona per la  lettura di un file 
*/
const leggiFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

/**
 * Funzione per recuperare l'elenco delle persone che hanno fatto il quiz con il relativo punteggio
 */
app.get("/ratings",(req, res)=>{
    res.json({
        result: persone
    });
});

const generaArrayID= () =>{
    return new Promise((resolve,reject)=>{
        const array = [];
        for(let i = 0;i <3; i++){
                let pos = undefined;
                do{
                    pos = Math.floor(Math.random() * 10);
                }while(array.includes(pos+""));
                array.push(pos+"");
        }
        resolve(array);
    });
}
app.get("/questions", (req, resp) => {
  leggiFile("./jsons/domande.json").then((domande) => {
        domande = JSON.parse(domande);
        domande = domande.questions;
        const jsonTemp = {
            "title": domande.title,
            "timer": domande.timer,
        }
        generaArrayID().then(idDomande => {
            const result = [];
            console.log(idDomande);
            idDomande.forEach(id=>{
                result.push(domande[id]);
            });
            jsonTemp['questions'] = result;
            resp.json({result: jsonTemp});
        });
  });
});

const server = http.createServer(app);
server.listen(80, () => {
  console.log("-> server running");
});
