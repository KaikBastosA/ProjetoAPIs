import { wolvesURLPath, currentWolfURLPath } from "../Midias/initDB.js";

const pageOffset = 2;
const numberOfWolvesPerPage = 4;

async function getCurrentWolves() {
    const returnArray = [];
    let maxNumberPages;

    const userSearch = sessionStorage.getItem('currentUserSearch')?.toLowerCase();
    const adoptedFlag = `?adotado=${sessionStorage.getItem('checked') === 'true' ? 'true' : 'false'}`;

    const currentPageNumber = Number(sessionStorage.getItem('currentUserPage'));

    if (userSearch) {
        const wolfArrayPromise = await fetch(wolvesURLPath + adoptedFlag);

        let wolfArray = await wolfArrayPromise.json();
        wolfArray = wolfArray.filter(elem => elem.nome.toLowerCase().startsWith(userSearch));
        maxNumberPages = Math.max(1, Math.ceil(wolfArray.length / numberOfWolvesPerPage));

        let pageOffset = currentPageNumber - 1;
        for (let index = 0; index < numberOfWolvesPerPage; index++) {
            let currentWolf = wolfArray[pageOffset * numberOfWolvesPerPage + index];

            if (currentWolf === undefined) break;

            returnArray.push(currentWolf);
        }

    } else {
        const qtyPerPage = `&_per_page=${numberOfWolvesPerPage}`;
        const pgNumber = `&_page=${currentPageNumber}`;

        const wolfArrayPromise = await fetch(wolvesURLPath + adoptedFlag + qtyPerPage + pgNumber);
        const wolfArrayObject = await wolfArrayPromise.json();

        maxNumberPages = wolfArrayObject.pages;

        const wolfArray = wolfArrayObject.data;
        wolfArray.forEach(wolf => returnArray.push(wolf));
    }

    return { maxNumberPages, returnArray };
}

function saveToggleFilterCheckbox() {
    const checked = document.querySelector(".wolf-filter").checked;
    sessionStorage.setItem('checked', checked);
    sessionStorage.setItem('currentUserPage', 1);

    return;
}

function clearFilters() {
    sessionStorage.removeItem('currentUserSearch');
    sessionStorage.removeItem('checked');
    sessionStorage.setItem('currentUserPage', 1);
}


async function loadWolfPosts() {
    const userSearch = sessionStorage.getItem('currentUserSearch');
    if (userSearch) {
        const wolfSearchBar = document.querySelector('#wolf-search-bar');
        wolfSearchBar.value = userSearch;
    }

    const wolfsPostContainer = document.querySelector(".wolf-posts-container");

    const currentWolfData = await getCurrentWolves();
    wolfsPostContainer.innerHTML = "";
    for (let wolf of currentWolfData.returnArray) {
        wolfsPostContainer.append(await createWolfArticle(wolf));
    }

    document.querySelector(".pagination-section")?.remove();

    document.querySelector("main").append(createPaginationBar(currentWolfData.maxNumberPages));

    return;
}


async function wolfListMain() {
    let wolfFilter = document.querySelector(".wolf-filter");
    if (!wolfFilter) return;

    if (!sessionStorage.getItem('currentUserPage')) sessionStorage.setItem('currentUserPage', 1);

    let filterFlag = sessionStorage.getItem('checked');
    if (!filterFlag) {
        filterFlag = "false";
        sessionStorage.setItem('checked', false);
    }

    wolfFilter.checked = filterFlag === "true" ? true : false;
    await loadWolfPosts();
}


async function saveWolfObject(wolfArticle) {
    const wolfPostsContainer = document.querySelector(".wolf-posts-container").children;
    const currentWolfArray = (await getCurrentWolves()).returnArray;

    for (let index = 0; index < wolfPostsContainer.length; index++) {
        if (wolfPostsContainer[index] == wolfArticle) {
            const lastWolfClickedPromise = await fetch(currentWolfURLPath);
            const lastWolfClicked = await lastWolfClickedPromise.json();
            if (lastWolfClicked.length !== 0)
                await fetch(currentWolfURLPath + `/${lastWolfClicked[0].id}`, { method: "DELETE" });

            await fetch(currentWolfURLPath, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentWolfArray[index])
            });

            break;
        }
    }
}


