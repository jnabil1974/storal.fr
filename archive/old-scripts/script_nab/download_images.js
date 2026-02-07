import fs from "fs";
import https from "https";
import path from "path";

const imagesListPath = "./images.json";
const outputDir = "./images";

// Vérifie que le fichier JSON existe
if (!fs.existsSync(imagesListPath)) {
    console.error("❌ Le fichier images.json est introuvable.");
    process.exit(1);
}

// Charge la liste des images
const images = JSON.parse(fs.readFileSync(imagesListPath, "utf8"));

// Crée le dossier images s'il n'existe pas
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Fonction de téléchargement
function downloadImage(ref, url) {
    return new Promise((resolve, reject) => {
        const ext = path.extname(url).split("?")[0] || ".jpg";
        const filePath = path.join(outputDir, `${ref}${ext}`);

        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(`Erreur HTTP ${response.statusCode} pour ${ref}`);
                return;
            }

            response.pipe(file);

            file.on("finish", () => {
                file.close();
                resolve();
            });
        }).on("error", (err) => {
            reject(err.message);
        });
    });
}

// Téléchargement en série
async function run() {
    console.log(`📥 Téléchargement de ${images.length} images…`);

    for (const img of images) {
        try {
            console.log(`➡️  ${img.ref}…`);
            await downloadImage(img.ref, img.url);
            console.log(`   ✔️  ${img.ref} téléchargée`);
        } catch (err) {
            console.error(`   ❌ Erreur pour ${img.ref}: ${err}`);
        }
    }

    console.log("🎉 Téléchargement terminé !");
}

run();
