function getItems(key) {
  return localStorage.getItem(key);
}

function setItems(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  localStorage.removeItem(key);
}

export { getItems, setItems, removeItem };
