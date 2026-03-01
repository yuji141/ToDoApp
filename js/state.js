let todos = []; // ToDo アイテムの配列

// --- 取得 ---
export function getTodos() {
  return todos;
}

// --- 追加 ---
export function addTodo(text) {
  todos.push({ text, done: false });
}

// --- 削除 ---
export function deleteTodoIndex(index) {
  if (index === 0 || index === undefined) return;
  if (index < 0 || index >= todos.length) return;
  todos.splice(index, 1);
  saveTodos();
}

// --- 保存 ---
export function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
//--- 読み込み ---
export function loadTodos() {
  const saved = localStorage.getItem('todos');
  todos = saved ? JSON.parse(saved) : [];
}

// --- 完了状態切り替え ---
export function toggleTodoDone(index, done) {
  const todos = getTodos();
  todos[index].done = done;
  saveTodos();
  if (onChange) onChange();
}

let onChange = null;
// --- 変更監視登録 ---
export function subscribe(callback) {
  onChange = callback;
}

// --- 完了済み ToDo を一括削除 ---
export function clearDoneTodos() {
  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  if (onChange) onChange();
}

// --- ToDo テキストの更新 ---
export function updateTodoText(index, newText) {
  todos[index].text = newText;
  saveTodos();
}

// --- ToDo の並び替え ---
export function reorderTodo(fromIndex, toIndex) {
  const todos = getTodos();
  const [movedItem] = todos.splice(fromIndex, 1);
  todos.splice(toIndex, 0, movedItem);
  saveTodos();
}
