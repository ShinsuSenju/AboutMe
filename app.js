const bootScreen = document.getElementById("boot");
const loginScreen = document.getElementById("login-screen");
const logo = document.querySelector(".win-logo img");
const bootText = document.querySelector(".boot-text");

window.onload = () => {
  setTimeout(() => {
    logo.style.opacity = "1";
    bootText.style.opacity = "1";
  }, 500);

  setTimeout(() => {
    bootScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  }, 4000);
};

const loginBtn = document.querySelector(".blue-arrow-btn");
const passwordInput = document.querySelector(".login-input");
const hintDisplay = document.getElementById("password-hint");
const wikiCard = document.getElementById("wiki-card");
const desktop = document.getElementById("desktop");
const welcomeScreen = document.getElementById("welcome-screen");

// Old: const SECRET_PASSWORD = "linus";

const VALID_PASSWORDS = ["linus", "linus torvalds", "torvalds"];

let failedAttempts = 0;
let isTauntActive = false;

function attemptLogin() {
  const userGuess = passwordInput.value.toLowerCase().trim();
  if (VALID_PASSWORDS.includes(userGuess)) {
    loginScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
    setTimeout(() => {
      welcomeScreen.classList.add("hidden");
      const audio = new Audio("./audio/startup.mp3");
      audio.play().catch((e) => console.log("Audio Blocked"));
      setTimeout(() => {
        desktop.classList.remove("hidden");
      }, 500);
    }, 3000);
    return;
  }

  if (isTauntActive) {
    passwordInput.value = "linus";
    hintDisplay.innerText = "There you go. Now hit the arrow to boot up.";
    hintDisplay.style.color = "#ffffff";
    wikiCard.classList.remove("hidden");
    setTimeout(() => wikiCard.classList.add("show"), 10);
    isTauntActive = false;
    return;
  }

  failedAttempts++;
  passwordInput.value = "";
  passwordInput.focus();

  passwordInput.classList.add("input-error");
  setTimeout(() => {
    passwordInput.classList.remove("input-error");
  }, 400);

  hintDisplay.classList.remove("hidden");
  setTimeout(() => hintDisplay.classList.add("show"), 10);

  if (failedAttempts === 1) {
    hintDisplay.innerText =
      "Hint: The creator of a much better, open-source OS (kernel actually!)...";
    hintDisplay.style.color = "white";
  } else if (failedAttempts >= 2) {
    hintDisplay.innerText =
      "Typical Windows user... Just switch to Linux already. Press Enter to admit defeat and get the password.";
    hintDisplay.style.color = "#ffffff";
    isTauntActive = true;
  }
}

loginBtn.addEventListener("click", attemptLogin);
passwordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    attemptLogin();
  }
});

// DESKTOP LOGIC

const desktopIconsContainer = document.querySelector(".desktop-icons");
const desktopIconsList = document.querySelectorAll(".icon");
const gridWidth = 76;
const gridHeight = 85;
const edgeOffset = 10;

//Clock Function
function updateClock() {
  const timeDisplay = document.getElementById("time-display");
  const dateDisplay = document.getElementById("date-display");
  if (!timeDisplay || !dateDisplay) return;
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();
  timeDisplay.innerText = `${hours}:${minutes} ${ampm}`;
  dateDisplay.innerText = `${day}/${month}/${year}`;
}
updateClock();
setInterval(updateClock, 10000);

// START MENU
const startBtn = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");

startBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  startMenu.classList.toggle("show");
});

document.addEventListener("click", (event) => {
  if (
    startMenu.classList.contains("show") &&
    !startMenu.contains(event.target)
  ) {
    startMenu.classList.remove("show");
  }
});
startMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

// system tray
// const trayBattery = document.getElementById("tray-battery");

// function updateBattery(battery) {
//   trayBattery.style.setProperty("--percent", battery.level * 100 + "%");
//   if (battery.charging === true) {
//     trayBattery.classList.add("charging");
//   } else {
//     trayBattery.classList.remove("charging");
//   }
//   trayBattery.title = `Battery: ${Math.round(battery.level * 100)}% ${battery.charging ? "(Plugged in)" : "(Remaining)"}`;
// }

