const introText = ["Ternyata, perjalanan ini membawa kita ke sebuah persimpangan rasa yang tidak pernah diduga sebelumnya."];
const storyText = document.getElementById("story-text");
const newBackground = document.getElementById("new-background");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const nextBtn = document.getElementById("nextBtn");
const choiceContainer = document.getElementById("choice-container");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");

let currentText = 0;
let currentDialog = 0;
let gameState = "INTRO"; 
let selectedChoice = "";

const dialogueScenes = [
    "Sebuah notifikasi memecah keheningan malam ini.",
    "Pesan singkat darinya kembali hadir, membawa untaian kata yang sederhana namun bermakna.",
    "Kok i seneng y kl dia chat?"
];

// Data respons berdasarkan pilihan pemain
const branchDialogues = {
    choice1: {
        bg: "assets/bg_kamar2.png",
        text: [
            "Ya biasa laah, dia adalah temen kok suka ngobrol seru lagi.",
            "Tapi kok nyaman ya... AH SUDALAH Rasa nyaman ini pasti hanya sebatas persahabatan biasa, tidak lebih."
        ]
    },
    choice2: {
        bg: "assets/bg_kamar2.png",
        text: [
            "IH APASIK EEK SETIAP MUNCUL DI HP HATI GUA DEG-DEGAN TERUUUS",
            "Aku ga bisa membohongi diri ku, aku selalu menantikan kehadirannya setiap hari...."
        ]
    }
};

const finalDialogue = "Perasaan ini masih berkecamuk di dalam dada, tetapi jemariku mulai bergerak perlahan untuk mengetik sebuah balasan.";

/* ===================
   Fungsi Transisi Latar Belakang
=================== */
function changeBackground(imageUrl, callback) {
    newBackground.classList.remove("show-new-bg"); 
    
    setTimeout(() => {
        newBackground.style.backgroundImage = `url('${imageUrl}')`;
        newBackground.classList.add("show-new-bg"); 
        
        if (callback) {
            setTimeout(callback, 1000); 
        }
    }, 1000); 
}

/* ===================
   Fungsi Efek Mengetik
=================== */
function typeWriter(text, callback){
    storyText.innerHTML = "";
    storyText.classList.add("show");
    let i = 0;
    const interval = setInterval(() => {
        storyText.innerHTML += text.charAt(i);
        i++;
        if(i >= text.length){
            clearInterval(interval);
            setTimeout(() => {
                storyText.classList.remove("show");
                setTimeout(callback, 1000);
            }, 3000);
        }
    }, 50);
}

function typeWriterDialog(text) {
    dialogText.innerHTML = "";
    let i = 0;
    const typing = setInterval(() => {
        dialogText.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(typing);
    }, 30);
}

/* ===================
   Alur Utama Permainan
=================== */
function startIntro() {
    if(currentText < introText.length){
        typeWriter(introText[currentText], () => {
            currentText++;
            startIntro();
        });
    } else {
        // Mengubah latar belakang ke suasana kamar tidur yang hangat
        changeBackground("assets/bg_kamar1.png", () => {
            dialogBox.style.display = "block";
            gameState = "NARRATION"; 
            typeWriterDialog(dialogueScenes[0]);
        });
    }
}

// Memulai animasi teks pembuka
startIntro();

/* ===================
   Logika Tombol Lanjut
=================== */
nextBtn.addEventListener("click", () => {
    if (gameState === "TRANSITION") return; 

    if (gameState === "NARRATION") {
        currentDialog++;
        if (currentDialog < dialogueScenes.length) {
            typeWriterDialog(dialogueScenes[currentDialog]);
        } else {
            // Menyembunyikan kotak dialog untuk menampilkan pilihan cerita
            dialogBox.style.display = "none";
            gameState = "CHOICE_EVENT";
            choiceContainer.style.display = "flex";
        }
    } 
    else if (gameState === "BRANCH_DIALOG") {
        currentDialog++;
        // Tambahkan .text sebelum .length
        if (currentDialog < branchDialogues[selectedChoice].text.length) {
            // Tambahkan .text sebelum memanggil urutan dialog
            typeWriterDialog(branchDialogues[selectedChoice].text[currentDialog]);
        } else {
            // Masuk ke dialog penutup/konvergensi alur
            gameState = "FINAL_DIALOG";
            typeWriterDialog(finalDialogue);
            nextBtn.innerText = "Lanjut Chapter 6 ➔";
        }
    }
    else if (gameState === "FINAL_DIALOG") {
        gameState = "TRANSITION";
        dialogBox.style.display = "none";
        // Efek transisi layar hitam sebelum menuju bab selanjutnya
        changeBackground("assets/black.jpg", () => {
            window.location.href = "chapter6.html";
        });
    }
});

/* ===================
   Logika Interaksi Tombol Pilihan
=================== */
function handleChoice(choiceKey) {
    selectedChoice = choiceKey;
    choiceContainer.style.display = "none";
    
    // Ubah status agar tidak ada tombol yang berfungsi saat transisi gambar
    gameState = "TRANSITION"; 
    
    // Panggil fungsi pergantian latar belakang terlebih dahulu
    changeBackground(branchDialogues[selectedChoice].bg, () => {
        // Setelah gambar berganti, tampilkan kotak dialog dan ketik teksnya
        dialogBox.style.display = "block";
        currentDialog = 0;
        gameState = "BRANCH_DIALOG";
        
        // Tambahkan .text saat memanggil dialog
        typeWriterDialog(branchDialogues[selectedChoice].text[currentDialog]);
    });
}

choice1.addEventListener("click", () => handleChoice("choice1"));
choice2.addEventListener("click", () => handleChoice("choice2"));