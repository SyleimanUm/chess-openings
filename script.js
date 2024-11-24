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

// Переменные для хранения ходов дебюта
let movesArray = [];
let currentMoveIndex = 0;

// Загружаем дебюты из файла JSON
fetch('openings.json')
  .then(response => response.json())
  .then(data => {
    const openings = data.openings;
    
    // Заполняем выпадающий список дебютами
    const openingSelect = document.getElementById('opening-select');
    openings.forEach(opening => {
      const option = document.createElement('option');
      option.value = opening.moves;
      option.textContent = opening.name;
      openingSelect.appendChild(option);
    });
  })
  .catch(error => console.error('Ошибка при загрузке дебютов:', error));

// Логика выбора дебюта
document.getElementById('set-opening').addEventListener('click', () => {
  const openingSelect = document.getElementById('opening-select');
  const moves = openingSelect.value;

  // Сброс позиции на начальную
  chess.reset();

  if (moves === 'start') {
    movesArray = [];
  } else {
    // Преобразуем строку в массив ходов, игнорируя нумерацию ходов
    movesArray = parseMoves(moves);
    currentMoveIndex = 0;
  }

  // Обновить доску
  board.position(chess.fen());

  // Включить кнопку "Следующий ход", если есть ходы
  document.getElementById('next-move').disabled = movesArray.length === 0;
});

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

// Обработка следующего хода
document.getElementById('next-move').addEventListener('click', () => {
  // Проверяем, что текущий индекс меньше длины массива ходов
  if (currentMoveIndex < movesArray.length) {
    // Делаем ход из массива дебюта
    const move = chess.move(movesArray[currentMoveIndex]);

    // Если ход возможен, обновляем доску
    if (move) {
      board.position(chess.fen()); // Обновить доску с новым состоянием
      currentMoveIndex++; // Переход к следующему ходу
    }
  }

  // Если все ходы выполнены, отключаем кнопку
  if (currentMoveIndex >= movesArray.length) {
    document.getElementById('next-move').disabled = true;
  }
});

// Обработка возврата хода
document.getElementById('undo-move').addEventListener('click', () => {
  // Отменяем последний ход
  chess.undo();
  
  // Обновляем доску
  board.position(chess.fen());
  
  // Уменьшаем индекс текущего хода
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
  }
  
  // Включаем кнопку "Следующий ход", если были отменены ходы
  document.getElementById('next-move').disabled = false;
});