// if ("getBattery" in navigator) {
//   navigator.getBattery().then((battery) => {
//     updateBattery(battery);
//     battery.addEventListener("levelchange", () => updateBattery(battery));
//     battery.addEventListener("chargingchange", () => updateBattery(battery));
//   });
// }

//windows
let highestZIndex = 100;

function focusWindow(windowElement) {
  highestZIndex++;
  windowElement.style.zIndex = highestZIndex;
  document
    .querySelectorAll(".window")
    .forEach((win) => win.classList.remove("active"));
  document
    .querySelectorAll(".aero-taskbar-icon")
    .forEach((icon) => icon.classList.remove("app-active"));

  windowElement.classList.add("active");
  const baseName = windowElement.id.replace("-window", "");
  const activeIcon = document.getElementById(`taskbar-${baseName}`);
  if (activeIcon) {
    activeIcon.classList.add("app-active");
  }
}

function openWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.classList.remove("window-closed", "minimized");
    win.style.display = "block";
    focusWindow(win);
  }
  const baseName = windowId.replace("-window", "");
  const taskbarBtn = document.getElementById(`taskbar-${baseName}`);
  if (taskbarBtn) {
    taskbarBtn.style.display = "flex";
  }
}

//Context Menu
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
  }
});

const desktopMenu = document.getElementById("context-menu");
const iconMenu = document.getElementById("icon-context-menu");
let activeIcon = null;

function closeAllMenus() {
  desktopMenu.style.display = "none";
  iconMenu.style.display = "none";
}

function openContextMenu(menuElement, e) {
  e.preventDefault();
  closeAllMenus();
  menuElement.style.display = "block";

  let mouseX = e.clientX;
  let mouseY = e.clientY;
  const menuWidth = menuElement.offsetWidth;
  const menuHeight = menuElement.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (mouseX + menuWidth > windowWidth) mouseX = windowWidth - menuWidth;
  if (mouseY + menuHeight > windowHeight - 40)
    mouseY = windowHeight - 40 - menuHeight;

  menuElement.style.left = `${mouseX}px`;
  menuElement.style.top = `${mouseY}px`;
}

desktop.addEventListener("contextmenu", (e) => {
  if (e.target === desktop || e.target.classList.contains("desktop-icons")) {
    activeIcon = null;
    openContextMenu(desktopMenu, e);
  }
});

//icon context menu
desktopIconsList.forEach((icon) => {
  icon.addEventListener("contextmenu", (e) => {
    e.stopPropagation();
    activeIcon = icon;
    openContextMenu(iconMenu, e);
  });
});

document.addEventListener("click", (e) => {
  if (e.button === 0) {
    const clickedDesktopMenu = e.target.closest("#context-menu");
    const clickedIconMenu = e.target.closest("#icon-context-menu");
    if (!clickedDesktopMenu && !clickedIconMenu) {
      closeAllMenus();
    }
  }
});

const menuOpen = document.getElementById("menu-open");
const menuOpenWith = document.getElementById("menu-open-with");

if (menuOpen) {
  menuOpen.addEventListener("click", (e) => {
    e.preventDefault();
    if (activeIcon) {
      const appId = activeIcon.id.replace("icon-", "");
      openApp(appId);
    }
    closeAllMenus();
  });
}

if (menuOpenWith) {
  menuOpenWith.addEventListener("click", (e) => {
    e.preventDefault();
    if (activeIcon) {
      const fileName = activeIcon.querySelector("span").innerText;
      alert(`Hey! I guess i forgot to build this :p`);
    }
    closeAllMenus();
  });
}

const menuDelete = document.getElementById("menu-delete");
if (menuDelete) {
  menuDelete.addEventListener("click", (e) => {
    e.preventDefault();
    if (activeIcon) {
      if (activeIcon.id === "icon-recycle") {
        alert(
          "You cannot delete the Recycle Bin. That would break the universe.",
        );
      } else {
        activeIcon.style.display = "none";
      }
    }
    closeAllMenus();
  });
}

