const introText = ["Ternyata, yang membuat perjalanan ini begitu berharga bukanlah pesan-pesan yang memenuhi layar ponselku", "Melainkan kehadirannya di antara hari-hariku.", "Sebab setiap obrolan, setiap pertemuan, dan setiap kenangan kecil yang kami ciptakan bersama,", "telah meninggalkan jejak yang jauh lebih abadi daripada sekadar rangkaian kata...."];
const storyText = document.getElementById("story-text");
const newBackground = document.getElementById("new-background");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const nextBtn = document.getElementById("nextBtn");
const objectContainer = document.getElementById("object-container");
const memoryItems = document.querySelectorAll(".memory-item");

let currentText = 0;
let currentDialog = 0;
let memoriesFound = 0;
const totalMemories = 4;

let gameState = "INTRO"; 

const dialogueScenes = [
    "Buku ini... sudah lama aku tidak membukanya.",
    "Semuanya terlihat abu-abu, seolah menunggu untuk diingat kembali.",
    "Setiap gambar menyimpan ceritanya sendiri. Memori mana yang harus kuingat lebih dahulu?"
];

// Data untuk masing-masing item memori, teks cerita, dan gambar latar belakang khususnya
// Anda dapat mengganti nama berkas gambar di bawah dengan gambar yang Anda buat.
const memoryData = {
    'item-foto': {
        text: "Dalam satu bingkai ini, waktu pernah berhenti sejenak. Mengabadikan kita sebelum hari-hari menjelma menjadi cerita yang begitu berarti.",
        bg: "assets/bg_cerita_foto.png" // Latar belakang khusus saat foto diklik
    },
    'item-ultah': {
        text: "Sesuatu yang sederhana, namun bagiku sangat berarti. Kehadiranmu membuat hari itu terasa lebih hangat dari tahun-tahun sebelumnya.",
        bg: "assets/bg_cerita_ultah.png" // Latar belakang khusus saat ulang tahun diklik
    },
    'item-hadiah': {
        text: "Barang kecil yang kau berikan padaku. Aku tahu kau mungkin gugup saat itu, tapi percayalah, aku sangat menghargainya.",
        bg: "assets/bg_cerita_hadiah.png" // Latar belakang khusus saat hadiah diklik
    },
    'item-lagu': {
        text: "Lagu yang sering kita putar bersama. Liriknya terasa lebih bermakna, seolah-olah ia sedang bercerita tentang kita berdua.",
        bg: "assets/bg_cerita_lagu.png" // Latar belakang khusus saat lagu diklik
    }
};

/* ===================
   Fungsi Transisi Latar Belakang
=================== */
function changeBackground(imageUrl, callback) {
    newBackground.classList.remove("show-new-bg"); // Menghilangkan gambar lama (Fade-out ke hitam)
    
    setTimeout(() => {
        newBackground.style.backgroundImage = `url('${imageUrl}')`;
        newBackground.classList.add("show-new-bg"); // Menampilkan gambar baru (Fade-in)
        
        if (callback) {
            setTimeout(callback, 1000); // Menunggu animasi selesai sebelum melanjutkan cerita
        }
    }, 1000); // Waktu 1 detik untuk proses fade-out
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
        // Tampilkan latar belakang buku tertutup (Buku ini... sudah lama aku tidak membukanya)
        newBackground.style.backgroundImage = "url('assets/bg_buku_tertutup.png')";
        newBackground.classList.add("show-new-bg");
        
        dialogBox.style.display = "block";
        gameState = "NARRATION"; 
        typeWriterDialog(dialogueScenes[0]);
    }
}

// Memulai teks pembuka layar hitam
startIntro();

/* ===================
   Logika Tombol Lanjut
=================== */
nextBtn.addEventListener("click", () => {
    
    if (gameState === "TRANSITION") return; // Cegah tombol diklik saat animasi berjalan

    if (gameState === "NARRATION") {
        currentDialog++;
        
        if (currentDialog === 2) {
            // Pada dialog ke-3 ("Setiap gambar menyimpan ceritanya sendiri..."), ganti latar ke Buku Terbuka
            gameState = "TRANSITION";
            dialogBox.style.display = "none";
            
            changeBackground("assets/bg_buku_terbuka.png", () => {
                gameState = "NARRATION";
                dialogBox.style.display = "block";
                typeWriterDialog(dialogueScenes[currentDialog]);
            });

        } else if (currentDialog < dialogueScenes.length) {
            typeWriterDialog(dialogueScenes[currentDialog]);
        } else {
            gameState = "TRANSITION";
            dialogBox.style.display = "none";
            changeBackground("assets/black.jpg", () => {
                gameState = "EXPLORING";
                objectContainer.style.display = "block";
            });
        }

    } else if (gameState === "ITEM_DIALOG") {
        gameState = "TRANSITION";
        dialogBox.style.display = "none";
        
        if (memoriesFound < totalMemories) {
            // Jika belum semua terkumpul, kembalikan latar ke buku terbuka
            changeBackground("assets/black.jpg", () => {
                gameState = "EXPLORING";
                objectContainer.style.display = "block";
            });
        } else {
            // Jika semua 4 memori telah dikumpulkan, tampilkan dialog akhir
            changeBackground("assets/black.jpg", () => {
                gameState = "FINAL_DIALOG";
                objectContainer.style.display = "block"; 
                dialogBox.style.display = "block";
                typeWriterDialog("Kini semuanya kembali berwarna. Mengingat momen-momen kecil ini membuatku sadar bahwa perjalanan kita telah membentukku menjadi diriku yang sekarang.");
                nextBtn.innerText = "Lanjut Chapter 5 ➔"; 
            });
        }

    } else if (gameState === "FINAL_DIALOG") {
        window.location.href = "chapter5.html";
    }
});

/* ===================
   Fungsi Interaksi Objek Memori
=================== */
memoryItems.forEach(item => {
    item.addEventListener("click", (e) => {
        if (gameState !== "EXPLORING") return;

        item.classList.add("revealed");
        objectContainer.style.display = "none";
        
        // Ubah status agar tidak ada tombol yang berfungsi saat transisi
        gameState = "TRANSITION"; 
        dialogBox.style.display = "none";

        const data = memoryData[item.id];
        
        // Ganti latar belakang sesuai dengan memori yang diklik
        changeBackground(data.bg, () => {
            gameState = "ITEM_DIALOG";
            memoriesFound++;
            
            dialogBox.style.display = "block";
            typeWriterDialog(data.text);
        });
    });
});