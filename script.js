const btnArray = Array.from(document.getElementsByClassName('btn'));
const btnStart = document.getElementById('start');
const painel = document.querySelector('.painel');
const turno = document.getElementById('atual_turno');
const maior_turno = document.getElementById('maior_turno');
const title_start = document.getElementById("title_start");
let turn;
let isOrdering = false;
let currentTurn;
let winOrder = [];
let playerOrder = [];

// Verifique se há um valor salvo no localStorage e defina o maior turno se existir
if (localStorage.getItem('maior_turno')) {
  maior_turno.innerText = localStorage.getItem('maior_turno');
} else {
  localStorage.setItem('maior_turno', 0);
}

function randomInt() {
  return Math.floor(Math.random() * 4);
}

function showNextButton() {
  if (currentTurn < winOrder.length) {
    const nextButton = winOrder[currentTurn];
    btnArray[nextButton].classList.add('selected');

    setTimeout(function () {
      btnArray[nextButton].classList.remove('selected');

      setTimeout(function () {
        currentTurn++;
        showNextButton();
        if (currentTurn === winOrder.length) {
          isOrdering = false; // Marque o fim da ordem
        }
      }, 200);
    }, 500);
  }
}

function order() {
  isOrdering = true; // Sinalize que a ordem está em andamento
  for (let i = 0; i < turn; i++) {
    winOrder.push(randomInt());
  }
  showNextButton();
}

function start() {
  if (isOrdering) return; // Impedir o início se a ordem estiver em andamento
  winOrder.length = 0;
  playerOrder.length = 0;
  currentTurn = 0;
  turn = 1;
  painel.style.display = 'none';
  turno.textContent = turn;
  order();
}

function lost() {
  title_start.innerText = 'Você errou';
  btnStart.innerText = 'Restart';
  painel.style.display = 'flex';

  // Atualize o maior turno no localStorage se necessário
  if (parseInt(maior_turno.innerText) < parseInt(turno.innerText)) {
    maior_turno.innerText = turno.innerText;
    localStorage.setItem('maior_turno', turno.innerText);
  }
}

function equals(arr1, arr2) {
  let orderArr = true;
  arr1.forEach((num, index) => {
    if (num != arr2[index]) {
      lost();
      orderArr = false;
    }
  });

  if (orderArr && arr1.length == arr2.length) {
    turn++;
    order();
    turno.textContent = turn;
  }
}

btnArray.forEach(btn => {
  btn.addEventListener('click', () => {
    if (isOrdering) return; // Impedir cliques durante a ordem
    playerOrder.push(btnArray.indexOf(btn));
    equals(playerOrder, winOrder);
  });
});

btnStart.addEventListener('click', start);
