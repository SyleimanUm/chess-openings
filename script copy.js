// Инициализация логики шахматной игры
const chess = new Chess();

// Инициализация шахматной доски
const board = Chessboard('board', {
  draggable: true, // Фигуры можно перетаскивать
  position: 'start', // Начальная позиция
  onDrop: (source, target) => {
    // Проверка легальности хода
    const move = chess.move({
      from: source,
      to: target,
      promotion: 'q' // Превращение пешки в ферзя
    });

    if (move === null) return 'snapback'; // Если ход нелегален, вернуть фигуру

    // Обновить доску после успешного хода
    board.position(chess.fen());
  }
});

// Ход дебюта
let movesArray = [];
let currentMoveIndex = 0;


// Логика выбора дебюта
document.getElementById('set-opening').addEventListener('click', () => {
  const openingSelect = document.getElementById('opening-select');
  const moves = openingSelect.value;

  // Сброс позиции на начальную
  chess.reset();

  if (moves === 'start') {
    movesArray = [];
  } else {
    // Разбиваем строку на ходы и сохраняем их в массив
    movesArray = moves.split(' ');
    currentMoveIndex = 0;
  }

  // Обновить доску
  board.position(chess.fen());

  // Включить кнопку "Следующий ход", если есть ходы
  document.getElementById('next-move').disabled = movesArray.length === 0;
});

// Обработка следующего хода
document.getElementById('next-move').addEventListener('click', () => {
  if (currentMoveIndex < movesArray.length) {
    // Делаем ход из массива дебюта
    const move = chess.move(movesArray[currentMoveIndex]);
    if (move) {
      board.position(chess.fen()); // Обновить доску
      currentMoveIndex++; // Переход к следующему ходу
    }
  }

  // Если все ходы выполнены, отключить кнопку
  if (currentMoveIndex >= movesArray.length) {
    document.getElementById('next-move').disabled = true;
  }
});
