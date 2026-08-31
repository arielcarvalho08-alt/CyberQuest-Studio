/**
 * Motor de Execução e Validação de Lógica - CyberQuest (Sprint 1)
 */

let estadoJogo = {
    telaAtual: 'menu',
    indiceEnigma: 0
};

let bancoDeEnigmas = [];

const inputPrompt = document.getElementById('terminal-input');
const promptLabel = document.getElementById('prompt-label');

async function carregarJogo() {
    try {
        const res = await fetch('enigmas.json');
        bancoDeEnigmas = await res.json();
    } catch (error) {
        console.error('Erro ao carregar enigmas.json', e);
    }
}

inputPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const valor = inputPrompt.value.trim();
        if (valor!== '') {
            processarEntrada(valor);
            inputPrompt.value = '';
        }
}
});

function processarEntrada(entrada) {
    const comando = entrada.toLowerCase();

    switch (estadoJogo.telaAtual) {
        case 'menu':
            if (comando === '1') {
                iniciarGameplay();
            } else if (comando === '2') {
                exibirInfoMenu("<strong>COMO JOGAR:</strong> Digite [1] para começar. Analise o código Python de cada enigma e digite a resposta exata no prompt para avançar!");
            } else if (comando === '3') {
                exibirInfoMenu("<strong>SOBRE:</strong> CyberQuest Studio - Sistema retrô para prática dos fundamentos da linguagem Python.");
            } else {
                exibirFeedback("Opção inválida! Digite 1, 2 ou 3.", "error");
            }
            break;

        case 'game':
            validarResposta(entrada);
            break;
        
        case 'conclusion':
            if (comando === 'menu') {
                estadoJogo.telaAtual = 'menu';
                estadoJogo.indiceEnigma = 0;
                alternarTela('menu');
                document.getElementById('top-bar').classList.add('hidden');
                promptLabel.textContent = "opcao:>";  
            } else {
                exibirFeedback("Digite [menu] para retornar ao início.", "error");
            }
            break;
        }
    }
function exibirInfoMenu(htmlText) {
    const box = document.getElementById('menu-info-box');
    box.innerHTML = htmlText;
    box.classList.remove('hidden');
 }

function iniciarGameplay() {
    estadoJogo.telaAtual = 'game';
    estadoJogo.indiceEnigma = 0;
    alternarTela('game');
    promptLabel.textContent = "resposta:>";
    carregarEnigma();
 }

function carregarEnigma() {
    const enigma = bancoDeEnigmas[estadoJogo.indiceEnigma];
    if (!enigma) return;

    atualizarTopBar(estadoJogo.indiceEnigma + 1, bancoDeEnigmas.length);
    document.getElementById('enigma-fase-num').textContent = `FASE ${estadoJogo.indiceEnigma + 1}/${bancoDeEnigmas.length}`;

    const tipoFormatado = enigma.tipo ? enigma.tipo.replace('_', ' ').toUpperCase() : 'ENIGMA';
    document.getElementById('enigma-tipo-badge').textContent = tipoFormatado;

    document.getElementById('enigma-titulo').textContent = enigma.titulo || `Enigma ${estadoJogo.indiceEnigma + 1}`;
    document.getElementById('enigma-enunciado').textContent = enigma.enunciado;
    document.getElementById('enigma-codigo').textContent = enigma.codigo_python;
 }

function validarResposta(resposta) {
    const enigma = bancoDeEnigmas[estadoJogo.indiceEnigma];

    if (resposta.trim() === enigma.resposta_correta.trim()) {
        exibirFeedback("[SUCESSO] Resposta correta!", "success");
        inputPrompt.disabled = true;

        setTimeout(() => {
            inputPrompt.disabled = false;
            inputPrompt.focus();
            estadoJogo.indiceEnigma++;

            if (estadoJogo.indiceEnigma < bancoDeEnigmas.length) {
                carregarEnigma();
            } else {
                concluirJogo();
            }
        }, 1200);
    } else {
        exibirFeedback("[ERRO] Resposta incorreta! Tente novamente.", "error");
    }
}

function concluirJogo() {
    estadoJogo.telaAtual = 'conclusion';
    alternarTela('conclusion');
    promptLabel.textContent = "cyberquest:>";
}

carregarJogo();
