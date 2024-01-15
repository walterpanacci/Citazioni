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

console.log(closeModalNoFavs);
let quotes = [];
let ready = false;
const storage = localStorage.getItem("bookmarks");
let bookmarks = storage ? JSON.parse(storage) : [];
console.log(bookmarks);

// Funzione per ricostruire la lista delle citazioni preferite nell'elemento corrispondente
const renderFavs = function () {
  favs.innerHTML = "";
  bookmarks.map((fav) => {
    noFavs.innerHTML = "";
    const markup = `<div><p class="fav-content">${fav[0]}</p><p class="fav-author">${fav[1]}</p></div>`;
    favs.insertAdjacentHTML("beforeend", markup);
  });
};

// Ricostruzione iniziale delle citazioni preferite
if (bookmarks.length !== 0) {
  renderFavs();
}

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
  const icon = e.target.closest("svg");
  if (!icon) return;
  if (icon.classList.contains("add")) {
    bookmarks.push([quoteContent.innerHTML, quoteAuthor.innerHTML]);
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
