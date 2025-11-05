let todos = []; // ToDo アイテムの配列

document.addEventListener('DOMContentLoaded', () => {
  // --- 要素取得 ---
  const input = document.querySelector('#todoInput');
  const addBtn = document.querySelector('#addBtn');
  const todoList = document.querySelector('#todoList');
  const doneList = document.querySelector('#doneList');
  const taskCount = document.querySelector('#taskCount');
  const clearDoneBtn = document.querySelector('#clearDoneBtn');

  // --- 保存／読み込み ---
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  //
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
      }
    );

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

    li.innerHTML = '';// 一旦クリア
    li.appendChild(inputEl);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    inputEl.focus();// 入力欄にフォーカス
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
      
      li.addEventListener('dragstart', handleDragStart);
      li.addEventListener('dragover', handleDragOver);
      li.addEventListener('drop', handleDrop);

      // checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!todo.done;
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
      editBtn.textContent = '編集';
      editBtn.addEventListener('click', () => enterEditMode(index));

      // delete
      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.addEventListener('click', () => {
        todos.splice(index, 1);// 配列から削除
        saveTodos();
        renderTodos();
      });

      // move up button
      const upBtn = document.createElement('button');
      upBtn.textContent = '↑';
      upBtn.addEventListener('click', () => 
        moveTodo(index, -1)); // 上へ移動

      // move down button
      const downBtn = document.createElement('button');
      downBtn.textContent = '↓';
      downBtn.addEventListener('click', () => 
        moveTodo(index, 1)); // 下へ移動

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
  
  let draggedIndex = null;
  
  //ドラッグ開始時
  function handlerDragStart(e) {
    draggedIndex = e.target.dataset.index;
    e.dataTransfer.effectAllowed = 'move';
  }
  
  //ドラッグ中(上に重ねたとき)
  function handlerDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
  
  //ドロップ時
  function handlerDrop(e) {
    e.preventDefault();
    const targetIndex = e.target.closet('li').dataset.index;
    
    if(draggedIndex === null || targetIndex === undefined) return;
    
    //配列の順番を入れ替える
    const [movedItem] = todos.splice(draggedIndex, 1);
    todos.splice(targetIndex, 0, movedItem);
    
    saveTodo();
    renderTodos();
  }

  // --- タスク移動 ---
  function moveTodo(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= todos.length) return; // 範囲外チェック
    // 配列内で要素を入れ替え
    const [moveTodo] = todos.splice(index, 1);
    todos.splice(newIndex, 0, moveTodo);
    saveTodos();
    renderTodos();
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
    todos = todos.filter(t => !t.done);// done が false のものだけ残す
    saveTodos();
    renderTodos();
  }

  // --- イベント登録 ---
  addBtn.addEventListener('click', addTodo);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
  clearDoneBtn.addEventListener('click', clearDone);

  // --- 初期化 ---
  loadTodos();
  renderTodos();
});
