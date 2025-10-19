// main.js（完成版：配列をソースにして renderTodo一本化 + 編集機能）

let todos = []; // グローバルに保持してもよい（初期ロードで上書き）

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
    if (!li) return;
    const todo = todos[index];

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = todo.text;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'キャンセル';

    saveBtn.addEventListener('click', () => {
      const newText = inputEl.value.trim();
      if (newText === '') return;
      todos[index].text = newText;
      saveTodos();
      renderTodos();
    });

    cancelBtn.addEventListener('click', () => {
      renderTodos(); // 元に戻す
    });

    li.innerHTML = '';
    li.appendChild(inputEl);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    inputEl.focus();
  }

  // --- 描画（todos -> DOM） ---
  function renderTodos() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.dataset.index = index; // これで index で一意に特定できる

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
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      });

      // assemble
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      if (todo.done) doneList.appendChild(li);
      else todoList.appendChild(li);
    });

    updateTaskCount();
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
    todos = todos.filter(t => !t.done);
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
