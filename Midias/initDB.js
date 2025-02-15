const fullServerURL = String(window.location.href);
const serverFilterdURL = String(fullServerURL.substring(0, getSubstringPosition(fullServerURL, '/', 3)));
const relativePathWolfJSON = "/Midias/lobinhos.json";

const databaseURL = "http://localhost:3000/";
const wolvesListName = "wolves";

const wolvesURLPath = databaseURL + wolvesListName;
const currentWolfURLPath = databaseURL + "currentWolfSelected";

function getSubstringPosition(string, subString, nth_occur) {
    return string.split(subString, nth_occur).join(subString).length;
}

async function loadWolvesDB() {
    try {
        /* ----- DELETANDO OS POSSÍVEIS DADOS REMANESCENTES DE EXECUÇÕES PRÉVIAS ----- */
        
        const previousWolfDataResponse = await fetch(wolvesURLPath);
        const previousWolfData = await previousWolfDataResponse.json();
        
        for (let wolf of previousWolfData) {
            // Necessário utilizar await para
            // evitar conflitos de remoção:
            await fetch(wolvesURLPath + `/${wolf.id}`, { method: "DELETE" });
        }
        
        /* ---------------------------- LIMPEZA CONCLUÍDA ---------------------------- */
        
        /* --------------------------- POVOANDO O DATABASE --------------------------- */
        
        const response = await fetch(serverFilterdURL + relativePathWolfJSON);
        if (!response.ok) {
            throw new Error(`Erro ao carregar lobinho.json: ${response.statusText}`);
        }
        
        // Captura o JSON dos lobos:
        const wolvesJSONList = await response.json();

        for (let wolf of wolvesJSONList) {
            // Necessário utilizar await para
            // evitar conflitos de inserção:
            await fetch(wolvesURLPath, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(wolf)
            });
        };

        /* ---------------------------- DATABASE POVOADO ---------------------------- */

        console.log('Lobos inicializados no Database.');
    } catch (error) {
        console.error('Erro ao inicializar o Database:', error);
    } finally {
        console.log('Tentativa de inicialização do Database concluída.');
    }
}

/* Descomente a Chamada de Função Abaixo caso Deseje Reiniciar o Database, mas
   Aviso de Antemão que Demora um Pouco...  */ 

// loadWolvesDB();

export { wolvesURLPath, currentWolfURLPath };
