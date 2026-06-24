const scenes = [
    { text: "Ketika bel pulang telah lama berbunyi dan lorong sekolah mulai lengang,"},
    { text: "Aku berjalan berdampingan dengan seorang teman, jembatan bagi perasaan yang belum menemukan keberaniannya..."},
    { text: "Kami berbincang tentang banyak hal, terutama tentang kata-kata dan pernyataan yang tak pernah sempat ia utarakan sendiri"},
    { text: "Kutarik napas perlahan, menatap langit sore yang mulai berubah warna, lalu mencoba menyusun kembali setiap kata, pesan, dan pernyataan yang tersembunyi di balik keraguannya..."},
    { text: "Baiklah, mari kita mulai merangkai apa yang sebenarnya ia ingin katakan."}
];

const correctOrder = [
    "Eh, tau gak?",
    "Tadi dia nanyain kabar kamu ke aku.",
    "Katanya dia penasaran kamu lagi apa.",
    "Aku bilang kamu lagi sibuk tugas.",
    "Dia senyum-senyum pas denger itu."
];

let currentScene = 0;
let isValidationActive = false;

const dialogText = document.getElementById("dialogText");
const nextBtn = document.getElementById("nextBtn");
const gameContainer = document.getElementById("game-container");
const sourceContainer = document.getElementById("source-container");
const dropContainer = document.getElementById("drop-container");
const checkBtn = document.getElementById("checkBtn");
const btnNextChapter = document.getElementById("btnNextChapter");
const sceneImage = document.getElementById("sceneImage");

// --- LOGIKA PROLOG ---
const prologScreen = document.getElementById("prolog-screen");
const prologText = document.getElementById("prolog-text");

function startProlog() {
    const text = "Beberapa waktu berlalu...";
    let i = 0;
    const interval = setInterval(() => {
        prologText.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            setTimeout(() => {
                prologScreen.classList.add("prolog-fade-out");
                setTimeout(() => {
                    prologScreen.style.display = "none";
                    typeWriter(scenes[0].text); // Mulai narasi utama
                }, 2000); // Waktu transisi sesuai CSS
            }, 2000); // Jeda sebelum fade out
        }
    }, 100);
}

// Jalankan prolog saat halaman dimuat
window.onload = startProlog;

// Fungsi Ketik Utama
function typeWriter(text) {
    dialogText.innerHTML = "";
    let i = 0;
    const typing = setInterval(() => {
        dialogText.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(typing);
    }, 30);
}

// Tombol Lanjut (Next)
nextBtn.addEventListener("click", () => {
    if (isValidationActive) {
        document.querySelector(".dialog-box").style.display = "none";
        isValidationActive = false;
        return;
    }

    currentScene++;
    if (currentScene < scenes.length) {
        typeWriter(scenes[currentScene].text);
    } else {
        document.querySelector(".dialog-box").style.display = "none";
        sceneImage.classList.add("fade-out");
        setTimeout(() => {
            sceneImage.src = "assets/scene7.png";
            sceneImage.classList.remove("fade-out");
            setupGame();
            gameContainer.style.display = "flex";
        }, 800);
    }
});

// Drag & Drop
function setupGame() {
    let items = [...correctOrder].sort(() => Math.random() - 0.5);
    items.forEach(text => createBubble(text, sourceContainer));
}

function createBubble(text, parent) {
    const div = document.createElement("div");
    div.className = "chat-bubble";
    div.textContent = text;
    div.draggable = true;
    div.addEventListener("dragstart", (e) => e.dataTransfer.setData("text", text));
    div.addEventListener("click", () => moveBubble(div)); 
    parent.appendChild(div);
}

function moveBubble(el) {
    if (el.parentElement === sourceContainer) {
        dropContainer.appendChild(el);
    } else {
        sourceContainer.appendChild(el);
    }
}

[sourceContainer, dropContainer].forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
        e.preventDefault();
        const text = e.dataTransfer.getData("text");
        const bubble = Array.from(document.querySelectorAll('.chat-bubble')).find(b => b.textContent === text);
        if (zone.id === "drop-container") dropContainer.appendChild(bubble);
        else sourceContainer.appendChild(bubble);
    });
});

checkBtn.addEventListener("click", () => {
    const currentOrder = Array.from(dropContainer.children).map(c => c.textContent);
    document.querySelector(".dialog-box").style.display = "block";
    
    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        typeWriter("YEY! BENAR!!! Ternyata dia perhatian juga ya... (❤️ Friendship +1)");
        checkBtn.style.display = "none";
        nextBtn.style.display = "none";
        btnNextChapter.style.display = "block";
        isValidationActive = false;
    } else {
        typeWriter("Hmmmmssss, kayanya urutannya belum pas deh. Coba diatur lagi yuks!");
        btnNextChapter.style.display = "none";
        nextBtn.style.display = "block";
        isValidationActive = true; 
    }
});

btnNextChapter.addEventListener("click", () => window.location.href = "chapter3.html");