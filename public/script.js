// Typing Animation
const roles = ["CSE Student", "Tech Enthusiast", "Entrepreneur"];
let i = 0, j = 0, deleting = false;

function type() {

    const el = document.getElementById("typing");

    if (!el) return;

    const word = roles[i];

    if (!deleting) {

        el.textContent = word.substring(0, j++);

        if (j > word.length) {
            deleting = true;
            setTimeout(type, 800);
            return;
        }

    } else {

        el.textContent = word.substring(0, j--);

        if (j < 0) {
            deleting = false;
            i = (i + 1) % roles.length;
        }

    }

    setTimeout(type, 80);
}

type();


// Dark Light Mode FIXED
const toggle = document.getElementById("themeToggle");

if (toggle) {

    toggle.addEventListener("click", () => {

        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {
            toggle.textContent = "☀️";
        } else {
            toggle.textContent = "🌙";
        }

    });

}


// ============================
// AI Animation Toggle Button
// ============================

const toggleBtn = document.getElementById("toggleAnimation");

let animationRunning = true;

if (toggleBtn) {

    toggleBtn.addEventListener("click", function () {

        const particles = document.getElementById("particles-js");

        if (animationRunning) {

            // stop particles
            if (particles) particles.style.display = "none";

            // stop background animation
            document.body.style.animation = "none";

            toggleBtn.innerHTML = "▶ Start Animation";

            animationRunning = false;

        } else {

            // start particles
            if (particles) particles.style.display = "block";

            // start background animation
            document.body.style.animation =
                "backgroundMove 20s ease-in-out infinite";

            toggleBtn.innerHTML = "⏸ Stop Animation";

            animationRunning = true;
        }

    });

}
// ============================
// Disable Right Click
// ============================
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});


// ============================
// Disable Image Drag
// ============================
document.addEventListener("dragstart", function(e) {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});


// ============================
// Disable Ctrl+S, Ctrl+U, Ctrl+C, Ctrl+Shift+I
// ============================
document.addEventListener("keydown", function(e) {

    // Ctrl+S
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
    }

    // Ctrl+U
    if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
    }

    // Ctrl+C
    if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
    }

    // Ctrl+Shift+I (inspect)
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
    }

});

// ============================
// AI CHAT FUNCTIONS
// ============================

function toggleChat() {

    let chat = document.getElementById("chatWindow");

    if (!chat) return;

    if (chat.style.display === "flex")
        chat.style.display = "none";
    else
        chat.style.display = "flex";
}



async function sendMessage() {

    let input = document.getElementById("chatInput");

    if (!input) return;

    let message = input.value;

    if (!message) return;

    let chatBox = document.getElementById("chatMessages");

    chatBox.innerHTML += "<div><b>You:</b> " + message + "</div>";

    input.value = "";

    try {

        let response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        let data = await response.json();

        chatBox.innerHTML += "<div><b>Myur AI:</b> " + data.reply + "</div>";

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        chatBox.innerHTML += "<div style='color:red;'>Error connecting AI</div>";

    }

}
// ============================
// SEND MESSAGE WITH ENTER KEY (FIXED)
// ============================

document.addEventListener("DOMContentLoaded", function () {

    const chatInput = document.getElementById("chatInput");

    if (!chatInput) return;

    chatInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    });

});

