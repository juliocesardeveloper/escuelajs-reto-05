const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
let firstPage = 1;
let countPages = 0;

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      countPages = response.info.pages +1;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      localStorage.setItem('next_fetch', JSON.stringify(characters));
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = async () => {
  const cache = localStorage.getItem('next_fetch');
  cache
  ? (await getData(`${API}/?page=${firstPage}`), firstPage += 1)
  : await getData(API);
}

const intersectionObserver = new IntersectionObserver((entries, observer) => {
  if (entries[0].isIntersecting) {
    loadData();
  } else if (firstPage === countPages){
    localStorage.clear();
    observer.unobserve(entries[0].target);
    $observe.classList.add('noMore');
    $observe.innerHTML = 'Ya no hay más personajes...';
  }
}, {
  rootMargin: '0px 0px 100% 0px',
  threshold: '0.5',
});

intersectionObserver.observe($observe);