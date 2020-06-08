const downloader = require("./downloader");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const readline = require("readline");

async function download_image_from_instagram(username, dir = null) {

    // Diretório para salvar as imagens e URL da página do perfil do Instagram.
    const download_path = dir || username;
    const url = "https://www.instagram.com/" + username;

    // Abre o browser e cria uma nova página.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Opening the profile page...");

    // Vai para a página do perfil no Instagram através da URL.
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);

    console.log("Downloading profile images...");

    // Obtém todas as imagens do perfil.
    const images = await downloader(page);
    console.log("Download completed successfully.");

    // Verifica se o diretório para salvar as imagens existe.
    if (!fs.existsSync(download_path)) {
        fs.mkdirSync(download_path);
    }

    console.log("Saving images...");

    // Percorre o array de imagens e salva cada imagem no diretório.
    for (let i = 0; i < images.length; i++) {
        const filename = path.join(download_path, i + images[i].extension);
        fs.writeFileSync(filename, Buffer.from(images[i].data));
    }

    // Fecha o browser e informa que as imagens foram salvas.
    await browser.close();
    console.log("Images saved successfully.");
}

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

input.question("Username: ", download_image_from_instagram);




