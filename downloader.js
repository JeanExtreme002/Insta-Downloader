const fetch = require("node-fetch");

async function download_images(images_src) {

    /*
    Recebe um array com URL de imagens e retorna
    o conteúdo deste arquivo e sua extensão.
    */

    const images = [];

    for (let i = 0; i < images_src.length; i++) {
        images.push(await get_data_from(images_src[i]));
    }

    return images;
}

async function get_data_from(url) {

    /*
    Realiza o download de uma imagem e retorna o conteúdo e sua extensão.
    */

    const response = await fetch(url);

    const data = await response.arrayBuffer();
    const extension = "." + response.headers.get("content-type").split("/")[1];

    return {data: data, extension: extension};
} 

async function get_images_from_instagram(page, timeout = 3000) {

    /*
    Retorna um array de objetos {data, extension} de todas as imagens 
    da página de um perfil do Instagram.
    */

    const images = await page.evaluate(get_images_src, timeout);
    return await download_images(images);
}

async function get_images_src(timeout) {

    /*
    Função para ser executada no método "evaluate". Esta função retorna
    o atributo "src" de todas as imagens de um perfil do Instagram.
    */

    let images = [];
    let time = 0;
    let height = 0;

    // Executa enquanto novas imagens forem carregadas dentro de um certo timeout.
    while (time < timeout / 100) {

        // Rola a página para o fim.
        window.scrollTo(0, document.body.scrollHeight);

        // Realiza uma espera.
        await new Promise(resolve => setTimeout(resolve, 100));
        time++;

        // Verifica se novas imagens foram carregadas.
        if (height != document.body.scrollHeight) {
            height = document.body.scrollHeight;
            time = 0;
        }

        // Atualiza o array com novas imagens.
        document.querySelectorAll(".KL4Bh > img").forEach((image) => {

            // Verifica se a imagem existe ou não no array.
            if (images.indexOf(image.src) == -1 && image.src) {
                images.push(image.src);
            } 
        });
    }

    return images;
}

module.exports = get_images_from_instagram;