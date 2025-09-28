document.addEventListener('DOMContentLoaded', () => {
const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');
const doneList = document.querySelector('#doneList');
const taskCount = document.querySelector('#taskCount');

//Todoを追加する関数
function addTodo() {  
    const text = input.value.trim();
    if (text === '') return; //空文字は無視
  
    //li要素を作成
    const li = document.createElement('li');
    
    //チェックボックスを作成
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        li.classList.add('done'); //完了：doneクラスを追加
        doneList.appendChild(li); //完了リストに移動
      } else {
        li.classList.remove('done'); //未完了：doneクラスを削除
        todoList.appendChild(li); //未完了リストに移動
      }
      updateTaskCount(); //タスク数を更新
    });
    //テキスト
    const span = document.createElement('span');
    span.textContent = text;
    
    //削除ボタンを作成
    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';

    delBtn.addEventListener('click', () => {
      li.remove();
      updateTaskCount(); //タスク数を更新
    });
  
    //liに要素をまとめる
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  
    //入力欄を空にする
    input.value = '';

    //タスク数を更新
    updateTaskCount();
  }
  
  //タスク数を更新する関数
  function updateTaskCount() {
    const todos = todoList.querySelectorAll('li');
    taskCount.textContent = todos.length;
  }

  //追加ボタンで追加
  addBtn.addEventListener('click', addTodo);

  //Enterキーで追加
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
});
