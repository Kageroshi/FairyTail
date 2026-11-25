const musicPlayers = document.querySelectorAll(".bgMusic");
const musicButtons = document.querySelectorAll(".music-button");

musicPlayers.forEach(music => {
    music.volume = 0.2;
});

musicButtons.forEach((button, index) => {
    const music = musicPlayers[index];

    button.addEventListener("click", async () => {
        if (music.paused) {
            // Pause the other music players
            musicPlayers.forEach(player => player.pause());
            musicButtons.forEach(btn => btn.textContent = "♫ Play Music");

            try {
                await music.play();
                button.textContent = "♫ Pause Music";
            } catch (error) {
                console.error("Unable to play music:", error);
            }
        } else {
            music.pause();
            button.textContent = "♫ Play Music";
        }
    });
});