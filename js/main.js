import { addTodo } from './state.js';
import { subscribe } from './state.js';
import { renderTodos } from './render.js';
import { clearDoneTodos } from './state.js';
import { getTodos, updateTodoText } from './state.js';
import { openDeleteModal, setOnConfirmDelete } from './modal.js';
import { deleteTodoByIndex } from './modal.js';
import { reorderTodo} from './state.js';
import { setupDragAndDrop} from './drag.js';

// --- 編集モードへ（index は todos の index） ---
export function enterEditMode(index) {
  const todos = getTodos();
  const todo = todos[index];
  if (!todo) return;

  // li を dataset で特定する（renderTodos で設定済み）
  const li = document.querySelector(`li[data-index='${index}']`);
  if (!li) return; // li が null のときの安全策

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

    updateTodoText(index, newText);
    renderTodos();
  });

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

  li.innerHTML = ''; // 一旦クリア
  li.appendChild(inputEl);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);
  inputEl.focus(); // 入力欄にフォーカス
}

document.addEventListener('DOMContentLoaded', () => {
  // --- 要素取得 ---
  const input = document.querySelector('#todoInput');
  const addBtn = document.querySelector('#addBtn');
  const todoList = document.querySelector('#todoList');
  const doneList = document.querySelector('#doneList');
  const taskCount = document.querySelector('#taskCount');
  const clearDoneBtn = document.querySelector('#clearDoneBtn');
  const dragThreshold = 10;
  const todoForm = document.getElementById('todoForm');
  
  // --- タスク追加 ---
  function handleAddTodo() {
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    renderTodos();
    input.value = '';
  }
  setOnConfirmDelete((index) => {
    console.log('【main】削除 index を受信:', index);

    deleteTodoByIndex(index);
    renderTodos();
  });
  
  function updateTodoOrder(fromIndex, toIndex) {
    reorderTodo(fromIndex, toIndex);
    renderTodos();
  }

  //追加ボタン・Enterキーでタスク追加
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddTodo();
  });
  //完了タスク一括削除
  clearDoneBtn.addEventListener('click', () => {
    clearDoneTodos();
  });
  
  setupDragAndDrop(updateTodoOrder);
});

// --- 初期化 ---
renderTodos();