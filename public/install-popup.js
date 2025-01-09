// popup.js

document.addEventListener("DOMContentLoaded", function () {
  let installEvent = null;
  // Function to detect iOS
  function isIos() {
    const userAgent = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }

  // Funtion to check auth
  function isAuth() {
    const t = localStorage.getItem("token");
    if (t) return true;
    return false;
  }

  // Function to detect if in standalone mode
  function isInStandaloneMode() {
    return "standalone" in window.navigator && window.navigator.standalone;
  }

  // Function to create the popup HTML and CSS
  function createInstallPopup() {
    // Create style element for CSS
    const style = document.createElement("style");
    style.innerHTML = `
            .install-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .popup-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
                max-width: 300px;
                width: 80%;
            }

            .popup-content h2 {
                margin-top: 0;
                color: #333;
            }

            .popup-content p {
                color: #666;
            }

            .install-button, .close-button {
                background-color: #41C0EB;
                font-size: 20px;
                font-family: bregular;
                color: #fff;
                border: none;
                padding: 14px 20px;
                border-radius: 10px;
                cursor: pointer;
                margin: 10px 5px;
                transition: background-color 0.3s;
            }

            .install-button:hover, .close-button:hover {
                background-color: #F9B400;
            }

            .close-button {
                background-color: #AEAEAE;
            }

            .close-button:hover {
                background-color: #F9B400;
            }
        `;
    document.head.appendChild(style);

    // Create popup HTML
    const popup = document.createElement("div");
    popup.id = "install-popup";
    popup.className = "install-popup";
    popup.innerHTML = `
            <div class="popup-content">
                <h2>Install Beeu</h2>
                <p>${isIos()
        ? 'Tap the Share button and then "Add to Home Screen".'
        : "Use BeeU in fullscreen, install this browser-link button on your mobile device"
      }</p>
                ${isIos()
        ? ""
        : '<button id="install" class="install-button">Install Now</button>'
      }
                <button id="close-button" class="close-button">Close</button>
            </div>
        `;
    document.body.appendChild(popup);

    // Handle the Close button click
    document
      .getElementById("close-button")
      .addEventListener("click", function () {
        popup.style.display = "none";
        console.log("closed");
      });

    // Handle the Install button click if not iOS
    if (!isIos()) {
      document.getElementById("install").addEventListener("click", function () {
        if (installEvent) {
          installEvent.prompt();
          installEvent.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the A2HS prompt");
            } else {
              console.log("User dismissed the A2HS prompt");
            }
            installEvent = null;
            popup.style.display = "none";
          });
        }
      });
    }
  }

  function shouldShowInstallPopup() {
    const prevDate = Number(localStorage.getItem("prevPopupDate"));
    const currDate = new Date().getDate();
    const _isAuth = isAuth();
    if (_isAuth) {
      localStorage.setItem("prevPopupDate", currDate);
    }
    return _isAuth && currDate !== prevDate;
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent = e;
    //if (shouldShowInstallPopup()) createInstallPopup();
  });

  window.displayInstallPopupAfterLogin = function () {
    alert(shouldShowInstallPopup());
    alert((installEvent != null));
    if (installEvent != null && shouldShowInstallPopup()) createInstallPopup();
  };

  // Check if the device is iOS and not in standalone mode
  // if (isIos() && !isInStandaloneMode() && isAuth()) {
  // if (isIos()) {
  //   if (shouldShowInstallPopup()) createInstallPopup();
  // }

  // Check if PWA is already installed
  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
    // You can hide the popup here if necessary
    const popup = document.getElementById("install-popup");
    if (popup) {
      popup.style.display = "none";
    }
  });
});
