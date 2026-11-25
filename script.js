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

const GITHUB_USERNAME = "zerefcoc";
const GITHUB_REPO = "fairytail";
const GITHUB_BRANCH = "main";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "avif"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg"];

const gallery = document.getElementById("highlightsGrid");

async function getFolderFiles(folder) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${folder}?ref=${GITHUB_BRANCH}`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to load ${folder}: ${response.status}`);
    }

    const files = await response.json();

    return files.filter(file => file.type === "file");
}
function createHighlight(file, type) {
    const card = document.createElement("div");
    card.className = "highlight-card";

    const extension = file.name.split(".").pop().toLowerCase();

    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${file.path.split("/").map(encodeURIComponent).join("/")}`;

    if (type === "image" && IMAGE_EXTENSIONS.includes(extension)) {
        const img = document.createElement("img");

        img.src = fileUrl;
        img.alt = file.name;
        img.loading = "lazy";

        card.appendChild(img);

    } else if (type === "video" && VIDEO_EXTENSIONS.includes(extension)) {
        const video = document.createElement("video");

        video.src = fileUrl;
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;

        card.appendChild(video);
    }

    return card;
}
async function loadHighlights() {
    try {
        gallery.innerHTML = "";

        const [images, videos] = await Promise.all([
            getFolderFiles("images"),
            getFolderFiles("videos")
        ]);

        const highlights = [
            ...images.map(file => ({ file, type: "image" })),
            ...videos.map(file => ({ file, type: "video" }))
        ].filter(item => {
            const extension = item.file.name.split(".").pop().toLowerCase();

            return item.type === "image"
                ? IMAGE_EXTENSIONS.includes(extension)
                : VIDEO_EXTENSIONS.includes(extension);
        });

        highlights.sort((a, b) =>
            a.file.name.localeCompare(b.file.name)
        );

        if (highlights.length === 0) {
            gallery.textContent = "No highlights found.";
            return;
        }

        highlights.forEach(item => {
            gallery.appendChild(
                createHighlight(item.file, item.type)
            );
        });

    } catch (error) {
        console.error("Error loading highlights:", error);
        gallery.textContent = "Unable to load highlights.";
    }
}
loadHighlights();