async function createWolfArticle({ nome, idade, descricao, imagem, adotado, nomeDono }) {
    const wolfArticle = document.createElement("article");
    wolfArticle.classList.add("wolf-post");

    const wolfLink = "../ShowLobo/show.html";

    const wolfImageContainer = document.createElement("div");
    wolfImageContainer.classList.add("wolf-image-container");

    const backgroundWolfImage = document.createElement("div");
    backgroundWolfImage.classList.add("background-wolf-image");
    wolfImageContainer.append(backgroundWolfImage);

    const wolfPageLink = document.createElement("a");
    wolfPageLink.href = wolfLink;
    wolfPageLink.addEventListener("click", async (event) => {
        event.preventDefault();
        let articleClicked = event.target.parentNode.parentNode.parentNode;
        await saveWolfObject(articleClicked);
        window.location.href = wolfLink;
    });

    const wolfImage = document.createElement("img");
    wolfImage.src = imagem;
    wolfImage.alt = "Imagem de perfil do lobinho";

    wolfPageLink.append(wolfImage);

    wolfImageContainer.append(wolfPageLink);

    wolfArticle.append(wolfImageContainer);

    const wolfInformationBox = document.createElement("div");
    wolfInformationBox.classList.add("wolf-information-box");

    const wolfTitleBox = document.createElement("div");
    wolfTitleBox.classList.add("wolf-title-box");

    const wolfNameBox = document.createElement("div");
    wolfNameBox.classList.add("wolf-name-box");

    const wolfPageLink_2 = document.createElement("a");
    wolfPageLink_2.href = wolfLink;

    wolfPageLink_2.addEventListener("click", async (event) => {
        event.preventDefault();
        let articleClicked = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        await saveWolfObject(articleClicked);
        window.location.href = wolfLink;
    });

    const wolfName = document.createElement("h2");
    wolfName.classList.add("wolf-name");
    wolfName.innerText = nome;

    wolfPageLink_2.append(wolfName);

    wolfNameBox.append(wolfPageLink_2);

    const wolfAge = document.createElement("p");
    wolfAge.innerText = `Idade: ${idade} anos`;

    wolfNameBox.append(wolfAge);

    wolfTitleBox.append(wolfNameBox);

    const adoptButtonLink = document.createElement("a");
    adoptButtonLink.href = wolfLink;
    adoptButtonLink.classList.add("adopt-link");

    adoptButtonLink.addEventListener("click", async (event) => {
        event.preventDefault();
        let articleClicked = event.target.parentElement.parentElement.parentElement.parentElement;
        await saveWolfObject(articleClicked);
        window.location.href = wolfLink;
    });

    const adoptButton = document.createElement("button");
    adoptButton.classList.add("adopt-button");
    adoptButton.classList.add(adotado ? "adopted" : "adopt");
    adoptButton.innerText = adotado ? "Adotado" : "Adotar";

    adoptButtonLink.append(adoptButton);

    wolfTitleBox.append(adoptButtonLink);

    wolfInformationBox.append(wolfTitleBox);


    const wolfInfo = document.createElement("div");
    wolfInfo.classList.add("wolf-info");

    const wolfDescription = document.createElement("p");
    wolfDescription.classList.add("wolf-description");
    wolfDescription.innerText = descricao;

    wolfInfo.append(wolfDescription);

    if (nomeDono !== null) {
        const adopterName = document.createElement("p");
        adopterName.classList.add("adopter-name");
        adopterName.innerText = `Adotado por: ${nomeDono}`;

        wolfInfo.append(adopterName);
    }

    wolfInformationBox.append(wolfInfo);

    wolfArticle.append(wolfInformationBox);

    return wolfArticle;
}


