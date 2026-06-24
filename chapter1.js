const btnNextChapter = document.getElementById("btnNextChapter");

const sceneImage =
document.getElementById("sceneImage");

const dialogText =
document.getElementById("dialogText");

const speaker =
document.getElementById("speaker");

const nextBtn =
document.getElementById("nextBtn");

const choiceContainer =
document.getElementById("choiceContainer");

const scenes = [

{
image:"assets/scene1.png",
speaker:"Narasi-Pupu",
text:"Hari itu terasa seperti hari-hari biasanya."
},

{
image:"assets/scene1.png",
speaker:"Narasi-Pupu",
text:"Tugas sekolah menumpuk seperti biasanya."
},

{
image:"assets/scene1.png",
speaker:"Narasi-Pupu",
text:"Dan aku sedang berusaha menyelesaikannya satu per satu."
},

{
image:"assets/scene1.png",
speaker:"Narasi-Pupu",
text:"Aku bahkan tidak memikirkan hal-hal lain saat itu."
},

{
image:"assets/scene1.png",
speaker:"Narasi-Pupu",
text:"Sampai sebuah notifikasi muncul."
},

{
image:"assets/scene2.png",
speaker:"???",
text:"Assalamualaikum"
},

{
image:"assets/scene3.png",
speaker:"???",
text:"Zahra, kalo kamu...."
}

];



let currentScene = 0;

function typeWriter(text){

    dialogText.innerHTML="";

    let i=0;

    const typing=setInterval(()=>{

        dialogText.innerHTML += text.charAt(i);

        i++;

        if(i>=text.length){

            clearInterval(typing);

        }

    },30);
}

function loadScene(index){

    sceneImage.classList.add("fade-out");

    setTimeout(()=>{

        sceneImage.src =
        scenes[index].image;

        speaker.textContent =
        scenes[index].speaker;

        typeWriter(
            scenes[index].text
        );

        sceneImage.classList.remove("fade-out");

    },800);
}

loadScene(0);

nextBtn.addEventListener("click", () => {
    currentScene++;

    if (currentScene < scenes.length) {
        loadScene(currentScene);
    } else {
        // Sembunyikan dialog sementara
        document.querySelector(".dialog-box").style.display = "none";
        
        // --- UBAH GAMBAR SAAT MASA PEMILIHAN ---
        sceneImage.classList.add("fade-out");
        setTimeout(() => {
            sceneImage.src = "assets/scene_pilihan.png"; // Ganti dengan file gambar masa pilihanmu
            sceneImage.classList.remove("fade-out");
            choiceContainer.style.display = "block"; // Tampilkan pilihan
        }, 800);
    }
});

/* ====================
   CHOICE
==================== */

document.querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {
        let response = "";
        let nextImage = "";

        switch(btn.dataset.type){
            case "cepat":
                response = "Sepertinya dia membutuhkan bantuan sekarang juga, aku langsung bales aja deh....";
                nextImage = "assets/scene4.png";
                break;
            case "santai":
                response = "Aku membalasnya sambil mengerjakan tugas...";
                nextImage = "assets/scene5.png";
                break;
            case "nanti":
                response = "Aku membiarkan notifikasi itu beberapa saat...";
                nextImage = "assets/scene6.png";
                break;
        }

        choiceContainer.style.display = "none";
        document.querySelector(".dialog-box").style.display = "block";
        nextBtn.style.display = "none"; // Sembunyikan tombol next biasa

        // Animasi fade-out saat memilih
        sceneImage.classList.add("fade-out");
        setTimeout(() => {
            sceneImage.src = nextImage;
            sceneImage.classList.remove("fade-out");
            speaker.textContent = "Narasi-Pupu";
            typeWriter(response);
            
            // Munculkan tombol Lanjut ke Chapter 2
            btnNextChapter.style.display = "block";
        }, 800);
    });
});

// Logika pindah ke Chapter 2
btnNextChapter.addEventListener("click", () => {
    window.location.href = "chapter2.html";
});