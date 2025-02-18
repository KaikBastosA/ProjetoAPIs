import { wolvesURLPath, currentWolfURLPath } from "../Midias/initDB.js"

async function getLastWolfClicked() {
    const lastWolfClickedPromise = await fetch(currentWolfURLPath);
    return (await lastWolfClickedPromise.json())[0];
}

async function replaceWolfInformations() {
    // Obtém o Último Lobo Clicado:
    const lastWolfClicked = await getLastWolfClicked();

    // Substitui as Informações do Lobo:
    const wolfImage = document.querySelector('#img-lobo');
    wolfImage.src = lastWolfClicked.imagem;
    
    const wolfName = document.querySelector('#nome-lobo');
    wolfName.innerText = lastWolfClicked.nome;
    
    const wolfDesc = document.querySelector('#desc-lobo');
    wolfDesc.innerText = lastWolfClicked.descricao;
}

document.addEventListener("DOMContentLoaded", () => {
    replaceWolfInformations();
    
    // ----------------------------------------------------------- //
    
    document.querySelector("#excluir-lobo").addEventListener("click", async (event) => {
        // Evita que a Página Recarregue até que
        // a Requisição de Exclusão seja Concluída:
        event.preventDefault();
    
        // Obtém o Último Lobo Clicado:
        const lastWolfClicked = await getLastWolfClicked();
    
        // Deleta o Lobo Selecionado do Banco de Dados:
        await fetch(wolvesURLPath + `/${lastWolfClicked.id}`, { method: "DELETE" });
    
        // Redireciona Manualmente o Usuário para a Página de Lista de Lobos:
        window.location.replace("../ListaLobo/lista.html");
    });

    document.querySelector("#adotar-lobo").addEventListener("click", async (event) => {
        // Evita que a Página Recarregue até que
        // a Requisição de Exclusão seja Concluída:
        event.preventDefault();

        // Obtém o Último Lobo Clicado:
        const lastWolfClicked = await getLastWolfClicked();

        // Verifica se o Lobo está Apto para Adoção:
        if (lastWolfClicked.adotado === false) window.location.replace("../AdotarLobo/adotar.html")
        else alert("Este Lobinho já foi Adotado!!!");
    });
});