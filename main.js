let todos = []; //全てのタスクを管理する配列

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#todoInput');
  const addBtn = document.querySelector('#addBtn');
  const todoList = document.querySelector('#todoList');
  const doneList = document.querySelector('#doneList');
  const taskCount = document.querySelector('#taskCount');
  const clearDoneBtn = document.querySelector('#clearDoneBtn');
  loadTodos();
  renderTodos();
  updateTaskCount();

  //Todoを追加する関数
  function addTodo() {
    const text = input.value.trim();
    if (text === '') return; //空文字は無視

    todos.push({ text: text, done: false });
    saveTodos();
    renderTodos();
    input.value = '';
    updateTaskCount();

  }
  
  //タスク数を更新する関数
  function updateTaskCount() {
    const todos = todoList.querySelectorAll('li');
    taskCount.textContent = todos.length; // todoList に残っている li の数をそのまま表示
  }
  //完了リストをクリアする関数
  clearDoneBtn.addEventListener('click', () => {
    //完了リストを空にする
    todos = todos.filter((todo) => !todo.done);
    saveTodos(); //ローカルストレージに保存
    renderTodos(); //リストを再描画
    updateTaskCount(); //タスク数を更新
  });
  
  //追加ボタンで追加
  addBtn.addEventListener('click', addTodo);
  
  //Enterキーで追加
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
  
  //ローカルストレージに保存する関数
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  
  function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
      todos = JSON.parse(saved);
    } else {
      todos = [];
    }
  }
  
  function renderTodos() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;
      
      const span = document.createElement('span');
      span.textContent = todo.text;
      
      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      //編集ボタン作成
      const editBtn =document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.addEventListener('click', () => editTodo(index));
      
      //削除イベント
      delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
        updateTaskCount();
      });
      
      //チェックイベント
      checkbox.addEventListener('change', () => {
        todo.done = checkbox.checked;
        saveTodos();
        renderTodos();
        updateTaskCount();
      });
      
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      
      if (todo.done) {
        doneList.appendChild(li);
      } else {
        todoList.appendChild(li);
      }
    });
    updateTaskCount();
  }
});

//編集用ボタン関数
function editTodo(index) {
  const li = todoList.children[index];
  const todo = todos[index];
  
  //テキスト入力欄に切り替え
  const input = document.createElement('input');
  input.type = 'text';
  input.value = todo.text;
  
  //保存ボタンを作成
  const saveBtn = document.createElement('button');
  saveBtn.textContent = '保存';
  
  //保存ボタンのイベント
  saveBtn.addEventListener('click', () => {
    const newText = input.value.trim();
    if (newText === '') { return;
      
      todos[index].text = newText;
      saveTodos();
      renderTodos();
    }
  });
  
  //liの内容を置き換え
  li.innerHTML = '';
  li.appendChild(input);
  li.appendChild(saveBtn);
}