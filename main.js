document.addEventListener('DOMContentLoaded', () => {
const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');

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
        li.style.textDecoration = 'line-through'; //完了：取り消し線
      } else {
        li.style.textDecoration = '';//未完了：もとに戻す
      }
      updateCount(); //タスク数を更新
    });
    //テキスト
    const span = document.createElement('span');
    span.textContent = text;
    
    //削除ボタンを作成
    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => {
      li.remove();
      updateCount(); //タスク数を更新
    });
  
    //liに要素をまとめる
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  
    //入力欄を空にする
    input.value = '';

    //タスク数を更新
    updateCount();
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

//タスク数を更新する関数
function updateCount() {
  const items = todoList.querySelectorAll('li');
  let count = 0;
  items.forEach(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (!checkbox.checked) count++; //チェックが入っていないものをカウント
  });
  //画面に表示
  document.querySelector('#taskCount').textContent = count;
}