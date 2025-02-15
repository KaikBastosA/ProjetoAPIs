import { wolvesURLPath } from "../Midias/initDB.js"

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".form-container").addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const formDataIterator = formData.entries();

        const newIDPromise = await fetch(`${wolvesURLPath}?_per_page=1&_page=1`);
        const newID = (await newIDPromise.json()).items + 1;

        const newWolf = {};

        newWolf.id = new String(newID);
        newWolf.nome = formDataIterator.next().value[1];
        newWolf.idade = formDataIterator.next().value[1];
        newWolf.imagem = formDataIterator.next().value[1];
        newWolf.descricao = formDataIterator.next().value[1];
        newWolf.adotado = false;
        newWolf.nomeDono = null;
        newWolf.idadeDono = null;
        newWolf.emailDono = null;

        fetch(wolvesURLPath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newWolf)
        });

        alert("Lobinho Criado!");
    });
})
