const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');

//追加ボタンが押された時
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (text === '') return; //空文字は無視

  //li要素を作成
  const li = document.createElement('li');
  li.textContent = text;

  //削除ボタンうぃ作成
  const delBtn = document.createElement('button');
  delBtn.textContent = '削除';
  delBtn.addEventListener('click', () => {
    li.remove();
  });

  li.appendChild(delBtn);
  todoList.appendChild(li);

  //入力欄を空にする
  input.value = '';
});
