const commentsList = document.querySelector('#comments-list');
const form = document.querySelector('#add-rating-form');

const commentsList2 = document.querySelector('#comments-list2');
const form2 = document.querySelector('#add-rating-form2');

let average = 0;
let numberOfRatings = 0;

let average2 = 0;
let numberOfRatings2 = 0;

function calculateSum(doc, option) {
  if (option == 1) {
    average += parseInt(doc.data().rating);
    numberOfRatings++;
  } else {
    average2 += parseInt(doc.data().rating);
    numberOfRatings2++;
  }
}

function printAverage(option) {
  if (option == 1) {
    average = average / numberOfRatings;
    let div = document.querySelector('#average-rating');
    div.innerHTML = average;
  } else {
    average2 = average2 / numberOfRatings2;
    let div = document.querySelector('#average-rating2');
    div.innerHTML = average2;
  }
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
  if (option == 1) {
    commentsList.appendChild(li);
  } else {
    commentsList2.appendChild(li);
  }
}

function addListenerToAddButton(option) {
  if (option == 1) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      db.collection('ramen-rating').add({
        rating: form.rating.value,
        comment: form.comment.value,
      });
      form.rating.value = '';
      form.comment.value = '';
    });
  } else {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      db.collection('ramen-rating-2').add({
        rating: form2.rating.value,
        comment: form2.comment.value,
      });
      form2.rating.value = '';
      form2.comment.value = '';
    });
  }
}

function addRealTimeRefresh(option) {
  if (option === 1) {
    db.collection('ramen-rating')
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
  } else {
    db.collection('ramen-rating-2')
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
}

addListenerToAddButton(1);
addListenerToAddButton(2);
addRealTimeRefresh(1);
addRealTimeRefresh(2);
