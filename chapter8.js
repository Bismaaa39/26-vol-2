const introText = [
    "Waktu berlalu begitu cepat.",
    "Banyak hal yang telah kita lalui bersama hingga titik ini.",
    "Sekarang, saatnya merenungkan ke mana langkah ini akan berlabuh."
];

const storyText = document.getElementById("story-text");
const newBackground = document.getElementById("new-background");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const speakerName = document.getElementById("speaker");
const nextBtn = document.getElementById("nextBtn");
const choiceContainer = document.getElementById("choice-container");

let currentText = 0;
let currentDialog = 0;
let gameState = "INTRO"; 
let selectedChoice = "";

const contemplationScene = [
    { name: "Binyu", text: "Beb... emm. kita kan udah tahun kedua nih. Dari semuaaaaa yang udah kita lalui. Apa yang paling partner aku impikan untuk masa depan kita?" }
];

const branchDialogues = {
    choicePupu: {
        bg: "assets/bg_travel_pupu.png",
        dialogues: [
            { name: "Pupu", text: "I pengen kita keliling duniaa! Jalan-jalan menghabiskan waktu sama ayang aku/ Mengunjungi semua tempat yang ada di daftar impianku" },
            { name: "Binyu", text: "Pengen baget KAI date tuh?" },
            { name: "Pupu", text: "APASIK BEB AH." },
            { name: "Binyu", text: "WkWkwkwk. Emmmm... baiklah, kalo begitu, siapkan tass sapi mu itu karena pasti kamu akan menitipkan semua barang ke tas ku. Kita akan menapaki setiap sudut bumi bersama-sama." },
            { name: "Pupu", text: "YEYYY OKAY SAYANG. LOVE U, MUACHHH" },
            { name: "Binyu", text: "Iya iya, love u more sayang. /kiss kening" }
        ]
    },
    choiceBinyu: {
        bg: "assets/bg_travel_binyu.png",
        dialogues: [
            { name: "Pupu", text: "Ke mana ini beb?" },
            { name: "Binyu", text: "mimpi ku" },
            { name: "Pupu", text: "cih, kebiasaan" },
            { name: "Binyu", text: "Aku lebih suka perjalanan tanpa rencana yang pasti. Spontan, menyusuri jalanan yang belum pernah kita lewati." },
            { name: "Pupu", text: "Nyenyenyenyneenye" },
            { name: "Pupu", text: "Semoga suatu saat kita bisa menikmati seperti gambar ini sayang" },
            { name: "Pupu", text: "ok...." }
        ]
    },
    choiceMenikah: {
        bg: "assets/bg_menikah.png",
        dialogues: [
            { name: "NOTE!!!!!!!!!!!!!!!!!!!!!", text: "WKWKKW APASIK BEB, tunggu s2 ya" },
            { name: "Binyu", text: "Hai sayangku.. Aku ingin mengikat janji denganmu. Menjadikanmu bagian utuh dari masa depanku." },
            { name: "Pupu", text: "S2 dulu sana yang bener." },
            { name: "Binyu", text: "DIH. LU YANG MILIH JUGA" },
            { name: "Pupu", text: "hehehehe" }
        ]
    },
    choiceRumah: {
        bg: "assets/bg_rumah.png",
        dialogues: [
            { name: "Pupu", text: "awas aja beli rumah terbengkalai lu" },
            { name: "Pupu", text: "I cuma pengen sebuah rumah yang hangat. Tempat kita selalu pulang setiap hari." },
            { name: "Binyu", text: "Ide yang bagus bagaimana jika Rumah dengan taman kecil, menua bersama, dan menikmati secangkir matcha di teras setiap pagi." },
            { name: "Pupu", text: "kamu bikin sendiri y" },
            { name: "Binyu", text: "DIHHHHHHHHH!!!!!!!!!!!??????????" }
        ]
    },
    choiceBobok: {
        bg: "assets/bg_kamar_tenang.png",
        dialogues: [
            { name: "Pupu", text: "hUWAAAAHHH" },
            { name: "Binyu", text: "Beb... Sejujurnya, dunia luar kadang terlalu bising." },
            { name: "Pupu", text: "Iya ih, cini clingy aja ke gua" },
            { name: "Binyu", text: "gamau gantian sayang?" },
            { name: "Pupu", text: "y mw lah, tp ak gengsi." }
        ]
    }
};

const finalNarrative = "Apa pun masa depan yang menanti, melangkah bersamamu adalah pilihan terbaik.";

/* ===================
   Fungsi Utilitas
=================== */
function changeBackground(imageUrl, callback) {
    newBackground.classList.remove("show-new-bg"); 
    setTimeout(() => {
        newBackground.style.backgroundImage = `url('${imageUrl}')`;
        newBackground.classList.add("show-new-bg"); 
        if (callback) setTimeout(callback, 1500); 
    }, 1000); 
}

