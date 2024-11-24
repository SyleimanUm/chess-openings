// Инициализация логики шахматной игры
const chess = new Chess();
// Массив ходов дебюта
let movesArray = [];
let currentMoveIndex = 0;

// Инициализация шахматной доски
const board = Chessboard('board', {
  draggable: true, // Возможность перетаскивать фигуры
  position: 'start', // Начальная позиция
  onDrop: (source, target) => {
    // Проверка легальности хода
    const move = chess.move({
      from: source,
      to: target,
      promotion: 'q' // Превращение пешки в ферзя
    });

    if (move === null) {
      return 'snapback'; // Если ход нелегален, вернуть фигуру
    }

    // Проверяем, совпадает ли ход с дебютом
    if (!validateMove(move.san)) {
      chess.undo(); // Отменяем ход в логике
      return 'snapback'; // Отменяем ход на доске
    }

    // Если ход корректен, обновляем доску
    board.position(chess.fen());

    // Увеличиваем индекс текущего хода
    currentMoveIndex++;

    // Обновляем PGN
    updatePGN();
  }
});


document.getElementById('set-opening').addEventListener('click', () => {
  const openingSelect = document.getElementById('opening-select');
  const openingName = openingSelect.value;

  // Загружаем дебюты из файла
  fetch('openings.json')
    .then(response => response.json())
    .then(data => {
      const selectedOpening = data.openings.find(opening => opening.name === openingName);
      if (selectedOpening) {
        movesArray = selectedOpening.moves;
        currentMoveIndex = 0; // Сбросить индекс хода
        chess.reset(); // Сбросить позицию
        board.position(chess.fen()); // Установить начальную позицию
      }
    })
    .catch(error => console.error('Ошибка при загрузке дебютов:', error));
});

// Функция проверки хода
function validateMove(move) {
  if (currentMoveIndex >= movesArray.length) {
    return false; // Нет ожидаемых ходов
  }
  return move === movesArray[currentMoveIndex]; // Сравниваем ход пользователя с ожидаемым
}

// Функция обновления записи ходов
function updatePGN() {
  const pgnDisplay = document.getElementById('pgn-display');
  pgnDisplay.textContent = chess.pgn();
}

// Парсим строку с ходами, удаляя числа
function parseMoves(movesString) {
  const moves = movesString.split(' ');
  let parsedMoves = [];

  // Проходим по массиву и извлекаем только шахматные ходы (игнорируя цифры и точки)
  moves.forEach(move => {
    if (!/^\d+\./.test(move)) { // Пропускаем номера ходов (например, "1.", "2.", и т.д.)
      parsedMoves.push(move);
    }
  });

  return parsedMoves;
}
