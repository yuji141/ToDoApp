import { addTodo } from './state.js';
import { subscribe } from './state.js';
import { renderTodos } from './render.js';
import { clearDoneTodos } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- 要素取得 ---
  const input = document.querySelector('#todoInput');
  const addBtn = document.querySelector('#addBtn');
  const todoList = document.querySelector('#todoList');
  const doneList = document.querySelector('#doneList');
  const taskCount = document.querySelector('#taskCount');
  const clearDoneBtn = document.querySelector('#clearDoneBtn');
  const dragThreshold = 10;

  // ドラッグ・タッチ関連の変数
  let draggedIndex = null;
  let draggedIndexTouch = null;
  let draggedEl = null;
  let isDraggingTouch = false;
  let longPressTimer = null;
  let isLongPress = false;

  // --- 編集モードへ（index は todos の index） ---
  function enterEditMode(index) {
    // li を dataset で特定する（renderTodos で設定済み）
    const li = document.querySelector(`li[data-index='${index}']`);
    if (!li) return; // li が null のときの安全策
    const todo = todos[index];

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
      todos[index].text = newText;
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

  document.addEventListener(
    'touchmove',
    (e) => {
      if (isDraggingTouch) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // --- タスク追加 ---
  function handleAddTodo() {
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = '';
    renderTodos();
  }

  function startEditTodo(index, li) {
    const span = li.querySelector('.todo-text');
    if (!span) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.className = 'edit-input';

    li.replaceChild(input, span);
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        todos[index].text = input.value.trim();
        saveTodo();
        renderTodos();
      }

      if (e.key === 'Escape') {
        renderTodos();
      }
    });
  }

  // --- イベント登録 ---
  addBtn.addEventListener('click', handleAddTodo);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  clearDoneBtn.addEventListener('click', () => {
    clearDoneTodos();
  });
});

// --- 初期化 ---
renderTodos();
