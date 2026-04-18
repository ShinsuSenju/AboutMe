const bootScreen = document.getElementById("boot");
const loginScreen = document.getElementById("login-screen");
const logo = document.querySelector(".win-logo img");
const bootText = document.querySelector(".boot-text");

const loginBtn = document.querySelector(".blue-arrow-btn");
const passwordInput = document.querySelector(".login-input");
const hintDisplay = document.getElementById("password-hint");
const wikiCard = document.getElementById("wiki-card");
const desktop = document.getElementById("desktop");
const welcomeScreen = document.getElementById("welcome-screen");

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

document.getElementById("guest-login").addEventListener("click", () => {
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
  const wpTimeDisplay = document.getElementById("wp-time-display");

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

  if (wpTimeDisplay) wpTimeDisplay.innerText = `${hours}:${minutes}`;
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

const links = document.querySelectorAll(".link-item.external");

links.forEach((link) => {
  link.addEventListener("click", () => {
    const url = link.getAttribute("data-url");
    window.open(url, "_blank");
  });
});

// Open apps from Start Menu
document.querySelectorAll(".program-item").forEach((item) => {
  item.addEventListener("click", () => {
    const appId = item.getAttribute("data-app");
    if (appId) {
      openWindow(`${appId}-window`);
    }
    const startMenu = document.getElementById("start-menu");
    if (startMenu) startMenu.classList.remove("show");
  });
});
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
    if (getComputedStyle(taskbarBtn).display === "none") {
      const appGroup = document.getElementById("app-group");
      if (appGroup) appGroup.appendChild(taskbarBtn);
    }
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
      showError("Hey! I guess i forgot to build this :p", "Windows", "warning");
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
        showError(
          "You cannot delete the Recycle Bin. That would break the universe.",
          "Error",
          "error",
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
  showError(
    "Error 404: Linux ISO not found. I guess we are stuck with Windows 7 for now.",
    "System Error",
    "error",
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
    showError(
      "BREACH DETECTED. GOOGLE CYBERSECURITY INBOUND... just kidding. Learn Hacking First!",
      "Windows Defender Firewall",
      "warning",
    );
    hackText.innerText = "Hack Google";
    hackText.style.color = "";
    hackBtn.setAttribute("aria-disabled", "true");
    hackStep = 0;
    closeAllMenus();
  }
});

// Link: View Source
document.getElementById("menu-source").addEventListener("click", (e) => {
  e.preventDefault();
  window.open("https://github.com/ShinsuSenju/AboutMe", "_blank");
  closeAllMenus();
});

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

const projectsStartBtn = document.querySelector(
  '.link-item[data-app="projects"]',
);
if (projectsStartBtn) {
  projectsStartBtn.addEventListener("click", (e) => {
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
    showError(
      "Hey what are you even deleting? can't you see it's already empty?",
      "Recycle Bin",
      "info",
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

//computerWindow

let fileSystem = {};
let textFilesContent = {};

async function loadPortfolioData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    fileSystem = data.fileSystem;
    textFilesContent = data.textFilesContent;

    console.log("Portfolio data loaded successfully!");
  } catch (error) {
    console.error("Could not load data.json:", error);
  }
}

loadPortfolioData();

const computerWindow = document.querySelector(
  "#computer-window .win7-container",
);
const addressBar = document.querySelector("#computer-window .win7-addr");
const backBtn = document.querySelector("#computer-window .win7-btn.back");

let originalcomputerWindowHTML = "";
if (computerWindow) {
  originalcomputerWindowHTML = computerWindow.innerHTML;
}

function openDrive(driveLetter) {
  addressBar.innerHTML = `Computer <span style="color:#666; margin:0 5px;">▸</span> Local Disk (${driveLetter})`;

  if (fileSystem[driveLetter] && fileSystem[driveLetter].length > 0) {
    let filesHTML = `<div class="win7-file-grid" style="margin-top: 15px;">`;
    fileSystem[driveLetter].forEach((file) => {
      filesHTML += `
        <div class="win7-file" data-type="${file.type}" data-name="${file.name}">
          <img src="${file.icon}" alt="icon" onerror="this.src='./images/search.svg'">
          <span>${file.name}</span>
        </div>
      `;
    });
    filesHTML += `</div>`;
    computerWindow.innerHTML = filesHTML;
  } else {
    computerWindow.innerHTML = `
      <div style="padding: 20px; color: #777; font-size: 12px; font-style: italic;">
        This folder is empty. (Wish I had more in here...)
      </div>
    `;
  }

  bindFile();
}
function bindDrive() {
  document
    .querySelectorAll("#computer-window .win7-device")
    .forEach((drive) => {
      drive.addEventListener("dblclick", (e) => {
        const driveText = drive.querySelector(".name").innerText;
        if (driveText.includes("C:")) openDrive("C:");
        if (driveText.includes("D:")) openDrive("D:");
        if (driveText.includes("F:")) openDrive("F:");
        if (driveText.includes("G:")) openDrive("G:");
      });
    });
}
bindDrive();
function bindFile() {
  document.querySelectorAll("#computer-window .win7-file").forEach((file) => {
    file.addEventListener("dblclick", () => {
      const type = file.dataset.type;
      const name = file.dataset.name;

      if (type === "project") {
        const projectData = fileSystem["D:"].find((f) => f.name === name);
        if (projectData) {
          triggerProjectCmd(
            name,
            projectData.isLive,
            projectData.github,
            projectData.url,
            projectData.isOpen,
            projectData.exists,
          );
        }
      } else if (type === "about") {
        openNotepad(name);
      } else if (type === "music") {
        showError(
          `Playing ${name}... (I still need to build the Media Player!)`,
          "Windows Media Player",
          "info",
        );
      } else {
        showError(`Unknown file type: ${name}`, "Windows Explorer", "error");
      }
    });
  });
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (addressBar.innerText !== "Computer") {
      computerWindow.innerHTML = originalcomputerWindowHTML;
      addressBar.innerText = "Computer";
      bindDrive();
    }
  });
}

function bindSidebarLinks() {
  document.querySelectorAll(".explorer-sidebar li").forEach((link) => {
    link.addEventListener("click", () => {
      document
        .querySelectorAll(".explorer-sidebar li")
        .forEach((l) => (l.style.backgroundColor = "transparent"));
      link.style.backgroundColor = "#e5f3fb";

      const text = link.innerText.trim();

      if (text === "My Computer" || text === "Computer") {
        computerWindow.innerHTML = originalcomputerWindowHTML;
        addressBar.innerText = "Computer";
        bindDrive();
      } else if (text === "Documents" || text.includes("C:")) {
        openDrive("C:");
      } else if (text.includes("D:")) {
        openDrive("D:");
      } else if (text.includes("Wallet") || text.includes("G:")) {
        openDrive("G:");
      } else if (text === "Videos") {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      } else if (text === "Music") {
        showError(
          "Playing OST... (Audio player coming soon!)",
          "Windows Media Player",
          "info",
        );
      }
    });
  });
}
bindSidebarLinks();

//cmd

const cmdHistory = document.getElementById("cmd-history");
const cmdInput = document.getElementById("cmd-input");
const cmdBody = document.querySelector(".cmd-body");
const cmdInputLine = document.getElementById("cmd-input-line");
let isAwaitingInput = false;

if (cmdBody) {
  cmdBody.addEventListener("click", () => {
    if (cmdInput && !cmdInput.disabled) cmdInput.focus();
  });
}

function printToCmd(htmlText) {
  if (!cmdHistory) return;
  cmdHistory.innerHTML += `<div>${htmlText}</div>`;
  if (cmdBody) cmdBody.scrollTop = cmdBody.scrollHeight;
}
if (cmdInput) {
  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isAwaitingInput) {
      const cmd = cmdInput.value.trim();

      printToCmd(
        `<span style="color: #ccc;">C:\\Users\\Anurag&gt;</span> ${cmd}`,
      );
      cmdInput.value = "";
      if (cmd) processCommand(cmd);
    }
  });
}