document.getElementById("example15").addEventListener("change", () => {
  desktopIconsContainer.className = "desktop-icons large";
  closeAllMenus();
});
document.getElementById("example16").addEventListener("change", () => {
  desktopIconsContainer.className = "desktop-icons";
  closeAllMenus();
});
document.getElementById("example17").addEventListener("change", () => {
  desktopIconsContainer.className = "desktop-icons small";
  closeAllMenus();
});

document.getElementById("menu-refresh").addEventListener("click", (e) => {
  e.preventDefault();
  const icons = document.querySelectorAll(".desktop-icons .icon");
  icons.forEach((icon) => (icon.style.opacity = "0"));
  setTimeout(() => {
    icons.forEach((icon) => (icon.style.opacity = "1"));
  }, 150);
  closeAllMenus();
});

// Sorting
function sortDesktopIcons(criterion) {
  const iconsArray = Array.from(
    document.querySelectorAll(".desktop-icons .icon"),
  );
  iconsArray.sort((a, b) => {
    if (criterion === "name") {
      const textA = a.querySelector("span").innerText.toLowerCase();
      const textB = b.querySelector("span").innerText.toLowerCase();
      return textA.localeCompare(textB);
    } else if (criterion === "type") {
      return Math.random() - 0.5;
    }
  });

  iconsArray.forEach((icon, index) => {
    icon.style.left = `${edgeOffset}px`;
    icon.style.top = `${edgeOffset + index * gridHeight}px`;
    desktopIconsContainer.appendChild(icon);
  });
}

document.getElementById("sort-name").addEventListener("click", (e) => {
  e.preventDefault();
  sortDesktopIcons("name");
  closeAllMenus();
});

document.getElementById("sort-type").addEventListener("click", (e) => {
  e.preventDefault();
  sortDesktopIcons("type");
  closeAllMenus();
});

const wallpapers = [
  "url('./images/wallpaper.jpg')",
  "url('./images/wallpaper1.jpg')",
  "url('./images/wallpaper2.jpg')",
  "url('./images/wallpaper3.jpg')",
  "url('./images/wallpaper4.jpg')",
];
let currentWallpaper = 0;

document.getElementById("menu-personalize").addEventListener("click", (e) => {
  e.preventDefault();
  currentWallpaper++;
  if (currentWallpaper >= wallpapers.length) currentWallpaper = 0;
  desktop.style.backgroundImage = wallpapers[currentWallpaper];
  desktop.style.backgroundSize = "cover";
  closeAllMenus();
});

// Easter Egg 1: Callback to the login screen joke
document.getElementById("menu-linux").addEventListener("click", (e) => {
  e.preventDefault();
  alert(
    "Error 404: Linux ISO not found. I guess we are stuck with Windows 7 for now.",
  );
  closeAllMenus();
});

// Easter Egg 2: Hack Google
const hackBtn = document.getElementById("menu-hack");
const hackText = hackBtn.querySelector("a");
let hackStep = 0;

hackBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (hackStep === 0) {
    hackText.innerText = "Wait... are you sure?";
    hackText.style.color = "#cc0000";
    hackBtn.removeAttribute("aria-disabled");
    hackStep = 1;
  } else {
    alert(
      "BREACH DETECTED. GOOGLE CYBERSECURITY INBOUND... just kidding. Learn Hacking First!",
    );
    hackText.innerText = "Hack Google";
    hackText.style.color = "";
    hackBtn.setAttribute("aria-disabled", "true");
    hackStep = 0;
    closeAllMenus();
  }
});

// Portfolio Link: View Source
document.getElementById("menu-source").addEventListener("click", (e) => {
  e.preventDefault();
  window.open("https://github.com/ShinsuSenju/PersonalPortfolio", "_blank");
  closeAllMenus();
});

// Portfolio Link: My Projects
// document.getElementById("menu-projects").addEventListener("click", (e) => {
//   e.preventDefault();
//   alert("Opening Projects Window... (Coming Soon!)");
//   closeContextMenu();
// });

