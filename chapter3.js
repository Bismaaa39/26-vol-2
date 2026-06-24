const texts = ["Aku tak benar-benar tahu harus memulai dari mana", "Mungkin aku hanya seorang pengecut yang terlalu lama memandangi namanya tanpa pernah berani menekan tombol kirim", "Padahal, yang kuinginkan sederhana", "Aku hanya ingin berbicara dengannya....", "Mendengar ceritanya, membaca balasannya, atau sekadar mengetahui bagaimana harinya berjalan..."];
const storyText = document.getElementById("story-text");
const newBackground = document.getElementById("new-background");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const nextBtn = document.getElementById("nextBtn");
const objectContainer = document.getElementById("object-container");

let currentText = 0;
let currentDialog = 0;
let currentItemIndex = 0;

// Variabel status untuk melacak fase permainan agar tombol Lanjut tidak bingung
let gameState = "INTRO"; 

// Narasi awal sebelum permainan dimulai
const dialogueScenes = [
    "Hmssss, hari ini terlihat sama seperti hari-hari lainnya",
    "Langit masih berwarna sama, bel sekolah masih berbunyi seperti biasa...",
    "Namun entah mengapa, ada keinginan kecil yang terus mengetuk pikiranku",
    "Aku ingin menyapanya.",
    "Tentu saja aku tidak bisa tiba-tiba mengirim pesan tanpa alasan",
    "Setidaknya, itulah yang selalu kukatakan untuk menenangkan diriku sendiri",
    "Jadi, mari kita cari sebuah alasan",
    "Alasan yang cukup sederhana untuk membuka percakapan",
    "Dan semoga, cukup kuat untuk membawaku sedikit lebih dekat dengannya....."
];

// Daftar objek yang harus dicari secara berurutan
const itemsList = [
    { 
        id: 'obj-buku', 
        text: "Buku tugas selalu menjadi alasan yang paling aman. Aku bisa berpura-pura menanyakan tugas kelompok atau pekerjaan rumah yang sebenarnya sudah kutahu jawabannya. Bukan karena aku membutuhkan jawabannya. Aku hanya membutuhkan satu pesan pertama untuk sampai kepadanya."
    },
    { 
        id: 'obj-kertas', 
        text: "Catatanku kebetulan cukup lengkap. aku kan murid rajin hahahha. Mungkin aku bisa menawarkan bantuan jika ada materi yang tertinggal. Atau mungkin itu hanya alasan yang kubuat agar namaku muncul di notifikasinya." 
    },
    { 
        id: 'obj-jam', 
        text: "Jarum jam sudah bergerak menuju sore. Waktu yang tepat ketika suasana mulai tenang dan percakapan terasa lebih ringan. Mungkin sapaan sederhana tidak akan terdengar aneh pada jam seperti ini. Dan mungkin, dari satu pesan kecil itu, obrolan kami bisa berlangsung lebih lama dari yang kubayangkan." 
    }
];

/* ===================
   Fungsi Efek Mengetik (Typewriter)
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
            }, 2500);
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
function nextText() {
    if(currentText < texts.length){
        typeWriter(texts[currentText], () => {
            currentText++;
            nextText();
        });
    } else {
        newBackground.classList.add("show-new-bg");
        dialogBox.style.display = "block";
        gameState = "NARRATION"; // Ubah status menjadi narasi awal
        typeWriterDialog(dialogueScenes[0]);
    }
}

// Memulai teks pengantar layar hitam
nextText();

/* ===================
   Logika Tombol Lanjut (Menggunakan Status)
=================== */
nextBtn.addEventListener("click", () => {
    
    if (gameState === "NARRATION") {
        // Alur membaca narasi awal ("Mari kita susun...")
        currentDialog++;
        if (currentDialog < dialogueScenes.length) {
            typeWriterDialog(dialogueScenes[currentDialog]);
        } else {
            dialogBox.style.display = "none";
            startFindingItem(); // Mulai pencarian objek pertama
        }

    } else if (gameState === "ITEM_DIALOG") {
        // Alur setelah pemain menemukan objek dan membaca penjelasannya
        dialogBox.style.display = "none";
        currentItemIndex++; // Pindah ke target objek berikutnya
        
        if (currentItemIndex < itemsList.length) {
            startFindingItem(); // Cari objek selanjutnya
        } else {
            // Jika semua 3 objek telah ditemukan
            gameState = "FINAL_DIALOG";
            dialogBox.style.display = "block";
            typeWriterDialog('"Eh, boleh tanya tugas lagi ga?" Padahal aku sudah tahu jawabannya. Yang tidak pernah kutemukan justru keberanian untuk berkata bahwa aku ingin berbicara denganmu. Maka kubiarkan pertanyaan itu menjadi perantara. Menjadi alasan yang menyamarkan rindu-rindu kecil yang mulai tumbuh diam-diam. Karena terkadang, seseorang tidak benar-benar mencari jawaban dari sebuah tugas. Ia hanya sedang mencari kesempatan untuk lebih dekat dengan orang yang memenuhi pikirannya. EAAKKKKKKK');
            nextBtn.innerText = "Lanjut Chapter selanjutnya ➔"; // Ubah teks tombol
        }

    } else if (gameState === "FINAL_DIALOG") {
        // Alur ketika pemain mengklik "Selesai" di akhir dialog
        window.location.href = "chapter4.html";
    }
});

/* ===================
   Fungsi Mencari Objek Berurutan
=================== */
function startFindingItem() {
    gameState = "FINDING"; // Ubah status menjadi pencarian
    objectContainer.style.display = "block";
    
    // Ambil data objek yang sedang aktif berdasarkan urutan
    const currentItem = itemsList[currentItemIndex];
    const itemElement = document.getElementById(currentItem.id);
    
    // Tampilkan objek di layar
    itemElement.style.display = "block";

    // TAMBAHAN: Efek bercahaya (glow) dipanggil seketika, tanpa waktu tunggu
    itemElement.classList.add('pulse-effect');

    // Fungsi ketika pemain mengklik objek tersebut
    itemElement.onclick = (e) => {
        e.stopPropagation(); // Mencegah benturan klik
        
        // Sembunyikan objek setelah berhasil diklik
        itemElement.style.display = 'none'; 
        itemElement.classList.remove('pulse-effect');
        
        // PERUBAHAN: Sembunyikan container objek agar tidak menghalangi tombol Lanjut
        objectContainer.style.display = 'none'; 
        
        // Ubah status ke dialog objek dan tampilkan teksnya
        gameState = "ITEM_DIALOG";
        dialogBox.style.display = "block";
        typeWriterDialog(currentItem.text);
    };
}