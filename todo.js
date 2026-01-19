let todos = []; // ToDo アイテムの配列

// --- 保存 ---
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
//--- 読み込み ---
function loadTodos() {
  const saved = localStorage.getItem('todos');
  todos = saved ? JSON.parse(saved) : [];
}

function deleteTodoByIndex(index) {
  todos.splice(index, 1); // 配列から削除
  saveTodos();
  renderTodos();
}
