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

// Логика выбора дебюта
document.getElementById('set-opening').addEventListener('click', () => {
  const openingSelect = document.getElementById('opening-select');
  const moves = openingSelect.value;

  if (moves === 'start') {
    chess.reset(); // Сбросить позицию
  } else {
    chess.reset(); // Сбросить позицию перед установкой
    const movesArray = moves.split(' '); // Разделить ходы
    movesArray.forEach(move => chess.move(move)); // Применить ходы
  }

  // Установить позицию на доске
  board.position(chess.fen());
});
