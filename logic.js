const commentsList = document.querySelector('#comments-list');
const form = document.querySelector('#add-rating-form');

let average = 0;
let numberOfRatings = 0;

function calculateSum(doc) {
  average += parseInt(doc.data().rating);
  numberOfRatings++;
}

function printAverage() {
  average = average / numberOfRatings;
  let div = document.querySelector('#average-rating');
  div.innerHTML = average;
}

function renderComment(doc) {
  let li = document.createElement('li');
  let comment = document.createElement('span');
  let rating = document.createElement('span');

  li.setAttribute('data-id', doc.id);
  comment.textContent = doc.data().comment;
  rating.textContent = doc.data().rating;

  li.appendChild(rating);

  calculateSum(doc);

  li.appendChild(comment);
  commentsList.appendChild(li);
}

function addListenerToAddButton() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('ramen-rating').add({
      rating: form.rating.value,
      comment: form.comment.value,
    });
    form.rating.value = '';
    form.comment.value = '';
  });
}

function addRealTimeRefresh() {
  db.collection('ramen-rating').onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == 'added') {
        renderComment(change.doc);
      }
    });
    printAverage();
  });
}

addListenerToAddButton();
addRealTimeRefresh();