const menuItemsWithSubmenus = document.querySelectorAll(
  '[aria-haspopup="true"]',
);

//fix context menu near edge
menuItemsWithSubmenus.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const submenu = item.querySelector('ul[role="menu"]');
    if (!submenu) return;

    submenu.style.left = "100%";
    submenu.style.right = "auto";

    const rect = submenu.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    if (rect.right > windowWidth) {
      submenu.style.left = "auto";
      submenu.style.right = "100%";
    }
  });
});

//my projects from context menu
const projectsBtn = document.getElementById("menu-projects");
if (projectsBtn) {
  projectsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openWindow("projects-window");
    closeAllMenus();
  });
}

//close btn title bar
window.closeWindow = function (windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.classList.add("window-closed");
    win.style.display = "none";

    const baseName = windowId.replace("-window", "");
    const taskbarIcon = document.getElementById(`taskbar-${baseName}`);
    if (taskbarIcon) {
      taskbarIcon.style.display = "none";
      taskbarIcon.classList.remove("app-active");
    }
  }
};

document.querySelectorAll(".titlebar-close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parentWindow = e.target.closest(".window");
    if (parentWindow) {
      closeWindow(parentWindow.id);
    }
  });
});

// focus window
document.querySelectorAll(".window").forEach((win) => {
  win.addEventListener("mousedown", () => focusWindow(win));
});

//defocus
desktop.addEventListener("mousedown", (e) => {
  if (e.target.id === "desktop") {
    document
      .querySelectorAll(".window")
      .forEach((win) => win.classList.remove("active"));
  }
});

//maximize
document.querySelectorAll(".titlebar-max").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parentWindow = e.target.closest(".window");
    if (parentWindow) parentWindow.classList.toggle("maximized");
  });
});

document.querySelectorAll(".title-bar").forEach((bar) => {
  bar.addEventListener("dblclick", (e) => {
    if (e.target.closest(".title-bar-controls")) return;
    const parentWindow = e.target.closest(".window");
    if (parentWindow) parentWindow.classList.toggle("maximized");
  });
});

//minimize
document.querySelectorAll(".titlebar-min").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parentWindow = e.target.closest(".window");
    if (parentWindow) {
      parentWindow.classList.add("minimized");
      parentWindow.classList.remove("active");
    }
  });
});

document.querySelectorAll(".aero-taskbar-icon").forEach((taskbarBtn) => {
  taskbarBtn.addEventListener("click", () => {
    const baseName = taskbarBtn.id.replace("taskbar-", "");
    const targetWindow = document.getElementById(`${baseName}-window`);

    if (!targetWindow) return;

    if (targetWindow.classList.contains("window-closed")) {
      targetWindow.classList.remove("window-closed", "minimized");
      focusWindow(targetWindow);
    } else if (targetWindow.classList.contains("minimized")) {
      targetWindow.classList.remove("minimized");
      focusWindow(targetWindow);
    } else if (!targetWindow.classList.contains("active")) {
      focusWindow(targetWindow);
    } else {
      targetWindow.classList.add("minimized");
      targetWindow.classList.remove("active");
    }
  });

  taskbarBtn.addEventListener("mouseenter", () => {
    const baseName = taskbarBtn.id.replace("taskbar-", "");
    const targetWindow = document.getElementById(`${baseName}-window`);
    const peekThumb = taskbarBtn.querySelector(".peek-thumb");

    if (!targetWindow || !peekThumb) return;

    peekThumb.innerHTML = "";
    const freshClone = targetWindow.cloneNode(true);
    freshClone.removeAttribute("id");
    freshClone.classList.add("window-clone");
    freshClone.classList.remove(
      "minimized",
      "window-closed",
      "maximized",
      "dragging",
    );

    const fixedWidth = 600;
    const fixedHeight = 400;
    const thumbWidth = peekThumb.clientWidth;
    const exactScale = thumbWidth / fixedWidth;

    freshClone.style.cssText = `
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      width: ${fixedWidth}px !important;
      height: ${fixedHeight}px !important;
      max-width: none !important;
      max-height: none !important;
      margin: 0 !important;
      transform-origin: center !important;
      transform: translate(-50%, -50%) scale(${exactScale}) !important;
      pointer-events: none !important;
      display: flex !important;
      flex-direction: column !important;
    `;
    peekThumb.appendChild(freshClone);
  });
});

