/**
 * 時間帯切り替えUIを作成する
 *
 * @param {Function} onChange - 時間帯が変更されたときの処理
 * @returns {Object} UIの操作に使用するメソッド
 */
export function createTimeControl(onChange) {
  // ========================================
  // ① 時間帯切り替えパネルの作成
  // ========================================

  const timePanel = document.createElement('div');
  timePanel.className = 'time-panel';

  timePanel.innerHTML = `
    <div class="time-panel-title">時間帯を変更</div>

    <div class="time-button-group">
      <button
        class="time-button"
        data-time="day"
        type="button"
      >☀️ 昼</button>

      <button
        class="time-button"
        data-time="sunset"
        type="button"
      >🌇 夕方</button>

      <button
        class="time-button"
        data-time="night"
        type="button"
      >🌙 夜</button>
    </div>
  `;

  document.body.appendChild(timePanel);

  // このUI内のボタンだけを取得
  const buttons = timePanel.querySelectorAll('.time-button');

  // ========================================
  // ② 選択中のボタンを更新
  // ========================================

  function setActiveTime(timeOfDay) {
    buttons.forEach((button) => {
      const isActive =
        button.dataset.time === timeOfDay;

      button.classList.toggle('active', isActive);

      button.setAttribute(
        'aria-pressed',
        String(isActive)
      );
    });
  }

  // ========================================
  // ③ ボタンクリックイベント
  // ========================================

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const timeOfDay = button.dataset.time;

      // main.jsに時間帯の変更を通知
      onChange(timeOfDay);
    });
  });

  // ========================================
  // ④ 外部に公開するメソッド
  // ========================================

  return {
    setActiveTime
  };
}
