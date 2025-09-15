document.addEventListener('DOMContentLoaded', () => {
const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');

function addTodo() {  
    const text = input.value.trim();
    if (text === '') return; //空文字は無視
  
    //li要素を作成
    const li = document.createElement('li');
    li.textContent = text;
  
    //削除ボタンを作成
    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => {
      li.remove();
    });
  
    li.appendChild(delBtn);
    todoList.appendChild(li);
  
    //入力欄を空にする
    input.value = '';
  }
  //追加ボタンで追加
  addBtn.addEventListener('click', addTodo);

  //Enterキーで追加
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
});
