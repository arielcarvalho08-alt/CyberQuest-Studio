import{ buscarOuCriarProgresso, salvarProgressoNuvem, buscarEnigmaNuvem} from './db.js';

let estadoJogo = {
    nickname: '',
    telaAtual: 'login',
    enigmas: [],
    indiceAtual: 0,
    modalAberto: false
};

function normalizarResposta(str) {
    if (str === null || str === undefined) return "";
    return str
        .toString()
        .trim()
        .replace(/["']/g, "'")          
        .replace(/\s*,\s*/g, ', ')      
        .replace(/\s*==\s*/g, ' == ')  
        .replace(/\s*=\s*/g, ' = ')     
        .replace(/\s*\(\s*/g, '(')      
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s+/g, ' ')          
        .toLowerCase();
}

async function carregarEnigmas() {
    let dadosNuvem = await buscarEnigmasNuvem();
    if (dadosNuvem && dadosNuvem.length > 0){
        estadoJogo.enigmas = dadosNuvem;
    } else {
        try{
            const resposta = await fetch('enigmas.json');
            estadoJogo.enigmas = await resposta.json();
        } catch (erro){
            console.error("Erro ao carregar enigmas locais.", erro);
        }
    }
    UI.menuProgress.textContent = `0/${estadoJogo.enigmas.lenght}`;
}

function iniciarJogo() {
    if (estadoJogo.enigmas.length === 0) {
        UI.abrirModal("[ ERRO ]", "Nenhum enigma foi encontrado no arquivo JSON.", "erro");
        estadoJogo.modalAberto = true;
        return;
    }
    estadoJogo.indiceAtual = 0;
    estadoJogo.telaAtual = 'jogo';
    UI.mostrarJogo();
    exibirEnigmaAtual();
}

function exibirEnigmaAtual() {
    const enigma = estadoJogo.enigmas[estadoJogo.indiceAtual];
    UI.carregarEnigma(enigma, estadoJogo.indiceAtual, estadoJogo.enigmas.length);
}

function processarResposta(respostaDigitada) {
    const enigmaAtual = estadoJogo.enigmas[estadoJogo.indiceAtual];
    const entrada = respostaDigitada.trim();

    if (entrada.toLowerCase() === 'dica') {
        UI.abrirModal("[ DICA ]", enigmaAtual.dica || "Não há dica disponível para este enigma.", "info");
        estadoJogo.modalAberto = true;
        return;
    }

    const respUsuario = normalizarResposta(entrada);
    const respCorreta = normalizarResposta(enigmaAtual.resposta_correta);

    if (respUsuario === respCorreta) {
        estadoJogo.indiceAtual++;

        salvarProgressoNuvem(estadoJogo.nickname, estadoJogo.indiceAtual);

        if (estadoJogo.indiceAtual < estadoJogo.enigmas.length) {
            UI.abrirModal("[ CORRETO ]", "Acesso concedido! Pressione ENTER para avançar.", "sucesso");
            estadoJogo.modalAberto = true;
        } else {
            estadoJogo.telaAtual = 'conclusao';
            const total = estadoJogo.enigmas.length;
            UI.mostrarConclusao("Iniciante", `${total}/${total}`);
        }
    } else {
        UI.abrirModal("[ INCORRETO ]", "Resposta incorreta! Tente novamente ou digite 'dica'.", "erro");
        estadoJogo.modalAberto = true;
    }
}

UI.terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const nick = UI.nicknameInput.value.trim();
        if(!nick) return;

        estadoJogo.nickname = nick;
        
        const progresso = await buscarOuCriarProgresso(nick);
        if(progresso){
            estadoJogo.indiceAtual = progresso.fase_atual || 0;
        }
        UI.fecharNicknameModal();
        estadoJogo.telaAtual = 'menu';
        UI.mostrarMenu();
    }
});

UI.terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const inputBruto = UI.terminalInput.value;

        if (estadoJogo.modalAberto) {
            UI.fecharModal();
            estadoJogo.modalAberto = false;
            UI.limparInput();

            if (estadoJogo.telaAtual === 'jogo') {
                exibirEnigmaAtual();
            }
            return;
        }

        const comando = inputBruto.trim();

        // Roteamento por tela
        if (estadoJogo.telaAtual === 'menu') {
            if (comando === '1') {
                iniciarJogo();
            } else if (comando === '2') {
                UI.abrirModal("[ COMO JOGAR ]", "Analise o código Python, preveja o resultado e digite sua resposta no prompt. Digite 'dica' se precisar de ajuda.", "info");
                estadoJogo.modalAberto = true;
            } else if (comando === '3') {
                UI.abrirModal("[ SOBRE ]", "CyberQuest v1.0 - Plataforma Interativa de Programação Python.", "info");
                estadoJogo.modalAberto = true;
            } else {
                UI.abrirModal("[ AVISO ]", "Opção inválida. Digite 1, 2 ou 3.", "erro");
                estadoJogo.modalAberto = true;
            }
        } else if (estadoJogo.telaAtual === 'jogo') {
            if (comando !== "") {
                processarResposta(comando);
            }
        } else if (estadoJogo.telaAtual === 'conclusao') {
            if (comando === '1') {
                estadoJogo.telaAtual = 'menu';
                UI.mostrarMenu();
            } else if (comando === '2') {
                UI.abrirModal("[ BLOQUEADO ]", "O próximo nível ainda está em desenvolvimento!", "info");
                estadoJogo.modalAberto = true;
            }
        }

        UI.limparInput();
    }
});

window.onload = () => {
    carregarEnigmas();
    UI.mostrarMenu();
};