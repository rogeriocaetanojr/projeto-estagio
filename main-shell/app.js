/**
 * app.js
 * Ponto de entrada do Application Shell
 */

/**
 * Função global para carregar Micro-Frontends sob demanda
 * Atribuímos ao window para ser acessível pelos eventos onclick no HTML
 * 
 * @param {string} mfeName Nome do micro-frontend para controle
 * @param {string} bundleUrl URL do bundle do micro-frontend (Web Component)
 * @param {string} elementTag Tag customizada do Web Component (ex: 'community-mfe')
 */
window.loadMicroFrontend = async (mfeName, bundleUrl, elementTag) => {
    const viewport = document.getElementById('app-viewport');
    
    // Indicador visual de carregamento
    viewport.innerHTML = '<div class="loading">Carregando módulo...</div>';

    try {
        // Importação Dinâmica (Dynamic Import) do bundle JS do Micro-Frontend
        // Isso carrega e executa o código que registra o Web Component no navegador
        await import(bundleUrl);

        // Limpa o viewport e injeta a tag do Web Component recém-registrado
        viewport.innerHTML = '';
        const mfeElement = document.createElement(elementTag);
        viewport.appendChild(mfeElement);

    } catch (error) {
        console.error(`Erro ao carregar o micro-frontend ${mfeName}:`, error);
        viewport.innerHTML = `
            <div class="error-message">
                <h3>Falha ao carregar o módulo ${mfeName}</h3>
                <p>Verifique se o serviço está em execução na URL: ${bundleUrl}</p>
                <p>Detalhe: ${error.message}</p>
            </div>
        `;
    }
};