let currentAudio = null;
function processCommand(cmd) {
  const args = cmd.toLowerCase().split(" ");
  const mainCmd = args[0];

  switch (mainCmd) {
    case "help":
      printToCmd(
        "Available commands:<br>" +
          "&nbsp;&nbsp;help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show this menu<br>" +
          "&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;- Clear the terminal<br>" +
          "&nbsp;&nbsp;resume&nbsp;&nbsp;&nbsp;- Open my resume<br>" +
          "&nbsp;&nbsp;linkedin&nbsp;- Visit my LinkedIn profile<br>" +
          "&nbsp;&nbsp;leetcode&nbsp;- Visit my LeetCode profile<br>" +
          "&nbsp;&nbsp;books&nbsp;&nbsp;&nbsp;&nbsp;- List books I'm currently reading<br>" +
          "&nbsp;&nbsp;update&nbsp;&nbsp;&nbsp;- Install critical system updates<br>" + // <-- ADD THIS
          "&nbsp;&nbsp;music&nbsp;&nbsp;&nbsp;&nbsp;- Play/Stop coding music<br>" +
          "&nbsp;&nbsp;pacman&nbsp;&nbsp;&nbsp;- Play ASCII Pacman<br>" +
          "&nbsp;&nbsp;kamui&nbsp;&nbsp;&nbsp;&nbsp;- [RESTRICTED ACCESS]",
      );
      break;
    case "update":
      printToCmd("Initializing Windows Update Service...");
      printToCmd("Downloading critical patches...");
      setTimeout(() => {
        startWindowsUpdate();
      }, 1000);
      break;
    case "clear":
      cmdHistory.innerHTML = "";
      break;
    case "resume":
      window.open("assets/resume.pdf", "_blank");
      printToCmd("Opening Resume...");
      break;
    case "linkedin":
      window.open("https://linkedin.com/in/senpaishane", "_blank");
      printToCmd("Opening LinkedIn...");
      break;
    case "leetcode":
      window.open("https://leetcode.com/senpaishane", "_blank");
      printToCmd("Opening LeetCode...");
      break;
    case "books":
      printToCmd(
        "Reading List:<br>" +
          "1. Siege And Storm - Leigh Bardugo<br>" +
          "2. Ruin And Rising - Leigh Bardugo<br>" +
          "3. King Of Scars - Leigh Bardugo",
      );
      break;
    case "music":
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        printToCmd("Music stopped.");
      } else {
        printToCmd(
          "Loading OST Track... (Add an mp3 to /audio/ost.mp3 to make this work!)",
        );
        // currentAudio = new Audio("./audio/ost.mp3");
        // currentAudio.play();
      }
      break;
    case "pacman":
      printToCmd(
        "<br>" +
          "&nbsp;&nbsp;&nbsp;<span style='color:yellow'>ᗧ</span>&nbsp;&nbsp;&nbsp;&nbsp;o&nbsp;&nbsp;&nbsp;o&nbsp;&nbsp;&nbsp;o&nbsp;&nbsp;&nbsp;o&nbsp;&nbsp;<span style='color:red'>👻</span><br>" +
          "<br>Use arrow keys to play! (Just kidding, still W.I.P)",
      );
      break;
    case "kamui":
      printToCmd(
        "<span style='color: #ff3333;'>Mangekyou Sharingan Activated...</span>",
      );
      isAwaitingInput = true;
      cmdInput.disabled = true;
      setTimeout(() => {
        const win = document.getElementById("cmd-window");
        win.classList.add("kamui-effect");

        setTimeout(() => {
          closeWindow("cmd-window");
          win.classList.remove("kamui-effect");
          cmdHistory.innerHTML =
            "Microsoft Windows [Version 6.1.7601]<br>Copyright (c) 2009 Microsoft Corporation.  All rights reserved.<br><br>";
          isAwaitingInput = false;
          cmdInput.disabled = false;
          if (cmdInputLine) cmdInputLine.style.display = "flex";
        }, 1300);
      }, 800);
      break;
    default:
      printToCmd(
        `'${mainCmd}' is not recognized as an internal or external command, operable program or batch file.</br>Type 'help' to see a list of available commands.`,
      );
  }
  if (cmdBody) cmdBody.scrollTop = cmdBody.scrollHeight;
}

