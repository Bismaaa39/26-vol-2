/* ============================================================
   chapter7.js
   Diperbarui: Mengubah background saat Gameplay & Epilog
============================================================ */

// Deklarasi Variabel Antarmuka dan Narasi
const introText = "Kepercayaan telah terbangun, namun perjalanan belum selesai. Waktu terus berjalan, dan kesibukan kembali menyapa. Kini, tantangan sebenarnya adalah menjaga ritme agar hati tetap selaras.";
const epilogText = "Tidak setiap saat terasa sempurna, namun usaha untuk terus menyelaraskan langkah itulah yang membuat hubungan ini tetap hidup.";

const storyText = document.getElementById("story-text");
const prologContainer = document.getElementById("prolog-container");
const newBackground = document.getElementById("new-background");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const nextBtn = document.getElementById("nextBtn");
const gameContainer = document.getElementById("game-container");
const scoreVal = document.getElementById("score-val");
const targetZone = document.querySelector(".target-zone");
const hitBtn = document.getElementById("hit-btn");

let gameState = "INTRO";
let score = 0;
const targetScore = 10;
let baseSpeed = 3.5; // Durasi awal (detik) bagi hati untuk menyeberangi layar
let spawnInterval = null;
let currentHearts = [];

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

/* ===================
   Alur Utama Narasi
=================== */
function startChapter7() {
    // 1. BACKGROUND INTRO/AWAL: Menuju taman yang tenang
    changeBackground("assets/bg_taman.png", () => {
        typeWriter(introText, storyText, 40, () => {
            setTimeout(() => {
                storyText.classList.remove("show");
                prologContainer.style.display = "none";
                startGame();
            }, 3000);
        });
    });
}

function startGame() {
    gameState = "GAMEPLAY";
    
    // 2. BACKGROUND BARU (GAMEPLAY): Mengubah background saat permainan dimulai
    // Silakan ganti "assets/bg_gameplay.png" dengan file gambar Anda
    changeBackground("assets/bg_gameplay.png", () => {
        gameContainer.style.display = "flex";
        startSpawning();
    });
}

function startSpawning() {
    let intervalTime = 2200; // Interval awal pemunculan objek (milidetik)
    
    function spawnLoop() {
        if (gameState !== "GAMEPLAY") return;
        
        spawnHeart();
        
        // Interval pemunculan semakin singkat seiring bertambahnya skor
        intervalTime = Math.max(900, 2200 - (score * 130));
        spawnInterval = setTimeout(spawnLoop, intervalTime);
    }
    
    spawnInterval = setTimeout(spawnLoop, intervalTime);
}

function spawnHeart() {
    const heart = document.createElement("div");
    heart.classList.add("moving-heart");
    heart.style.left = "-60px"; 
    targetZone.appendChild(heart);
    
    let duration = Math.max(1.2, baseSpeed - (score * 0.22));
    heart.style.transition = `left ${duration}s linear, transform 0.2s ease-out, filter 0.2s`;
    
    currentHearts.push(heart);
    
    setTimeout(() => {
        heart.style.left = `${targetZone.clientWidth}px`;
        heart.style.transform = "translateY(-50%) rotate(-45deg) scale(1)";
    }, 50);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
            currentHearts = currentHearts.filter(h => h !== heart);
        }
    }, duration * 1000 + 100);
}

/* ===================
   Logika Ketepatan Waktu (Timing Game)
=================== */
function checkHit() {
    if (gameState !== "GAMEPLAY" || currentHearts.length === 0) return;
    
    const heart = currentHearts[0];
    const heartRect = heart.getBoundingClientRect();
    const zoneRect = targetZone.getBoundingClientRect();
    
    const heartCenter = heartRect.left + heartRect.width / 2;
    const zoneCenter = zoneRect.left + zoneRect.width / 2;
    
    const tolerance = 35;
    
    if (Math.abs(heartCenter - zoneCenter) <= tolerance) {
        score++;
        scoreVal.innerText = score;
        
        heart.style.setProperty('--heart-color', '#4caf50'); 
        heart.style.filter = "drop-shadow(0 0 20px #4caf50)";
        
        setTimeout(() => {
            heart.remove();
        }, 100);
        
        currentHearts.shift();
        
        if (score >= targetScore) {
            finishGame();
        }
    } else {
        heart.style.setProperty('--heart-color', '#9e9e9e'); 
        heart.style.filter = "none";
    }
}

hitBtn.addEventListener("click", checkHit);
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); 
        checkHit();
    }
});

/* ===================
   Fase Akhir Permainan
=================== */
function finishGame() {
    gameState = "EPILOGUE";
    clearTimeout(spawnInterval);
    
    currentHearts.forEach(h => h.remove());
    currentHearts = [];
    
    gameContainer.style.display = "none";
    
    // 3. BACKGROUND BARU (EPILOG): Mengubah background saat masuk kalimat "Tidak setiap saat..."
    // Silakan ganti "assets/bg_epilog.png" dengan file gambar Anda
    changeBackground("assets/bg_epilog.png", () => {
        dialogBox.style.display = "block";
        typeWriter(epilogText, dialogText, 30, () => {
            nextBtn.innerText = "Lanjut Bab 8 ➔";
        });
    });
}

nextBtn.addEventListener("click", () => {
    if (gameState === "EPILOGUE") {
        gameState = "TRANSITION";
        dialogBox.style.display = "none";
        fadeOutBackground(() => {
            document.body.style.backgroundColor = "black";
            setTimeout(() => {
                window.location.href = "chapter8.html";
            }, 1000);
        });
    }
});

// Memulai program
startChapter7();