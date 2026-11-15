const storageKey = 'biblioteca-demo-libros';
const form = document.querySelector('#book-form');
const list = document.querySelector('#book-list');
const search = document.querySelector('#search');
const count = document.querySelector('#book-count');
const message = document.querySelector('#message');

function loadBooks() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!Array.isArray(saved)) throw new Error('El almacenamiento de libros debe ser una lista.');
  return saved;
}

let books = loadBooks();

function saveBooks() {
  localStorage.setItem(storageKey, JSON.stringify(books));
}

function renderBooks() {
  const query = search.value.trim().toLocaleLowerCase('es');
  const filtered = books.filter((book) =>
    `${book.title} ${book.author}`.toLocaleLowerCase('es').includes(query),
  );
  count.textContent = `${books.length} ${books.length === 1 ? 'libro' : 'libros'}`;
  list.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = books.length === 0 ? 'Todavía no hay libros en la lista.' : 'No se encontraron libros.';
    list.append(empty);
    return;
  }

  filtered.forEach((book) => {
    const item = document.createElement('li');
    const details = document.createElement('div');
    details.className = 'book-info';
    const title = document.createElement('strong');
    title.textContent = book.title;
    const author = document.createElement('span');
    author.textContent = book.author;
    details.append(title, author);

    const remove = document.createElement('button');
    remove.className = 'remove';
    remove.type = 'button';
    remove.textContent = 'Quitar';
    remove.setAttribute('aria-label', `Quitar ${book.title}`);
    remove.addEventListener('click', () => {
      books = books.filter((entry) => entry.id !== book.id);
      saveBooks();
      renderBooks();
    });
    item.append(details, remove);
    list.append(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const title = String(data.get('title')).trim();
  const author = String(data.get('author')).trim();
  if (!title || !author) return;

  books.unshift({ id: crypto.randomUUID(), title, author });
  saveBooks();
  form.reset();
  message.textContent = 'Libro agregado.';
  renderBooks();
});

search.addEventListener('input', renderBooks);
renderBooks();
