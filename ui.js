/**
 * Modulo da interface (UI)
 */

const enigmaContainer = document.getElementById('enigma-container');
const enigmaTitulo = document.getElementById('enigma-titulo');
const enigmaEnunciado = document.getElementById('enigma-enunciado');
const enigmaCodigo = document.getElementById('enigma-codigo');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

/**
 * Exibe um enigma na tela
 * @param {Object} enigma - Objeto contendo os detalhes do enigma
 */

function renderizarEnigma(enigmaObjeto) {
    if (!enigmaObjeto) return;

    enigmaContainer.classList.remove('hidden');
    enigmaTitulo.textContent = enigmaObjeto.titulo;
    enigmaEnunciado.textContent = enigmaObjeto.enunciado;
    enigmaCodigo.textContent = enigmaObjeto.codigo_python;
}

/**
 * @param {string} mensagem - Mensagem a ser exibida
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

function limparPrompt() {
    terminalInput.value = '';
}

document.addEventListener('click', () => {
    terminalInput.focus();
});
