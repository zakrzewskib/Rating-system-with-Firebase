const commentsList = new Array(2);
commentsList[0] = document.querySelector('#comments-list-0');
commentsList[1] = document.querySelector('#comments-list-1');

const form = new Array(2);
form[0] = document.querySelector('#add-rating-form-0');
form[1] = document.querySelector('#add-rating-form-1');

let sum = new Array(2).fill(0);
let numberOfRatings = new Array(2).fill(0);

let result = 0;
function calculateSum(doc, option) {
  sum[option] += parseInt(doc.data().rating);
  numberOfRatings[option]++;
}

function printAverage(option) {
  let average = sum[option] / numberOfRatings[option];
  let div = document.querySelector('#average-rating-' + option);
  div.innerHTML = Math.round(average * 100) / 100;
}

function renderComment(doc, option) {
  let li = document.createElement('li');
  let comment = document.createElement('div');
  let rating = document.createElement('div');

  comment.classList.add('comment');
  rating.classList.add('rating');

  li.setAttribute('data-id', doc.id);
  comment.textContent = doc.data().comment;
  rating.textContent = doc.data().rating;

  li.appendChild(rating);

  calculateSum(doc, option);

  li.appendChild(comment);
  commentsList[option].appendChild(li);
}

function addListenerToAddButton(option) {
  form[option].addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('ramen-rating-' + option).add({
      rating: document.getElementById('rating-' + option).value,
      comment: document.getElementById('comment-' + option).value,
    });
    document.getElementById('rating-' + option).value = '';
    document.getElementById('comment-' + option).value = '';
  });
}

function addRealTimeRefresh(option) {
  db.collection('ramen-rating-' + option)
    .orderBy('rating')
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == 'added' || change.type == 'update') {
          renderComment(change.doc, option);
          printAverage(option);
        }
      });
    });
}

addListenerToAddButton(0);
addListenerToAddButton(1);
addRealTimeRefresh(0);
addRealTimeRefresh(1);