let activeCmdListener = null;

function triggerProjectCmd(
  projectName,
  isLive,
  githubLink,
  liveUrl,
  isOpen,
  exists,
) {
  openWindow("cmd-window");
  if (!cmdHistory) return;

  if (cmdInputLine) cmdInputLine.style.display = "none";
  if (cmdInput) cmdInput.disabled = true;

  printToCmd(`C:\\Users\\Anurag> executing ${projectName}`);
  printToCmd(`Pinging ${liveUrl || projectName} with 32 bytes of data:<br>`);

  isAwaitingInput = true;

  setTimeout(() => {
    if (isLive && liveUrl !== "" && isOpen) {
      printToCmd(
        `Reply from ${liveUrl}: bytes=32 time=14ms TTL=119<br>Reply from ${liveUrl}: bytes=32 time=15ms TTL=119<br><br><span style="color: #00ff00;">STATUS: ONLINE</span><br>Wait... you are already browsing this project!<br>> Press <strong>[ENTER]</strong> for Source Code.<br>`,
      );
    } else if (isLive && liveUrl !== "") {
      printToCmd(
        `Reply from ${liveUrl}: bytes=32 time=14ms TTL=119<br>Reply from ${liveUrl}: bytes=32 time=15ms TTL=119<br><br><span style="color: #00ff00;">STATUS: ONLINE</span><br>> Press <strong>[1]</strong> for Live Site | <strong>[2]</strong> for Source Code<br>`,
      );
    } else if (!exists) {
      printToCmd(
        `Request timed out.<br>Request timed out.<br><br><span style="color: #ff3333;">STATUS: OFFLINE</span><br>Hey! I guess this project is still Work In Progress.<br>> Press <strong>[ENTER]</strong> to Close.<br>`,
      );
    } else {
      printToCmd(
        `Request timed out.<br>Request timed out.<br><br><span style="color: #ff3333;">STATUS: OFFLINE</span><br>Servers spun down. Code remains.<br>> Press <strong>[ENTER]</strong> for Source Code.<br>`,
      );
    }

    if (activeCmdListener)
      document.removeEventListener("keydown", activeCmdListener);

    activeCmdListener = (e) => {
      if (
        !isAwaitingInput ||
        !document.getElementById("cmd-window")?.classList.contains("active")
      )
        return;

      if (isLive && liveUrl !== "" && !isOpen) {
        if (e.key === "1") {
          window.open(liveUrl, "_blank");
          cleanup();
        }
        if (e.key === "2") {
          window.open(githubLink, "_blank");
          cleanup();
        }
      } else if (e.key === "Enter") {
        if (exists) window.open(githubLink, "_blank");
        cleanup();
      }
    };

    function cleanup() {
      isAwaitingInput = false;
      document.removeEventListener("keydown", activeCmdListener);
      activeCmdListener = null;
      closeWindow("cmd-window");

      cmdHistory.innerHTML =
        "Microsoft Windows [Version 6.1.7601]<br>Copyright (c) 2009 Microsoft Corporation.  All rights reserved.<br><br>";
      if (cmdInputLine) cmdInputLine.style.display = "flex";
      if (cmdInput) cmdInput.disabled = false;
    }

    document.addEventListener("keydown", activeCmdListener);
  }, 1500);
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

//notepad

function openNotepad(fileName) {
  const content = textFilesContent[fileName] || "File is empty or corrupted.";

  const titleEl = document.getElementById("notepad-title");
  const textEl = document.getElementById("notepad-text-area");

  if (titleEl) titleEl.innerText = `${fileName} - Notepad`;
  if (textEl) textEl.value = content;

  openWindow("notepad-window");
}

// task manager
const processRows = document.querySelectorAll(".tm-process");
const btnEndProcess = document.getElementById("btn-end-process");
const bsodScreen = document.getElementById("bsod-screen");
let selectedProcess = null;

processRows.forEach((row) => {
  row.addEventListener("click", () => {
    processRows.forEach((r) => r.classList.remove("selected"));
    row.classList.add("selected");
    selectedProcess = row.getAttribute("data-process");
  });
});
if (btnEndProcess) {
  btnEndProcess.addEventListener("click", () => {
    if (!selectedProcess) {
      showError(
        "Please select a process to terminate.",
        "Task Manager",
        "warning",
      );
      return;
    }

    if (selectedProcess === "system32") {
      if (bsodScreen) {
        bsodScreen.classList.remove("hidden");
        document.addEventListener(
          "keydown",
          () => {
            window.location.reload();
          },
          { once: true },
        );
      }
    } else if (selectedProcess === "explorer.exe") {
      const desktopIcons = document.querySelector(".desktop-icons");
      const taskbar = document.querySelector("#taskbar");

      if (desktopIcons) desktopIcons.style.display = "none";
      if (taskbar) taskbar.style.display = "none";

      closeWindow("taskmgr-window");

      setTimeout(() => {
        if (desktopIcons) desktopIcons.style.display = "flex";
        if (taskbar) taskbar.style.display = "flex";
        showError(
          "Windows Explorer has recovered from a critical failure.",
          "Windows Explorer",
          "info",
        );
      }, 4000);
    } else if (selectedProcess === "taskmgr.exe") {
      closeWindow("taskmgr-window");
    } else {
      showError(
        `Access Denied: You do not have permission to terminate ${selectedProcess}.`,
        "Task Manager",
        "error",
      );
    }
  });
}

// update
let isUpdating = false;

function startWindowsUpdate() {
  if (isUpdating) return;
  isUpdating = true;

  openWindow("update-window");
  const progressContainer = document.getElementById(
    "update-progress-container",
  );
  const progressBar = document.getElementById("update-progress-bar");
  const statusText = document.getElementById("update-status-text");
  const bsodScreen = document.getElementById("bsod-screen");
  let progress = 0;
  if (progressContainer) progressContainer.setAttribute("aria-valuenow", "0");
  if (progressBar) progressBar.style.width = "0%";
  if (statusText) statusText.innerText = "0% complete";
  const updateInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 14) + 2;

    if (progress >= 100) {
      progress = 100;
      if (progressContainer)
        progressContainer.setAttribute("aria-valuenow", "100");
      if (progressBar) progressBar.style.width = "100%";
      if (statusText) statusText.innerText = "100% complete - Restarting...";
      clearInterval(updateInterval);
      setTimeout(() => {
        closeWindow("update-window");
        if (bsodScreen) {
          bsodScreen.classList.remove("hidden");
          document.addEventListener(
            "keydown",
            () => {
              window.location.reload();
            },
            { once: true },
          );
        }
        isUpdating = false;
      }, 1500);
    } else {
      if (progressContainer)
        progressContainer.setAttribute("aria-valuenow", progress.toString());
      if (progressBar) progressBar.style.width = progress + "%";
      if (statusText) statusText.innerText = progress + "% complete";
    }
  }, 800);
}