function typeWriter(text, targetElement, speed, callback) {
    targetElement.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
        targetElement.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) setTimeout(callback, 1500);
        }
    }, speed);
}

function typeWriterDialog(name, text) {
    speakerName.innerText = name;
    dialogText.innerHTML = "";
    let i = 0;
    const typing = setInterval(() => {
        dialogText.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(typing);
    }, 30);
}

/* ===================
   Alur Utama & Resolusi
=================== */
function startIntro() {
    if (currentText < introText.length) {
        storyText.classList.add("show");
        typeWriter(introText[currentText], storyText, 50, () => {
            currentText++;
            storyText.classList.remove("show");
            setTimeout(startIntro, 1000);
        });
    } else {
        changeBackground("assets/bg_persimpangan.png", () => {
            dialogBox.style.display = "block";
            gameState = "NARRATION"; 
            const scene = contemplationScene[0];
            typeWriterDialog(scene.name, scene.text);
        });
    }
}

startIntro();

/* ===================
   Logika Tombol Lanjut
=================== */
nextBtn.addEventListener("click", () => {
    if (gameState === "TRANSITION") return; 

    if (gameState === "NARRATION") {
        dialogBox.style.display = "none";
        gameState = "CHOICE_EVENT";
        choiceContainer.style.display = "flex";
    } 
    else if (gameState === "BRANCH_DIALOG") {
        currentDialog++;
        const branchData = branchDialogues[selectedChoice].dialogues;
        
        if (currentDialog < branchData.length) {
            typeWriterDialog(branchData[currentDialog].name, branchData[currentDialog].text);
        } else {
            gameState = "FINAL_DIALOG";
            typeWriterDialog("Narasi", finalNarrative);
            nextBtn.innerText = "Selesai";
        }
    }
    else if (gameState === "FINAL_DIALOG") {
        gameState = "TRANSITION";
        dialogBox.style.display = "none";
        
        // Transisi ke layar hitam sebelum epilog dimulai
        changeBackground("assets/black.jpg", startEpilogue);
    }
});

/* ===================
   Penanganan Pilihan
=================== */
function handleChoice(choiceId) {
    selectedChoice = choiceId;
    choiceContainer.style.display = "none";
    gameState = "TRANSITION"; 
    
    changeBackground(branchDialogues[selectedChoice].bg, () => {
        dialogBox.style.display = "block";
        currentDialog = 0;
        gameState = "BRANCH_DIALOG";
        
        const firstDialog = branchDialogues[selectedChoice].dialogues[0];
        typeWriterDialog(firstDialog.name, firstDialog.text);
    });
}

document.getElementById("choicePupu").addEventListener("click", () => handleChoice("choicePupu"));
document.getElementById("choiceBinyu").addEventListener("click", () => handleChoice("choiceBinyu"));
document.getElementById("choiceMenikah").addEventListener("click", () => handleChoice("choiceMenikah"));
document.getElementById("choiceRumah").addEventListener("click", () => handleChoice("choiceRumah"));
document.getElementById("choiceBobok").addEventListener("click", () => handleChoice("choiceBobok"));

/* ===================
   Fase Penutup (Epilog, Video, QR)
=================== */
function startEpilogue() {
    const epilogueContainer = document.getElementById("epilogue-container");
    const epilogueTextEl = document.getElementById("epilogue-text");
    const epilogueMessage = "Dari sebuah pertanyaan tugas sederhana, ternyata aku menemukan seseorang yang selalu ingin aku pertahankan.";

    epilogueContainer.style.display = "flex";
    
    // Mengetik pesan epilog dengan lambat untuk kesan dramatis
    typeWriter(epilogueMessage, epilogueTextEl, 60, () => {
        // Biarkan pesan tampil selama 4 detik, lalu pudarkan
        setTimeout(() => {
            epilogueTextEl.style.opacity = 0;
            // Setelah pudar, tampilkan video
            setTimeout(showVideo, 1500);
        }, 4000);
    });
}

function showVideo() {
    document.getElementById("epilogue-container").style.display = "none";
    const videoContainer = document.getElementById("video-container");
    
    videoContainer.style.display = "flex";
    // Memicu efek transisi pudar
    setTimeout(() => {
        videoContainer.classList.add("show-video");
    }, 100);
}

// Tombol untuk memunculkan halaman Google Drive dan QR Code
document.getElementById("showFinalBtn").addEventListener("click", () => {
    const videoContainer = document.getElementById("video-container");
    const finalContainer = document.getElementById("final-container");
    
    // Menghentikan video saat berpindah (opsional namun disarankan)
    const iframe = document.getElementById("youtube-video");
    iframe.src = iframe.src; 

    videoContainer.classList.remove("show-video");
    setTimeout(() => {
        videoContainer.style.display = "none";
        finalContainer.style.display = "flex";
        setTimeout(() => {
            finalContainer.classList.add("show-final");
        }, 100);
    }, 1000);
});