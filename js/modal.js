import { getTodos, saveTodos } from './state.js';

const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const deleteMessage = document.getElementById('deleteMessage');

let deleteTargetIndex = null;
let deleteTargetText = '';
let onconfirmDelete = null;

// モーダルを開く関数
export function openDeleteModal(index, text) {
  deleteTargetIndex = index; // 削除対象のインデックスを保存
  deleteTargetText = text; // 削除対象のテキストを保存
  deleteMessage.textContent = `「${text}」を削除しますか？`; // メッセージ更新
  deleteModal.classList.remove('hidden'); // モーダル表示
}

// モーダルを閉じる関数
export function closeDeleteModal() {
  deleteModal.classList.add('hidden'); // モーダル非表示
  deleteTargetIndex = null; // 削除対象インデックスをリセット
  deleteTargetText = '';
}

// --- ToDo アイテムの削除 ---
export function deleteTodoByIndex(index) {
  const todos = getTodos();
  todos.splice(index, 1); // 配列から削除
  saveTodos();
}

export function setOnConfirmDelete(callback) {
  onconfirmDelete = callback;
}

// キャンセルボタンのイベントリスナー
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// 確認ボタンのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  confirmDeleteBtn.addEventListener('click', () => {
    console.log('【modal】削除ボタンが押された');
    if (deleteTargetIndex === null) return;

    if (onconfirmDelete) {
      onconfirmDelete(deleteTargetIndex);
    }
    closeDeleteModal();
  });

  // Escapeキーでモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !deleteModal.classList.contains('hidden')) {
      closeDeleteModal();
    }
  });

  // モーダルの背景クリックで閉じる
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
});
