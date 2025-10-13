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

    const newTodo = { text: text, done: false };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    input.value = '';

    //li要素を作成
    const li = document.createElement('li');

    //チェックボックスを作成
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    //テキスト
    const span = document.createElement('span');
    span.textContent = text;

    //削除ボタンを作成
    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';

    //戻すボタンを作成
    const backBtn = document.createElement('button');
    backBtn.textContent = '戻す';
    backBtn.style.display = 'none'; //初期状態では非表示(完了次第表示)

    //チェックボックスのイベント
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        li.classList.add('done'); //完了：doneクラスを追加
        doneList.appendChild(li); //完了リストに移動
        backBtn.style.display = 'inline'; //戻すボタンを表示
      } else {
        li.classList.remove('done'); //未完了：doneクラスを削除
        todoList.appendChild(li); //未完了リストに移動
        backBtn.style.display = 'none'; //戻すボタンを非表示
      }
      updateTaskCount(); //タスク数を更新
    });

    //削除ボタンのイベント
    delBtn.addEventListener('click', () => {
      li.remove();
      updateTaskCount(); //タスク数を更新
    });

    //戻すボタンのイベント
    backBtn.addEventListener('click', () => {
      checkbox.checked = false; //チェックを外す
      li.classList.remove('done'); //doneクラスを削除
      todoList.appendChild(li); //未完了リストに移動
      backBtn.style.display = 'none'; //戻すボタンを非表示
      updateTaskCount(); //タスク数を更新
    });

    //liに要素をまとめる
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(backBtn);
    todoList.appendChild(li);

    //入力欄を空にする
    input.value = '';
    renderTodos();
    updateTaskCount();
    saveTodos();

    //タスク数を更新
    updateTaskCount();
  }

  //タスク数を更新する関数
  function updateTaskCount() {
    const todos = todoList.querySelectorAll('li');
    taskCount.textContent = todos.length; // todoList に残っている li の数をそのまま表示
  }
  //完了リストをクリアする関数
  clearDoneBtn.addEventListener('click', () => {
    doneList.innerHTML = ''; //完了リストをクリア
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
