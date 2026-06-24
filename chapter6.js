// Deklarasi Variabel Antarmuka dan Narasi
const introText = "Setelah pesan-pesan hangat malam itu, hari-hari berikutnya terasa berbeda. Kesibukan menumpuk, dan jarak mulai terasa. Awan gelap keraguan perlahan menyelimuti pikiran.";
const epilogText = "Setiap rintangan dan masalah ternyata ujian dan pembelajran untuk saling memahami. Setelah awan gelap berlalu, hubungan dan kepercayaan ini tumbuh semakin kuat.";

const storyText = document.getElementById("story-text");
const prologContainer = document.getElementById("prolog-container");
const newBackground = document.getElementById("new-background");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const nextBtn = document.getElementById("nextBtn");
const puzzleContainer = document.getElementById("puzzle-container");
const svgCanvas = document.getElementById("line-svg");
const trustNotif = document.getElementById("trust-notif");

let gameState = "INTRO";
let solvedCount = 0;

/* ===================
   Utilitas Visual & Animasi
=================== */
function changeBackground(imageUrl, callback) {
    newBackground.style.backgroundImage = `url('${imageUrl}')`;
    newBackground.classList.add("show-new-bg");
    if (callback) setTimeout(callback, 1500);
}

function fadeOutBackground(callback) {
    newBackground.classList.remove("show-new-bg");
    if (callback) setTimeout(callback, 1500);
}

function typeWriter(text, element, speed, callback) {
    element.innerHTML = "";
    let i = 0;
    element.classList.add("show");
    const interval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

function showTrustNotification() {
    trustNotif.classList.add("show-notif");
    setTimeout(() => {
        trustNotif.classList.remove("show-notif");
    }, 1500);
}

/* ===================
   Alur Utama Narasi
=================== */
function startChapter6() {
    // Pengaturan awal latar belakang mendung/senja
    changeBackground("assets/bg_mendung.png", () => {
        typeWriter(introText, storyText, 40, () => {
            setTimeout(() => {
                storyText.classList.remove("show");
                prologContainer.style.display = "none";
                startPuzzle();
            }, 3000);
        });
    });
}

function startPuzzle() {
    gameState = "PUZZLE";
    puzzleContainer.style.display = "block";
    // Transisi latar belakang menjadi lebih redup untuk fokus pada teka-teki
    changeBackground("assets/bg_gelap.jpg"); 
}

function finishPuzzle() {
    gameState = "EPILOGUE";
    puzzleContainer.style.display = "none";
    
    // Perubahan latar belakang ke langit cerah/berbintang
    changeBackground("assets/bg_cerah.png", () => {
        dialogBox.style.display = "block";
        typeWriter(epilogText, dialogText, 30, () => {
            nextBtn.innerText = "Lanjut Chapter 7 ➔";
        });
    });
}

// Memulai program
startChapter6();

/* ===================
   Logika Menarik Garis (Teka-Teki Emosi)
=================== */
let isDrawing = false;
let currentLine = null;
let startNode = null;

const problems = document.querySelectorAll(".problem-node");
const solutions = document.querySelectorAll(".solution-node");

// Fungsi pembantu untuk mendapatkan koordinat relatif terhadap kontainer SVG
function getRelativeCoords(element) {
    const rect = element.getBoundingClientRect();
    const svgRect = svgCanvas.getBoundingClientRect();
    return {
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top + rect.height / 2
    };
}

// Interaksi saat kursor ditekan
problems.forEach(node => {
    node.addEventListener("mousedown", startDrawing);
    node.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startDrawing(e.touches[0] || e);
    }, { passive: false });
});

function startDrawing(e) {
    if (e.target.classList.contains("solved")) return;

    isDrawing = true;
    startNode = e.target;
    const startCoords = getRelativeCoords(startNode);

    // Membuat elemen garis SVG baru
    currentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    currentLine.setAttribute("x1", startCoords.x);
    currentLine.setAttribute("y1", startCoords.y);
    currentLine.setAttribute("x2", startCoords.x);
    currentLine.setAttribute("y2", startCoords.y);
    currentLine.setAttribute("stroke", "rgba(255, 255, 255, 0.8)");
    currentLine.setAttribute("stroke-width", "4");
    currentLine.setAttribute("stroke-linecap", "round");
    
    svgCanvas.appendChild(currentLine);
}

// Interaksi saat kursor digerakkan
window.addEventListener("mousemove", drawLine);
window.addEventListener("touchmove", (e) => {
    if (isDrawing) {
        drawLine(e.touches[0]);
    }
}, { passive: false });

function drawLine(e) {
    if (!isDrawing || !currentLine) return;

    const svgRect = svgCanvas.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    currentLine.setAttribute("x2", mouseX);
    currentLine.setAttribute("y2", mouseY);
}

// Interaksi saat tekanan dilepaskan
window.addEventListener("mouseup", stopDrawing);
window.addEventListener("touchend", stopDrawing);

function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;

    // Mendapatkan elemen yang berada di bawah kursor saat dilepaskan
    let endTarget = e.target;
    
    // Penanganan khusus untuk layar sentuh agar dapat mendeteksi elemen target
    if (e.type === "touchend") {
        const touch = e.changedTouches[0];
        endTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    }

    if (endTarget && endTarget.classList.contains("solution-node")) {
        const requiredMatch = startNode.getAttribute("data-match");
        const currentMatch = endTarget.getAttribute("data-id");

        if (requiredMatch === currentMatch) {
            // Jika penghubungan benar
            const endCoords = getRelativeCoords(endTarget);
            currentLine.setAttribute("x2", endCoords.x);
            currentLine.setAttribute("y2", endCoords.y);
            
            // Efek visual penyelesaian
            currentLine.setAttribute("stroke", "#4caf50");
            currentLine.setAttribute("stroke-width", "6");
            startNode.classList.add("solved");
            endTarget.classList.add("solved");
            
            showTrustNotification();
            solvedCount++;

            if (solvedCount === 3) {
                setTimeout(finishPuzzle, 1500);
            }
        } else {
            // Jika salah, garis dihapus
            currentLine.remove();
        }
    } else {
        // Jika dilepaskan di area kosong
        currentLine.remove();
    }
    
    currentLine = null;
    startNode = null;
}

/* ===================
   Logika Tombol Navigasi Akhir
=================== */
nextBtn.addEventListener("click", () => {
    if (gameState === "EPILOGUE") {
        gameState = "TRANSITION";
        dialogBox.style.display = "none";
        // Efek memudar ke hitam sebelum berpindah halaman
        fadeOutBackground(() => {
            document.body.style.backgroundColor = "black";
            setTimeout(() => {
                window.location.href = "chapter7.html";
            }, 1000);
        });
    }
});