let onReorder = null;

// ドラッグ中のインデックス
export function setupDragAndDrop(Callback) {
  onReorder = Callback;
}


// --- ドラッグ開始時 ---
export function handleDragStart(e) {
  draggedIndex = e.target.dataset.index;
  e.dataTransfer.effectAllowed = 'move';
  e.target.classList.add('dragging');
}

// --- ドラッグ中(上に重ねたとき) ---
export function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

//--- ドロップ時 ---
export function handleDrop(e) {
  e.preventDefault();
  e.target.classList.remove('dragging');

  const targetLi = e.target.closest('li');
  if (!targetLi || draggedIndex === null) return;
  
  const targetIndex = targetLi.dataset.index;
  
  if (onReorder) {
    onReorder(Number(draggedIndex), Number(targetIndex));
  }
  draggedIndex = null;
}

// --- タスク移動 ---
export function moveTodo(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= todos.length) return; //範囲外チェック
  // 配列内で要素を入れ替え
  const [todoToMove] = todos.splice(index, 1);
  todos.splice(newIndex, 0, todoToMove);
  saveTodos();
  renderTodos();
}

//---タッチ＆ドラッグ---
export function handleTouchStart(e) {
  draggedEl = e.target.closest('li');
  if (!draggedEl) return;

  draggedIndexTouch = Number(draggedEl.dataset.index);
  isLongPress = false;
  isDraggingTouch = false;
  draggedEl.startY = e.touches[0].clientY;

  longPressTimer = setTimeout(() => {
    isLongPress = true;
  }, 250);
}

// --- タッチ移動中 ---
export function handleTouchMove(e) {
  if (!draggedEl) return;

  const touchY = e.touches[0].clientY;
  const deltaY = touchY - draggedEl.startY;
  const moveDistance = Math.abs(deltaY); // 移動距離の絶対値

  // しきい値チェック
  if (!isDraggingTouch && moveDistance < dragThreshold) {
    return; // 一定距離移動するまでドラッグ開始しない
  }

  // しきい値を超えた瞬間ドラッグ開始
  if (!isDraggingTouch) {
    if (!isLongPress) return; // 長押しでなければドラッグ開始しない
    if (moveDistance < dragThreshold) return;
    isDraggingTouch = true;
    draggedEl.classList.add('dragging-touch');
  }

  e.preventDefault();
  // ドラッグ中のみ要素を移動
  draggedEl.style.transform = `translateY(${deltaY}px)`;
  draggedEl.style.transition = 'none';
}

export function handleTouchEnd(e) {
  clearTimeout(longPressTimer);
  // 長押しでなければ終了
  if (!isLongPress) {
    draggedEl = null;
    draggedIndexTouch = null;
    isDraggingTouch = false;
    isLongPress = false;
    return;
  }

  e.preventDefault();
  if (!draggedEl) return;

  //元に戻す
  draggedEl.style.transform = '';
  draggedEl.style.transition = '';
  draggedEl.classList.remove('dragging-touch');

  //ドロップ先を判定
  const touchY = e.changedTouches[0].clientY;
  const elements = [...todoList.children, ...doneList.children];
  let targetIndex = draggedIndexTouch;

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (touchY > rect.top && touchY < rect.bottom) {
      targetIndex = Number(el.dataset.index);
      break;
    }
  }

  //配列入れ替え
  if (targetIndex !== draggedIndexTouch) {
    const [movedItem] = todos.splice(draggedIndexTouch, 1);
    todos.splice(targetIndex, 0, movedItem);
    saveTodos();
    renderTodos();
  }
  //状態リセット
  draggedEl = null;
  draggedIndexTouch = null;
  isDraggingTouch = false;
  isLongPress = false;
}