const iconUpdate = document.getElementById("icon-update");
if (iconUpdate) {
  iconUpdate.addEventListener("dblclick", () => {
    startWindowsUpdate();
  });
}

//error
function showError(message, title = "Windows", iconType = "error") {
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorIcon = document.getElementById("error-icon");

  if (errorTitle) errorTitle.innerText = title;
  if (errorMessage) errorMessage.innerText = message;

  if (errorIcon) {
    errorIcon.src = `./images/${iconType}.ico`;
  }

  let soundFile = "./audio/error.mp3";
  if (iconType === "warning") soundFile = "./audio/ding.mp3";
  if (iconType === "info") soundFile = "./audio/error.mp3";

  const audio = new Audio(soundFile);
  audio.play().catch((e) => console.log("Audio blocked or file missing: ", e));
  openWindow("error-window");
  const win = document.getElementById("error-window");
  if (win) focusWindow(win);
}

// hide boot for mobile & manage desktop boot
window.onload = () => {
  if (window.innerWidth <= 768) {
    document.getElementById("boot").classList.add("hidden");
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("desktop").classList.remove("hidden");

    document.querySelectorAll(".window").forEach((win) => {
      win.classList.add("window-closed");
      win.style.display = "none";
    });

    const liveTiles = document.querySelectorAll(".live-tile .tile-inner");
    const animations = ["flipX", "flipY", "flipXRev", "flipYRev"];

    liveTiles.forEach((tile) => {
      const randomAnim =
        animations[Math.floor(Math.random() * animations.length)];
      const randomDelay = Math.random() * 4;
      const randomDuration = 7 + Math.random() * 4;

      const backFace = tile.querySelector(".tile-back");
      if (backFace) {
        if (randomAnim.includes("flipX"))
          backFace.style.transform = "rotateX(180deg) translateZ(0)";
        if (randomAnim.includes("flipY"))
          backFace.style.transform = "rotateY(180deg) translateZ(0)";
      }

      tile.style.animation = `${randomAnim} ${randomDuration}s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) ${randomDelay}s`;
    });

    return;
  }

  setTimeout(() => {
    if (logo) logo.style.opacity = "1";
    if (bootText) bootText.style.opacity = "1";
  }, 500);

  setTimeout(() => {
    bootScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  }, 4000);
};

// shutdown
const shutdownTriggers = document.querySelectorAll(".wp-arrow, .shutdown-btn");
const shutdownScreen = document.getElementById("shutdown-screen");

shutdownTriggers.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startMenu = document.getElementById("start-menu");
    if (startMenu) startMenu.classList.remove("show");

    const wpUi = document.getElementById("windows-phone-ui");
    if (wpUi) wpUi.classList.add("wp-hidden");

    const desktop = document.getElementById("desktop");
    if (desktop) desktop.classList.add("hidden");

    if (shutdownScreen) {
      shutdownScreen.classList.remove("hidden");
    }
    const audio = new Audio("./audio/shutdown.mp3");
    audio.play().catch((err) => console.log("Audio skipped"));

    setTimeout(() => {
      if (shutdownScreen) {
        shutdownScreen.innerHTML = "";
        shutdownScreen.style.backgroundColor = "#000";
        shutdownScreen.style.backgroundImage = "none";
        shutdownScreen.style.cursor = "none";
      }
    }, 4000);
  });
});