//dragging and grab logic
document.querySelectorAll(".window").forEach((win) => {
  const titleBar = win.querySelector(".title-bar");
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  //grab
  titleBar.addEventListener("mousedown", (e) => {
    const rect = win.getBoundingClientRect();
    isDragging = true;
    win.classList.add("dragging");
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    focusWindow(win);
  });

  //drag
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    if (win.classList.contains("maximized")) {
      win.classList.remove("maximized");
      const rect = win.getBoundingClientRect();
      offsetX = rect.width / 2;
      offsetY = 15;
    }
    win.style.left = `${e.clientX - offsetX}px`;
    win.style.top = `${e.clientY - offsetY}px`;
  });

  //release
  document.addEventListener("mouseup", () => {
    isDragging = false;
    win.classList.remove("dragging");
  });
});

//drag icons
//initial position
desktopIconsList.forEach((icon, index) => {
  icon.style.left = `${edgeOffset}px`;
  icon.style.top = `${edgeOffset + index * gridHeight}px`;
});

desktopIconsList.forEach((icon) => {
  let isDraggingIcon = false;
  let startX, startY, initialLeft, initialTop;

  icon.addEventListener("dblclick", (e) => {
    e.preventDefault();
    const baseName = icon.id.replace("icon-", "");
    openWindow(`${baseName}-window`);
  });

  icon.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDraggingIcon = true;
    icon.classList.add("dragging");
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = parseInt(icon.style.left, 10) || edgeOffset;
    initialTop = parseInt(icon.style.top, 10) || edgeOffset;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDraggingIcon) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    icon.style.left = `${initialLeft + dx}px`;
    icon.style.top = `${initialTop + dy}px`;
  });

  document.addEventListener("mouseup", (e) => {
    if (!isDraggingIcon) return;
    isDraggingIcon = false;
    icon.classList.remove("dragging");

    const currentLeft = parseInt(icon.style.left, 10);
    const currentTop = parseInt(icon.style.top, 10);

    //grid math
    let snappedLeft =
      Math.round((currentLeft - edgeOffset) / gridWidth) * gridWidth +
      edgeOffset;
    let snappedTop =
      Math.round((currentTop - edgeOffset) / gridHeight) * gridHeight +
      edgeOffset;

    const maxLeft = window.innerWidth - gridWidth;
    const maxTop = window.innerHeight - 40 - gridHeight;

    snappedLeft = Math.max(edgeOffset, Math.min(snappedLeft, maxLeft));
    snappedTop = Math.max(edgeOffset, Math.min(snappedTop, maxTop));

    let isOccupied = false;
    desktopIconsList.forEach((otherIcon) => {
      if (otherIcon !== icon) {
        const otherLeft = parseInt(otherIcon.style.left, 10);
        const otherTop = parseInt(otherIcon.style.top, 10);
        if (otherLeft === snappedLeft && otherTop === snappedTop) {
          isOccupied = true;
        }
      }
    });

    if (isOccupied) {
      snappedLeft = initialLeft;
      snappedTop = initialTop;
    }

    icon.style.left = `${snappedLeft}px`;
    icon.style.top = `${snappedTop}px`;
  });
});

//recyle bin

