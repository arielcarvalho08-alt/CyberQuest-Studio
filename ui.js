/**
 * Módulo da Interface (UI)
 */

const enigmaContainer = document.getElementById('enigma-container');
const enigmaTitulo = document.getElementById('enigma-titulo');
const enigmaTipo = document.getElementById('enigma-tipo');
const enigmaEnunciado = document.getElementById('enigma-enunciado');
const enigmaCodigo = document.getElementById('enigma-codigo');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

/**
 * Exibe um enigma na tela e formata a tag do minijogo
 * @param {Object} enigmaObjeto - Objeto contendo os detalhes do enigma
 */
function renderizarEnigma(enigmaObjeto) {
    if (!enigmaObjeto) return;

    enigmaContainer.classList.remove('hidden');
    enigmaTitulo.textContent = enigmaObjeto.titulo;
    enigmaEnunciado.textContent = enigmaObjeto.enunciado;
    enigmaCodigo.textContent = enigmaObjeto.codigo_python;

    // Formatação amigável das tags dos 3 minijogos
    if (enigmaTipo) {
        if (enigmaObjeto.tipo === 'preencher_lacuna') {
            enigmaTipo.textContent = "Lacuna";
        } else if (enigmaObjeto.tipo === 'caca_ao_bug') {
            enigmaTipo.textContent = "Caça-Bug";
        } else if (enigmaObjeto.tipo === 'prever_saida') {
            enigmaTipo.textContent = "Output";
        } else {
            enigmaTipo.textContent = enigmaObjeto.tipo || "Desafio";
        }
    }
}

/**
 * Oculta o card do enigma ao finalizar o jogo
 */
function esconderEnigma() {
    if (enigmaContainer) {
        enigmaContainer.classList.add('hidden');
    }
}

/**
 * Adiciona uma mensagem formatada ao terminal
 * @param {string} texto - Mensagem a ser exibida
 * @param {string} tipo - Tipo da mensagem (info, sucesso, erro)
 */
function adicionarLog(texto, tipo = 'info') {
    const logDiv = document.createElement('div');
    logDiv.classList.add('log-entry');

    if (tipo === 'sucesso') logDiv.classList.add('log-success');
    if (tipo === 'erro') logDiv.classList.add('log-error');
    if (tipo === 'info') logDiv.classList.add('log-info');

    logDiv.textContent = `> ${texto}`;
    terminalOutput.appendChild(logDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

/**
 * Limpa o campo de entrada do prompt
 */
function limparPrompt() {
    terminalInput.value = '';
}

// Mantém o foco no input sempre que clicar na tela
document.addEventListener('click', () => {
    if (terminalInput) {
        terminalInput.focus();
    }
});