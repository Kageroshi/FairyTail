const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

music.volume = 0.2;

musicToggle.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = "♫ Pause";
    } else {
        music.pause();
        musicToggle.textContent = "♫ Play";
    }
});