
/**
 * 3Dオブジェクトの情報パネル
 */
export function createObjectInfoPanel(onClose = () => {}) {
  // パネルを作成
  const panel = document.createElement('div');
  panel.className = 'object-info-panel';
  panel.hidden = true;

  // タイトル
  const title = document.createElement('h3');
  title.className = 'object-info-title';

  // 説明
  const description = document.createElement('p');
  description.className = 'object-info-description';

  // 閉じるボタン
  const closeButton = document.createElement('button');
  closeButton.className = 'object-info-close';
  closeButton.type = 'button';
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', '閉じる');

  // 子要素を追加
  panel.appendChild(closeButton);
  panel.appendChild(title);
  panel.appendChild(description);

  document.body.appendChild(panel);

  // パネルを表示する
  function show(data) {
    title.textContent = data.title;
    description.textContent = data.description;

    panel.hidden = false;
  }

  // パネルを閉じる
  function hide() {
    panel.hidden = true;
  }

  closeButton.addEventListener('click', () => {
    hide();
    onClose();
});

  return {
    show,
    hide
  };
}
