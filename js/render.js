import { deleteTodoIndex, getTodos, toggleTodoDone } from './state.js';
import { handleDragStart, handleDragOver, handleDrop, handleTouchEnd, handleTouchMove, handleTouchStart, moveTodo } from './drag.js';
import { openDeleteModal, closeDeleteModal } from './modal.js';
import { enterEditMode } from './main.js';

const taskCountEl = document.getElementById('taskCount');

// --- 描画（todos -> DOM） ---
export function renderTodos() {
  const todos = getTodos();
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  // todos 配列を元に描画
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.setAttribute('draggable', true);
    li.dataset.index = index; // index で一意に特定
    li.tabIndex = 0;

    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('touchstart', handleTouchStart, { passive: false });
    li.addEventListener('touchmove', handleTouchMove, { passive: false });
    li.addEventListener('touchend', handleTouchEnd, { passive: false });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        startEditTodo(index, li);
      }
      if (e.key === 'Escape') {
        closeDeleteModal();
      }
    });

    // checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.done; // done が true のときチェック
    checkbox.tabIndex = -1;
    checkbox.addEventListener('change', () => {
      toggleTodoDone(index, checkbox.checked);
      renderTodos();
    });

    // text
    const span = document.createElement('span');
    span.textContent = todo.text;

    // edit
    const editBtn = document.createElement('button');
    editBtn.textContent = '📝';
    editBtn.addEventListener('click', () => enterEditMode(index));

    // delete
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.tabIndex = -1;
    delBtn.addEventListener('click', () => {
      openDeleteModal(index, todo.text, (deleteIndex) => {
        deleteTodoIndex(deleteIndex);
        renderTodos();
      });
    });

    // move up button
    const upBtn = document.createElement('button');
    upBtn.textContent = '▲';
    upBtn.addEventListener('click', () => {
      moveTodo(index, -1); // 上へ移動
      renderTodos();
    });

    // move down button
    const downBtn = document.createElement('button');
    downBtn.textContent = '▼';
    downBtn.addEventListener('click', () => {
      moveTodo(index, 1); // 下へ移動
      renderTodos();
    });

    // assemble
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    li.appendChild(upBtn);
    li.appendChild(downBtn);

    if (todo.done) doneList.appendChild(li);
    else todoList.appendChild(li);
  });

  updateTaskCount();
}

// --- タスク数更新 ---
export function updateTaskCount() {
  const todos = getTodos();
  const count = todos.filter((todo) => !todo.done).length;
  taskCountEl.textContent = `${count}件`;
}
