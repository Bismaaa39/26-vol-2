const texts = [
    "Setiap cerita memiliki awalnya masing-masing...",
    "Ada yang dimulai dari pertemuan yang tidak disengaja.",
    "Ada yang dimulai dari keberanian untuk menyapa.",
    "Dan ada juga yang dimulai dari sebuah pertanyaan tugas sekolah."
];

const storyText = document.getElementById("story-text");
const startBtn = document.getElementById("start-btn");

let currentText = 0;

/* ===================
   Typewriter
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

/* ===================
   Story
=================== */

function nextText(){

    if(currentText < texts.length){

        typeWriter(texts[currentText], () => {

            currentText++;
            nextText();

        });

    }else{

        startBtn.classList.add("show-btn");

    }
}

nextText();

/* ===================
   Button
=================== */

startBtn.addEventListener("click", () => {

    window.location.href = "chapter1.html";

});

/* ===================
   Stars
=================== */

const starsContainer = document.getElementById("stars");

for(let i = 0; i < 120; i++){

    const star = document.createElement("div");

    star.classList.add("star");

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    star.style.animationDelay =
        Math.random() * 5 + "s";

    starsContainer.appendChild(star);
}