# 雙 NPC 隨機輪替系統說明

進入 `bar.html` 時，系統會自動以 **50% : 50% 機率隨機挑選一位 NPC** 出現值班，並自動套用該 NPC 專屬的對話底圖、開場白、選項文字與動作影片！

---

### 🎨 1. 美術素材放置位置

#### A. 左側對話框底圖（放在 `assets/images/dialogues/npc/`）
- **NPC 1 的對話框底圖**：`dialogue-box-bg-npc1.png`
- **NPC 2 的對話框底圖**：`dialogue-box-bg-npc2.png`

#### B. 右側選項面板底圖（通用，放在 `assets/images/dialogues/options/`）
- `options-box-bg.png`

#### C. NPC 動作影片（請放入各自獨立的子資料夾）
- **NPC 1 影片資料夾**：`assets/videos/npc/npc1/`
  - `npc-idle.webm`（待機）
  - `npc-talk.webm`（選項 1 動作）
  - `npc-happy.webm`（選項 2 動作）
  - `npc-explain.webm`（選項 3 動作）
- **NPC 2 影片資料夾**：`assets/videos/npc/npc2/`
  - `npc-idle.webm`
  - `npc-talk.webm`
  - `npc-happy.webm`
  - `npc-explain.webm`

---

### ✍️ 2. 如何修改兩位 NPC 的文字台詞？

打開 `js/bar.js`，頂部有非常清楚的 `npcProfiles` 設定物件，您可以直接在裡面自由修改文字：

```javascript
const npcProfiles = {
  // === NPC 1 ===
  npc1: {
    welcomeText: '歡迎光臨土豆與蜜酒！我是店長，今晚想喝點什麼...',
    optionsText: {
      '1': '看看今晚推薦的特色調酒',
      '2': '聊聊蜜酒的釀造過程',
      '3': '打聽土豆與蜜酒的由來'
    },
    responses: {
      '1': { anim: 'npc-talk', text: '推薦嚐嚐我們招牌的「特釀蜜酒」！...' },
      '2': { anim: 'npc-happy', text: '哈哈，我們使用的是純天然野蜂蜜...' },
      '3': { anim: 'npc-explain', text: '這家店是為了讓剛結束討伐戰的光之戰士們...' }
    }
  },

  // === NPC 2 ===
  npc2: {
    welcomeText: '哎呀，歡迎光臨！外頭很冷吧？熱呼呼的馬鈴薯料理已經剛出爐囉！',
    optionsText: {
      '1': '看看今晚剛出爐的美食',
      '2': '詢問主廚推薦料理',
      '3': '聊聊冒險路上好玩的見聞'
    },
    responses: {
      '1': { anim: 'npc-talk', text: '我們剛炸好一整盤香脆的酥炸薯角！...' },
      '2': { anim: 'npc-happy', text: '只要是馬鈴薯我都愛！...' },
      '3': { anim: 'npc-explain', text: '今天有遇到什麼難纏的魔物嗎？...' }
    }
  }
};
```

---

### 🚀 3. 未來如何增加第 3、第 4 個 NPC？
只需在 `npcProfiles` 裡面依樣畫葫蘆複製一份貼上命名為 `npc3`、`npc4`，系統就會自動計算平分機率（例如 3 個人時自動變成 33% / 33% / 33%），完全不需要動到其他程式邏輯！