function emptyRecycleBin() {
  const contents = document.getElementById("recycle-contents");
  const emptyMsg = document.getElementById("recycle-empty-msg");
  const footerText = document.getElementById("recycle-footer-text");

  if (contents.style.display !== "none") {
    const audio = new Audio("./audio/ding.mp3");
    audio
      .play()
      .catch((e) => console.log("Audio blocked by browser, skipping."));
    contents.style.display = "none";
    emptyMsg.style.display = "block";
    footerText.innerHTML = "0 items";

    const desktopRecycleIcon = document.querySelector("#icon-recycle img");
    if (desktopRecycleIcon)
      desktopRecycleIcon.src = "./images/recycle-icon-empty.ico";
  } else {
    alert(
      "Hey what are you even deleting? can\'t you see it\'s already empty?",
    );
  }
}

// open any app

function openApp(appId) {
  openWindow(`${appId}-window`);
}

const selectableItems = document.querySelectorAll(".win7-device, .win7-file");
const containers = document.querySelectorAll(".win7-container");

selectableItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    selectableItems.forEach((i) => i.classList.remove("selected"));

    item.classList.add("selected");

    e.stopPropagation();
  });
});

containers.forEach((container) => {
  container.addEventListener("click", () => {
    selectableItems.forEach((i) => i.classList.remove("selected"));
  });
});

// recycle bin to my computer
function navigateExplorer(e, targetAppId) {
  const currentWindow = e.target.closest(".window");
  const targetWindow = document.getElementById(`${targetAppId}-window`);

  if (currentWindow && targetWindow && currentWindow !== targetWindow) {
    targetWindow.style.top = currentWindow.style.top;
    targetWindow.style.left = currentWindow.style.left;
    targetWindow.style.width = currentWindow.style.width;
    targetWindow.style.height = currentWindow.style.height;

    if (currentWindow.classList.contains("maximized")) {
      targetWindow.classList.add("maximized");
    } else {
      targetWindow.classList.remove("maximized");
    }

    currentWindow.style.display = "none";
    currentWindow.classList.add("window-closed");
    const currentAppId = currentWindow.id.replace("-window", "");
    const currentTaskbar = document.getElementById(`taskbar-${currentAppId}`);
    if (currentTaskbar) currentTaskbar.style.display = "none";

    openApp(targetAppId);
  }
}

//  welcome window
let currentWizPage = 1;
const totalWizPages = 6;

const btnBack = document.getElementById("wiz-back");
const btnNext = document.getElementById("wiz-next");
const btnFinish = document.getElementById("wiz-finish");

function updateWizard() {
  for (let i = 1; i <= totalWizPages; i++) {
    const page = document.getElementById(`welcome-page-${i}`);
    if (page) {
      page.hidden = true;
      page.classList.remove("active-page");
    }
  }

  const activePage = document.getElementById(`welcome-page-${currentWizPage}`);
  if (activePage) {
    activePage.hidden = false;
    activePage.classList.add("active-page");
  }

  if (btnBack) btnBack.disabled = currentWizPage === 1;

  if (currentWizPage === totalWizPages) {
    if (btnNext) btnNext.style.display = "none";
    if (btnFinish) btnFinish.style.display = "inline-block";
  } else {
    if (btnNext) btnNext.style.display = "inline-block";
    if (btnFinish) btnFinish.style.display = "none";
  }
}
updateWizard();

if (btnNext) {
  btnNext.addEventListener("click", () => {
    if (currentWizPage < totalWizPages) {
      currentWizPage++;
      updateWizard();
    }
  });
}

if (btnBack) {
  btnBack.addEventListener("click", () => {
    if (currentWizPage > 1) {
      currentWizPage--;
      updateWizard();
    }
  });
}

if (btnFinish) {
  btnFinish.addEventListener("click", () => {
    closeWindow("welcome-window");
  });
}

const tabButtons = document.querySelectorAll('.wizard-tabs button[role="tab"]');

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const container = button.closest(".window-body, .wizard-page");

    container.querySelectorAll('button[role="tab"]').forEach((btn) => {
      btn.setAttribute("aria-selected", "false");
    });

    container.querySelectorAll('article[role="tabpanel"]').forEach((panel) => {
      panel.hidden = true;
    });
    button.setAttribute("aria-selected", "true");
    const targetPanelId = button.getAttribute("aria-controls");
    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) {
      targetPanel.hidden = false;
    }
  });
});