function createPaginationBar(maxNumberPages) {
    const currentUserPage = Number(sessionStorage.getItem('currentUserPage'));

    const minPageNumber = Math.max(1, currentUserPage - pageOffset);
    const maxPageNumber = Math.min(maxNumberPages, currentUserPage + pageOffset);

    const paginationSection = document.createElement("section");
    paginationSection.classList.add("pagination-section");

    if (maxNumberPages < currentUserPage) {
        let currentPageNumber = document.createElement("a");
        currentPageNumber.draggable = false;
        currentPageNumber.href = "./lista.html";
        currentPageNumber.classList.add("page-number-link");
        currentPageNumber.addEventListener("click", (event) => {
            event.preventDefault();
        });

        currentPageNumber.innerText = "1";
        paginationSection.append(currentPageNumber);

        sessionStorage.setItem('currentUserPage', 1);

        return paginationSection;
    }

    if (currentUserPage > 1) {
        const leftPageShift = document.createElement("a");
        leftPageShift.draggable = false;
        leftPageShift.href = "./lista.html";
        leftPageShift.classList.add("page-number-link");
        leftPageShift.innerText = "<<";
        leftPageShift.addEventListener("click", () => {
            sessionStorage.setItem('currentUserPage', Math.max(1, currentUserPage - 1));
        });

        paginationSection.append(leftPageShift);
    }

    if (minPageNumber > 1) {
        const leftEllipsis = document.createElement("a");
        leftEllipsis.draggable = false;
        leftEllipsis.href = "./lista.html";
        leftEllipsis.classList.add("page-number-link");
        leftEllipsis.addEventListener("click", () => {
            sessionStorage.setItem('currentUserPage', 1);
        });

        leftEllipsis.innerText = "...";

        paginationSection.append(leftEllipsis);
    }

    for (let pag = minPageNumber; pag <= maxPageNumber; pag++) {
        let currentPageNumber = document.createElement("a");
        currentPageNumber.draggable = false;
        currentPageNumber.href = "./lista.html";
        currentPageNumber.classList.add("page-number-link");


        if (currentUserPage === pag) currentPageNumber.classList.add("current-page");

        currentPageNumber.innerText = pag;
        currentPageNumber.addEventListener("click", (event) => {
            if (currentUserPage === pag) event.preventDefault();
            sessionStorage.setItem('currentUserPage', event.target.innerText);
        });

        paginationSection.append(currentPageNumber);
    }

    if (maxPageNumber < maxNumberPages) {
        const rightEllipsis = document.createElement("a");
        rightEllipsis.draggable = false;
        rightEllipsis.href = "./lista.html";
        rightEllipsis.classList.add("page-number-link");
        rightEllipsis.addEventListener("click", () => {
            sessionStorage.setItem('currentUserPage', maxNumberPages);
        });

        rightEllipsis.innerText = "...";

        paginationSection.append(rightEllipsis);
    }
    if (currentUserPage < maxNumberPages) {
        const rightPageShift = document.createElement("a");
        rightPageShift.draggable = false;
        rightPageShift.href = "./lista.html";
        rightPageShift.classList.add("page-number-link");
        rightPageShift.innerText = ">>";
        rightPageShift.addEventListener("click", () => {
            sessionStorage.setItem('currentUserPage', Math.min(maxNumberPages, currentUserPage + 1));
        });
        paginationSection.append(rightPageShift);
    }

    return paginationSection;
}

document.addEventListener("DOMContentLoaded", () => {

    wolfListMain();

    document.querySelector(".wolf-filter")?.addEventListener("click", async () => {
        saveToggleFilterCheckbox();
        await loadWolfPosts();
    });


    document.querySelector("#wolf-search-bar")?.addEventListener("keydown", async (event) => {
        if (event.key !== "Enter") return;

        if (event.target.value !== "")
            sessionStorage.setItem('currentUserSearch', event.target.value);
        else
            sessionStorage.removeItem('currentUserSearch');

        sessionStorage.setItem('currentUserPage', 1);

        await loadWolfPosts();
    });


    document.querySelector(".wolf-search-link")?.addEventListener("click", async () => {
        const searchBarValue = document.querySelector("#wolf-search-bar").value;

        if (searchBarValue !== "")
            sessionStorage.setItem('currentUserSearch', searchBarValue);
        else
            sessionStorage.removeItem('currentUserSearch');

        sessionStorage.setItem('currentUserPage', 1);

        await loadWolfPosts();
    });
})


export { clearFilters };