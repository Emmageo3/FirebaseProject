const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTYwNjQ2OSwiZXhwIjoxOTU1MTgyNDY5fQ.30bRiIRMnHWKqSxUniasQo3I-6stL8fM3DO3BnUM-Cw"

const API_URL = "https://coellfatapoevzftbwvr.supabase.co/rest/v1/mesidees"

// RECUPERATIONS DES ELEMENTS DOM
const propositionElement = document.getElementById("propositions")
const approuves = document.getElementById('approuves')
const ideeForm = document.querySelector("form")
const inputTitre = document.querySelector("input#titre")
const inputSuggestion = document.querySelector("textarea#suggestion")
const approuve = document.getElementById('approuve')
const refuse = document.getElementById('refuse')
const all = document.getElementById('all')

// NOS FONCTIONS
const creerUneCarte = (idee) => {
  const divCard = document.createElement("div")
  divCard.classList.add("card")
  divCard.classList.add("animate__animated")
  divCard.classList.add("animate__bounce")
  divCard.classList.add("mt-4")
  divCard.classList.add("col-3")
  divCard.style.width = "18rem"
  divCard.style.marginLeft = "2rem"
  divCard.style.boxShadow = "1px 1px 10px 1px #000000"

  const divCardBody = document.createElement("div")
  divCardBody.classList.add("card-body")

  const cardTitle = document.createElement("h5")
  cardTitle.classList.add("card-title")

  const cardDescription = document.createElement("p")
  cardDescription.classList.add("card-text")
  
  const cardBtns = document.createElement('div')
  cardBtns.setAttribute('class', 'row')
  
  btnA = document.createElement('div')
  btnA.setAttribute('class', 'btn btnA col-6 text-success')
  btnA.innerHTML = "Approuver"

  cardBtns.appendChild(btnA)

  btnR = document.createElement('div')
  btnR.setAttribute('class', 'btn btnR col-6 text-danger')
  btnR.innerHTML = "Refuser"
  cardBtns.appendChild(btnR)

  cardTitle.textContent = idee.titre
  cardDescription.textContent = idee.suggestion


  divCardBody.appendChild(cardTitle)
  divCardBody.appendChild(cardDescription)
  divCard.appendChild(divCardBody)
  propositionElement.appendChild(divCard)
  divCardBody.appendChild(cardBtns)

  btnA.addEventListener('click', function(){
    modifierEtatIdee(idee.id,true)
    divCard.style.border = "4px solid green"
  })
  btnR.addEventListener('click', function(){
    modifierEtatIdee(idee.id,false)
    divCard.style.border = "4px solid red"
  })

  if (idee.statut == true) {
    divCard.style.border = "4px solid green"
  } 

  if (idee.statut == false) {
    divCard.style.border = "4px solid red"
  } 
  pourcentA = document.getElementById('pourcentA')
  pourcentR = document.getElementById('pourcentR')

  approuve.addEventListener('click', function(){
    fetch(API_URL, {
      headers: {
        apikey: API_KEY,
      },
    })
      .then((response) => response.json())
      .then((idees) => {
        let i = 0
        let pourcentageApprouvés = 0
        idees.forEach((idee)=>{
          if (idee.statut == true) {
            i++
          }
        })
        pourcentageApprouvés = (i * 100) / idees.length 
        pourcentA.innerHTML = pourcentageApprouvés.toFixed(0) + "%"

        if (idee.statut == true) {
          divCard.style.display = "block"
        }else{
          divCard.style.display = "none"
        }
      })
  })

  refuse.addEventListener('click', function(){
    fetch(API_URL, {
      headers: {
        apikey: API_KEY,
      },
    })
      .then((response) => response.json())
      .then((idees) => {
        let i = 0
        let pourcentageRefusés = 0
        idees.forEach((idee)=>{
          if (idee.statut == false) {
            i++
          }
        })
        pourcentageRefusés = (i * 100) / idees.length 
        pourcentR.innerHTML = pourcentageRefusés.toFixed(0) + "%"

        if (idee.statut == false) {
          divCard.style.display = "block"
        }else{
          divCard.style.display = "none"
        }
      })
  })

  all.addEventListener('click', function(){
    window.location.reload()
  })


  
}








// VERIFICATION DES MOTS SAISIS

inputSuggestion.addEventListener("input", (event) => {
  const longueurMax = 130
  const contenuSaisi = inputSuggestion.value
  const longueurSaisi = contenuSaisi.length
  const reste = longueurMax - longueurSaisi

  //actualiser le dom pour afficher le nombre
  const paragraphCompteur = document.getElementById("limite-text")
  const compteurText = document.getElementById("text-progress")
  const restantText = document.getElementById("text-restant")
  const btnSuggestion = document.getElementById("btn-suggestion")
  compteurText.textContent = longueurSaisi
  restantText.textContent = " Il vous reste " + reste

  //changer couleur

  if (reste < 0) {
    paragraphCompteur.style.color = "#ce0033"
    btnSuggestion.disabled = true
  } else if (reste <= 16) {
    paragraphCompteur.style.color = "yellow"
    btnSuggestion.disabled = false
  } else {
    paragraphCompteur.style.color = "#00000"
    btnSuggestion.disabled = false
  }
})

// RECUPERATION DES INFORMAIONS DU FORMULAIRE

ideeForm.addEventListener("submit", (event) => {
  event.preventDefault()

  // Récupération des informations saisies
  const titreSaisi = inputTitre.value
  const suggestionSaisi = inputSuggestion.value

  if (titreSaisi.trim().length < 5 || suggestionSaisi.trim().length < 10) {
    alert("Merci de saisir des informations correctes")
    return
  }

  // mettre les informations sous forme
  const nouvelleIdee = {
    titre: titreSaisi,
    suggestion: suggestionSaisi,
    statut: false,
  }

  //ENVOYER LES DONNEES VERS SUPABASE
  fetch(API_URL, {
    method: "POST",
    headers: {
      apikey: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nouvelleIdee),
  })

  // on vide les champs
  inputTitre.value = ""
  inputSuggestion.value = ""

  //AJOUT DE LA NOUVELLE IDEE AU NIVEAU DE LA PAGE
  creerUneCarte(nouvelleIdee)

  
})

// AFFICHAGE DES IDEES

window.addEventListener("DOMContentLoaded", (event) => {
  //RECUPERATION DES DONNEES VIA API
  fetch(API_URL, {
    method: "GET",
    headers: {
      apikey: API_KEY,
    },
  })
    .then((response) => response.json())
    .then((idees) => {
      idees.forEach((idee) => {
        creerUneCarte(idee)
      })
    })
})

function modifierEtatIdee(id,value){
  fetch(API_URL + "?id=eq. " +id, {
    method: "PATCH",
    headers: {
      apikey: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({statut:value}),
  })
}





