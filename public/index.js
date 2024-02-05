const persone = document.getElementById("persone");
const nome = document.getElementById("nome");
const confermaNome = document.getElementById("confermaNome");
const modalNominativo = document.getElementById("nominativo");
const modalDomande = document.getElementById("domande");
const domandeDiv = document.getElementById("Domande");
let domandaTemplate = `
  <p> -> <span class="fw-bold mt-5">%DOMANDA</span></p>
  <form method="" action="">
  <div class="form-check">
    <input name="gruppo" class="%CERCA" type="radio" id="radio1" value="%VALUE1">
    <label for="radio1">%RADIO1</label>
  </div>
  <div class="form-check">
    <input name="gruppo" class="%CERCA" type="radio" value="%VALUE2"  id="radio2" >
    <label for="radio2">%RADIO2</label>
  </div>
    <div class="form-check">
    <input name="gruppo" class="%CERCA" type="radio" value="%VALUE3"  id="radio3" >
    <label for="radio3">%RADIO3</label>
  </div>
    <div class="form-check">
    <input name="gruppo" class="%CERCA" type="radio" value="%VALUE4"  id="radio4" >
    <label for="radio4">%RADIO4</label>
  </div>
  </form>
`;
let partita = {
}

/**
 * Funzione per la gestione del tempo
 * @param {*} time 
 * @returns 
 */
const timer = (time) =>{
    return setTimeout(window.location.reload(),time);
}


/**
 * Funzione per recuperare da server tutte le persone che hanno fatto il quiz
 * @returns promise
 */
const recuperaPersone = () =>{
    return new Promise((resolve,reject)=>{
        fetch("/ratings")
        .then(response => response.json())
        .then(response => resolve(response.result))
        .catch(exception => reject(exception));
    });
}

/**
 * Funzione per recuperare da server le domande da fare all'utente
 * @returns promise
 */
const recuperaDomande = () =>{
    return new Promise((resolve,reject)=>{
        fetch("/questions")
        .then(response => response.json())
        .then(response => resolve(response.result))
        .catch(exception => reject(exception));
    });
}

//  ------>   main
/**
 * Funzione di visualizzazione della wall of fame
 * da mettere in una funzione di rendering
 */
recuperaPersone().then(response =>{
    if(response){
        //ordinamento decrescente per rating
        response = response.sort((a,b)=>  b.rating - a.rating);
        persone.innerHTML = "";
        response.forEach(persona => {
            persone.innerHTML += "<tr><td>"+persona.username+"</td><td>"+persona.timestamp+"</td><td>"+persona.rating+"</td></tr>"
        });
    }
});

/**
 * Gestione input nome
 */
nome.addEventListener("input",(event)=>{
    if(event.target.value.length > 0){
        confermaNome.classList.remove("disabled");
    }else{
        confermaNome.classList.add("disabled");
    }
});

/**
 * Funzione per la gestione dell'input dell'utente
 */
confermaNome.onclick = () =>{
    if(nome.value){
        partita = {};
        partita['username'] = nome.value;
        nome.value = "";
       recuperaDomande().then(response => {
        const domande = response.questions;
        let html = "";
        for(let i=0;i<domande.length;i++){
            let riga = domandaTemplate;
            riga = riga.replace("%DOMANDA",domande[i].question);
            console.log(domande[i].answers);
            for(let j=0;j<domande[i].answers.length;j++){
                riga = riga.replace("%RADIO"+(j+1),domande[i].answers[j]).replace("%RADIO"+(j+1),j).replace("%CERCA","input");
            }
            html += riga;
        }
        domandeDiv.innerHTML = html+'<div class="row justify-content-end><div class="col-auto"><input type="button" id="confermaRisposte" class="btn btn-success mt-3" value="Conferma"/></div></div>';
        //gestione risposte
        document.getElementById("confermaRisposte").onclick = () =>{
            const inputs = document.querySelectorAll(".input");
            const risposteDate = [];
            let conta = 0;
            for(let i=0;i<inputs.length;i++){
                if(inputs[i].checked){
                    const json = {};
                    json[conta] = inputs[i].id.replace("radio","")
                    risposteDate.push(json);
                    conta ++;
                }
            }
            partita['timestamp'] = "";//non so cosa inserire
            partita['answers'] = risposteDate;
        }
    });
    }
}

