let todos = []; // ToDo アイテムの配列

document.addEventListener('DOMContentLoaded', () => {
  // --- 要素取得 ---
  const input = document.querySelector('#todoInput');
  const addBtn = document.querySelector('#addBtn');
  const todoList = document.querySelector('#todoList');
  const doneList = document.querySelector('#doneList');
  const taskCount = document.querySelector('#taskCount');
  const clearDoneBtn = document.querySelector('#clearDoneBtn');
  const dragThreshold = 10;
  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const deleteMessage = document.getElementById('deleteMessage');

  // ドラッグ・タッチ関連の変数
  let draggedIndex = null;
  let draggedIndexTouch = null;
  let draggedEl = null;
  let isDraggingTouch = false;
  let longPressTimer = null;
  let isLongPress = false;
  let deleteTargetIndex = null;
  let deleteTargetText = '';

  // --- 保存 ---
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  //--- 読み込み ---
  function loadTodos() {
    const saved = localStorage.getItem('todos');
    todos = saved ? JSON.parse(saved) : [];
  }

  // --- タスク数更新 ---
  function updateTaskCount() {
    const count = todoList.querySelectorAll('li').length;
    taskCount.textContent = count;
  }

  // --- 編集モードへ（index は todos の index） ---
  function enterEditMode(index) {
    // li を dataset で特定する（renderTodos で設定済み）
    const li = document.querySelector(`li[data-index='${index}']`);
    if (!li) return; // li が null のときの安全策
    const todo = todos[index];

    //編集用の入力欄作成
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = todo.text;

    // 保存ボタン作成
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';

    // キャンセルボタン作成
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'キャンセル';

    // 保存処理
    saveBtn.addEventListener('click', () => {
      const newText = inputEl.value.trim();
      if (newText === '') return;
      todos[index].text = newText;
      saveTodos();
      renderTodos();
    });

    // Enter キーで保存
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveBtn.click();
      }
    });

    // Escape キーで編集をキャンセル
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        renderTodos(); // 元に戻す
      }
    });

    // キャンセル処理
    cancelBtn.addEventListener('click', () => {
      renderTodos(); // 元に戻す
    });

    li.innerHTML = ''; // 一旦クリア
    li.appendChild(inputEl);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    inputEl.focus(); // 入力欄にフォーカス
  }

  // --- 描画（todos -> DOM） ---
  function renderTodos() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    // todos 配列を元に描画
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.setAttribute('draggable', true);
      li.dataset.index = index; // index で一意に特定
      li.tabIndex = 0;

      li.addEventListener('dragstart', handleDragStart);
      li.addEventListener('dragover', handleDragOver);
      li.addEventListener('drop', handleDrop);
      li.addEventListener('touchstart', handleTouchStart, { passive: false });
      li.addEventListener('touchmove', handleTouchMove, { passive: false });
      li.addEventListener('touchend', handleTouchEnd, { passive: false });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          startEditTodo(index, li);
        }
        if (e.key === 'Escape') {
          closeDeleteModal();
        }
      });

      // checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!todo.done; // done が true のときチェック
      checkbox.tabIndex = -1;
      checkbox.addEventListener('change', () => {
        todos[index].done = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      // text
      const span = document.createElement('span');
      span.textContent = todo.text;

      // edit
      const editBtn = document.createElement('button');
      editBtn.textContent = '📝';
      editBtn.addEventListener('click', () => enterEditMode(index));

      // delete
      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.tabIndex = -1;
      delBtn.addEventListener('click', () => {
        deleteTargetIndex = index; // 削除対象のインデックスを保存
        deleteTargetText = todos[index].text; // 削除対象のテキストを保存
        deleteMessage.textContent = `「${deleteTargetText}」を削除しますか？`; // メッセージ更新
        deleteModal.classList.remove('hidden'); // モーダル表示
      });

      // move up button
      const upBtn = document.createElement('button');
      upBtn.textContent = '▲';
      upBtn.addEventListener('click', () => moveTodo(index, -1)); // 上へ移動

      // move down button
      const downBtn = document.createElement('button');
      downBtn.textContent = '▼';
      downBtn.addEventListener('click', () => moveTodo(index, 1)); // 下へ移動

      // assemble
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
      li.appendChild(upBtn);
      li.appendChild(downBtn);

      if (todo.done) doneList.appendChild(li);
      else todoList.appendChild(li);
    });

    updateTaskCount();
  }

  document.addEventListener(
    'touchmove',
    (e) => {
      if (isDraggingTouch) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // --- ドラッグ開始時 ---
  function handleDragStart(e) {
    draggedIndex = e.target.dataset.index;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  }

  // --- ドラッグ中(上に重ねたとき) ---
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  //--- ドロップ時 ---
  function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('dragging');
    const targetIndex = e.target.closest('li').dataset.index;

    if (draggedIndex === null || targetIndex === undefined) return;

    //配列の順番を入れ替える
    const [movedItem] = todos.splice(draggedIndex, 1);
    todos.splice(targetIndex, 0, movedItem);

    saveTodos();
    renderTodos();
  }

  // --- タスク移動 ---
  function moveTodo(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= todos.length) return; //範囲外チェック
    // 配列内で要素を入れ替え
    const [todoToMove] = todos.splice(index, 1);
    todos.splice(newIndex, 0, todoToMove);
    saveTodos();
    renderTodos();
  }

  //---タッチ＆ドラッグ---
  function handleTouchStart(e) {
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
  function handleTouchMove(e) {
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

  function handleTouchEnd(e) {
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

  // --- タスク追加 ---
  function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text: text, done: false });
    input.value = '';
    saveTodos();
    renderTodos();
  }

  // --- 完了タスク一括削除 ---
  function clearDone() {
    todos = todos.filter((t) => !t.done); // done が false のものだけ残す
    saveTodos();
    renderTodos();
  }

  function startEditTodo(index, li) {
    const span = li.querySelector('.todo-text');
    if (!span) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.className = 'edit-input';

    li.replaceChild(input, span);
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        todos[index].text = input.value.trim();
        saveTodo();
        renderTodos();
      }

      if (e.key === 'Escape') {
        renderTodos();
      }
    });
  }

  function closeDeleteModal() {
    deleteModal.classList.add('hidden'); // モーダル非表示
    deleteTargetIndex = null; // 削除対象インデックスをリセット
    deleteTargetText = '';
  }

  // --- イベント登録 ---
  addBtn.addEventListener('click', addTodo);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  clearDoneBtn.addEventListener('click', clearDone);

  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  confirmDeleteBtn.addEventListener('click', () => {
    if (deleteTargetIndex === null) return;

    todos.splice(deleteTargetIndex, 1); // 配列から削除
    saveTodos();
    renderTodos();

    closeDeleteModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !deleteModal.classList.contains('hidden')) {
      closeDeleteModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  // --- 初期化 ---
  loadTodos();
  renderTodos();
});
