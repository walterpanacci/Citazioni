const button = document.querySelector(".get-quote");
const quoteContent = document.querySelector(".quote-content");
const quoteAuthor = document.querySelector(".quote-author");
const quoteImage = document.querySelector(".quote-image");
const addButton = document.querySelector(".add");
const addMessage = document.querySelector(".add-message");
const removeButton = document.querySelector(".remove");
const removeMessage = document.querySelector(".remove-message");
const container = document.querySelector(".container");
const closeModalNoFavs = document.querySelector(".close-modal-no-favs");
const closeModalFavs = document.querySelector(".close-modal-favs");
const favQuotes = document.querySelector(".fav-quotes");
const overlay = document.querySelector(".overlay");
const favsButton = document.querySelector(".favs-button");
const favs = document.querySelector(".favs");
const noFavs = document.querySelector(".no-favs");
const devButtonClear = document.querySelector(".dev-button-clear");
const menu = document.querySelector(".menu");
const about = document.querySelector(".about");
const closeAbout = document.querySelector(".close-about");
const getAll = document.querySelector(".get-all");
const allQuotes = document.querySelector(".all-quotes");

let quotes = [];
let ready = false;
const storage = localStorage.getItem("bookmarks");
let bookmarks = storage ? JSON.parse(storage) : [];
console.log(bookmarks);

// Funzione per ricostruire la lista delle citazioni preferite nell'elemento corrispondente
const renderFavs = function () {
  favs.innerHTML = "";
  if (bookmarks.length === 0) {
    favs.insertAdjacentHTML(
      "beforeend",
      '<div class="no-favs"><svg class="fav-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M178,32a61.6,61.6,0,0,0-43.84,18.16L128,56.32l-6.16-6.16A62,62,0,0,0,16,94c0,70,103.79,126.67,108.21,129a8,8,0,0,0,7.58,0C136.21,220.67,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94a46,46,0,0,1,78.53-32.53l6.16,6.16L106.34,78a8,8,0,0,0,0,11.31l24.53,24.53-16.53,16.52a8,8,0,0,0,11.32,11.32l22.18-22.19a8,8,0,0,0,0-11.31L123.31,83.63l22.16-22.16A46,46,0,0,1,224,94C224,147.61,146.24,196.15,128,206.8Z"></path></svg><p>Quant\'è vuoto qui....</p></div>'
    );
  } else {
    noFavs.innerHTML = "";
    bookmarks.map((fav) => {
      const markup = `<div class="fav-quote"><p class="fav-content">${fav[0]}</p><p class="fav-author">${fav[1]}</p><button class="remove-fav-quote" data-id="${fav[2]}"><svg class="remove-fav-quote-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg></div>`;
      favs.insertAdjacentHTML("beforeend", markup);
    });
  }
};

// Ricostruzione iniziale delle citazioni preferite
if (bookmarks.length !== 0) renderFavs();

// Le citazioni vengono raccolte dal file .json e memorizzate nell'array quotes
(async function () {
  const res = await fetch(
    "https://gist.githubusercontent.com/walterpanacci/457c58de8b897cef4152a47ebc599dbe/raw/717c3183103d80b8b0393886b6421f48c5f63d83/citazioni.json"
  );
  const word = await res.json();
  quotes = word.quotes;
  ready = true;
})();

// Funzione per scegliere una citazione a caso (un elemento casuale dall'array) e una immagine casuale usando l'api apposita
async function randomQuote() {
  if (ready === false) return;
  const n = quotes.length - 1;
  const x = Math.round(Math.random() * n);
  const currentQuote = quotes[x];
  quoteContent.innerHTML = currentQuote.quote;
  quoteContent.setAttribute("data-id", currentQuote.id);
  quoteAuthor.innerHTML = currentQuote.author;
  if (bookmarks.includes(currentQuote.quote)) {
    removeButton.classList.remove("hidden");
    addButton.classList.add("hidden");
  } else {
    removeButton.classList.add("hidden");
    addButton.classList.remove("hidden");
  }
  quoteImage.innerHTML = '<span class="loader hidden"></span>';
  const img = await fetch("https://picsum.photos/600/600");

  quoteImage.innerHTML = `<img class="image-content" src="${img.url}">`;
}

// Premendo il bottone apposito vengono restituite citazione e immagine
button.addEventListener("click", randomQuote);

// Facendo passare il mouse sopra le icone per modificare aggiungere/togliere ai/dai preferiti la citazione corrente viene descritta l'azione di quel bottone
addButton.addEventListener("mouseover", function () {
  addMessage.style.opacity = 1;
});
addButton.addEventListener("mouseout", function () {
  addMessage.style.opacity = 0;
});

removeButton.addEventListener("mouseover", function () {
  removeMessage.style.opacity = 1;
});
removeButton.addEventListener("mouseout", function () {
  removeMessage.style.opacity = 0;
});

// Aggiungere/togliere citazioni ai preferiti
container.addEventListener("click", function (e) {
  const icon = e.target.closest(".fav");
  if (!icon) return;
  if (icon.classList.contains("add")) {
    bookmarks.push([
      quoteContent.innerHTML,
      quoteAuthor.innerHTML,
      quoteContent.dataset.id,
    ]);
    renderFavs();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    addButton.classList.add("hidden");
    removeButton.classList.remove("hidden");
  } else {
    bookmarks = bookmarks.filter((el) => el[0] !== quoteContent.innerHTML);
    renderFavs();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    removeButton.classList.add("hidden");
    addButton.classList.remove("hidden");
  }
});

// Bottone per pulire il local storage
devButtonClear.addEventListener("click", function () {
  localStorage.clear();
});

// Aprire/chiudere la finestra delle citazioni preferite
favsButton.addEventListener("click", function () {
  favQuotes.classList.remove("hidden");
  overlay.classList.remove("hidden");
});
closeModalNoFavs.addEventListener("click", function () {
  favQuotes.classList.add("hidden");
  overlay.classList.add("hidden");
});
closeModalFavs.addEventListener("click", function () {
  favQuotes.classList.add("hidden");
  overlay.classList.add("hidden");
});

// Aprire/chiudere la barra laterale con la descrizione dell'app
menu.addEventListener("click", function () {
  about.style.transform = "translateX(0)";
});
closeAbout.addEventListener("click", function () {
  about.style.transform = "translateX(-100%)";
});

// Rimuovere una citazione dai preferiti dalla finestra dei preferiti
favQuotes.addEventListener("click", function (e) {
  const trash = e.target.closest(".remove-fav-quote");
  console.log(trash, trash.getAttribute("data-id"));
  if (!trash) return;
  bookmarks = bookmarks.filter((el) => el[2] !== trash.getAttribute("data-id"));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  renderFavs();
  removeButton.classList.add("hidden");
  addButton.classList.remove("hidden");
});

// La finestra dei preferiti può essere chiusa anche cliccando sull'area esterna
overlay.addEventListener("click", function () {
  favQuotes.classList.add("hidden");
  overlay.classList.add("hidden");
});

// Bottone per elencare tutte le citazioni
getAll.addEventListener("click", function () {
  allQuotes.classList.remove("hidden");
  quotes.map((el) =>
    allQuotes.insertAdjacentHTML(
      "beforeend",
      `<p class="quote-content">${el.quote}</p><p class="quote-author" style="color:#3d348b; font-weight:700;">${el.author}</p><br><br>`
    )
  );
});
