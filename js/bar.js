// 土豆與蜜酒 - 吧檯頁面互動控制器 (bar.html)

const barNpcVideo = document.getElementById("bar-npc-video");
const npcDialogueBox = document.getElementById("npc-dialogue-box");
const npcDialogueBgImg = document.getElementById("npc-dialogue-bg-img");
const npcDialogueText = document.getElementById("npc-dialogue-text");
const optionsDialogueBox = document.getElementById("options-dialogue-box");
const optLine1 = document.getElementById("opt-line-1");
const optLine2 = document.getElementById("opt-line-2");
const optLine3 = document.getElementById("opt-line-3");

const navLogoImg = document.getElementById("nav-logo-img");
const navLogoText = document.querySelector(".nav-logo-text");

// 1. 導覽列 LOGO 圖片防呆
if (navLogoImg) {
  navLogoImg.addEventListener("load", () => {
    if (navLogoImg.naturalWidth > 120 && navLogoText) {
      navLogoText.style.display = "none";
    }
  });
  navLogoImg.addEventListener("error", () => {
    navLogoImg.style.display = "none";
    if (navLogoText) navLogoText.style.display = "inline";
  });
}

// 1.1 地址圖片防呆 (未放入圖片時自動隱藏，避免破圖)
const barAddressImg = document.getElementById("bar-address-img");
const barAddressBadge = document.querySelector(".bar-address-badge");
if (barAddressImg) {
  barAddressImg.addEventListener("error", () => {
    if (barAddressBadge) barAddressBadge.style.display = "none";
  });
}

// ==================== NPC 資料庫設定 (隨機 50% / 50%) ====================
const npcProfiles = {
  npc1: {
    name: "橋本懷奈",
    dialogueBg: "assets/images/dialogues/npc/dialogue-box-bg-npc1.png",
    videoFolder: "assets/videos/npc/npc1", // 專屬動作影片路徑
    welcomeAnim: "npc-welcome",           // 開頭打招呼動畫 (播一次)
    idleAnim: "npc-idle",                 // 常態待機動畫 (打招呼後循環播放)
    welcomeText: "歡迎光臨~今天想喝點什麼？",
    optionsText: {
      1: "你是做什麼的？",
      2: "這裡是什麼地方？",
      3: "(發出組隊邀請)",
    },
    responses: {
      1: {
        anim: "npc-shakedrink",
        text: "我是這間店的老闆，副業是打絕本。",
      },
      2: {
        anim: "npc-scheme",
        text: "我的店，酷吧！？",
      },
      3: {
        anim: "npc-spectacles",
        text: "打本？我們走吧！",
      },
    },
  },

  npc2: {
    name: "姆姆貓",
    dialogueBg: "assets/images/dialogues/npc/dialogue-box-bg-npc2.png",
    videoFolder: "assets/videos/npc/npc2", // 專屬動作影片路徑
    welcomeAnim: "npc-welcome",           // 開頭打招呼動畫 (播一次)
    idleAnim: "npc-idle",                 // 常態待機動畫 (打招呼後循環播放)
    welcomeText: "歡迎光臨喵，今天的推薦餐點是招牌土豆餐，來一份喵？",
    optionsText: {
      1: "你是做什麼的？",
      2: "這裡是什麼地方？",
      3: "(摸摸頭)",
    },
    responses: {
      1: {
        anim: "npc-mogdance",
        text: "我是這間店的副店長喵，大家都叫我ㄇㄇㄇ！喜歡跳舞、畫可愛的圖~",
      },
      2: {
        anim: "npc-laliho",
        text: "這裡是土豆與蜜酒，一間中世紀風格的冒險者酒館喵。我們這裡賣很多好吃ㄉ，全都是老闆做的喵！超級厲害的對吧~？",
      },
      3: {
        anim: "npc-doze",
        text: "好想下班喵...想窩在火爐旁睡覺喵...",
      },
    },
  },
};

// 進入頁面時，以 50% : 50% 機率隨機選定一位 NPC
const npcKeys = Object.keys(npcProfiles);
const currentNpcKey = npcKeys[Math.floor(Math.random() * npcKeys.length)];
const currentNpc = npcProfiles[currentNpcKey];

// 2. 切換 NPC 動作動畫核心函式
// animName: 動畫名稱
// loop: 是否循環播放 (預設 true)
// onEndedCallback: 播放結束後的回呼函式 (非循環時觸發)
function setNpcAnimation(animName, loop = true, onEndedCallback = null) {
  if (!barNpcVideo) return;

  barNpcVideo.loop = loop;
  barNpcVideo.onended = onEndedCallback;

  const sources = barNpcVideo.querySelectorAll("source");
  if (sources.length >= 3) {
    sources[0].src = `${currentNpc.videoFolder}/${animName}.webm`;
    sources[1].src = `${currentNpc.videoFolder}/${animName}.mov`;
    sources[2].src = `${currentNpc.videoFolder}/${animName}.mp4`;
    barNpcVideo.load();
    const playPromise = barNpcVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // 若該動畫尚未放入，且有結束回呼 (例如 welcome 播完)，自動銜接至待機
        if (onEndedCallback) {
          onEndedCallback();
        }
      });
    }
  }
}

// 播放常態循環待機動畫
function playIdleAnimation() {
  setNpcAnimation(currentNpc.idleAnim || "npc-idle", true, null);
}

// 3. 頁面載入後自動套用選中的 NPC 資源 (底圖、台詞、選項文字、影片)
window.addEventListener("DOMContentLoaded", () => {
  // 1. 更換左側對話框底圖與開場白
  if (npcDialogueBgImg) {
    npcDialogueBgImg.src = currentNpc.dialogueBg;
  }
  if (npcDialogueText) {
    npcDialogueText.textContent = currentNpc.welcomeText;
  }

  // 2. 載入該 NPC 專屬的 3 行選項文字
  if (optLine1) optLine1.textContent = currentNpc.optionsText["1"];
  if (optLine2) optLine2.textContent = currentNpc.optionsText["2"];
  if (optLine3) optLine3.textContent = currentNpc.optionsText["3"];

  // 3. 進入畫面時先播放開頭「打招呼動畫 (npc-welcome)」，播完 1 次後無縫切換至「待機循環動畫 (npc-idle)」
  setNpcAnimation(currentNpc.welcomeAnim || "npc-welcome", false, () => {
    playIdleAnimation();
  });

  // 4. 對話框與選項平滑浮現
  setTimeout(() => {
    if (npcDialogueBox) npcDialogueBox.classList.add("show");
  }, 400);

  setTimeout(() => {
    if (optionsDialogueBox) optionsDialogueBox.classList.add("show");
  }, 900);
});

// 4. 點選選項後，顯示該 NPC 對應的回應台詞與動作
document.querySelectorAll(".dialogue-option-line").forEach((btn) => {
  btn.addEventListener("click", () => {
    const optionId = btn.getAttribute("data-option");
    if (!npcDialogueBox || !npcDialogueText) return;

    npcDialogueText.style.opacity = "0";

    setTimeout(() => {
      const response = currentNpc.responses[optionId];
      if (response) {
        // 選項動畫若是單次動作，播完也可選擇循環或停在待機，這裡預設動作循環或單次
        setNpcAnimation(response.anim, true);
        npcDialogueText.textContent = response.text;
      } else {
        playIdleAnimation();
        npcDialogueText.textContent = currentNpc.welcomeText;
      }
      npcDialogueText.style.opacity = "1";
    }, 200);
  });
});
