import UI from './ui.js';
import { buscarDadosJogador, buscarOuCriarProgresso, salvarProgressoNuvem, buscarEnigmasNuvem } from './db.js';

let estadoJogo = {
    nickname: '',
    telaAtual: 'login',
    enigmas: [],
    indiceAtual: 0,
    modalAberto: false,
    pendenteConfirmacaoNick: null
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
        .replace(/\s*\(\s*/g, '(')         .replace(/\s*\)\s*/g, ')')
        .replace(/\s+/g, ' ')          
        .toLowerCase();
}

async function carregarEnigmas() {
    let dadosNuvem = await buscarEnigmasNuvem();
    if (dadosNuvem && dadosNuvem.length > 0) {
        estadoJogo.enigmas = dadosNuvem;
    } else {
        try {
            const resposta = await fetch('enigmas.json');
            estadoJogo.enigmas = await resposta.json();
        } catch (erro) {
            console.error("Erro ao carregar enigmas locais.", erro);
        }
    }

    UI.menuProgress.textContent = `${estadoJogo.indiceAtual}/${estadoJogo.enigmas.length}`;
}

function iniciarJogo() {
    if (estadoJogo.enigmas.length === 0) {
        UI.abrirModal("[ ERRO ]", "Nenhum enigma foi encontrado.", "erro");
        estadoJogo.modalAberto = true;
        return;
    }
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

    let acertou = false;

    if (enigmaAtual.tipo === 'engenharia_reversa') {
        acertou = validarEngenhariaReversa(entrada, enigmaAtual);
    } else if (enigmaAtual.tipo === 'reconstrucao') {
        acertou = validarReconstrucao(entrada, enigmaAtual.resposta_correta);
    } else {
        const respUsuario = normalizarResposta(entrada);
        const respCorreta = normalizarResposta(enigmaAtual.resposta_correta);
        acertou = (respUsuario === respCorreta); 
    }

    if (acertou) {
        estadoJogo.indiceAtual++;

        localStorage.setItem('cyberquest_fase', estadoJogo.indiceAtual);

        if (typeof salvarProgressoNuvem === 'function') {
            salvarProgressoNuvem(estadoJogo.nickname, estadoJogo.indiceAtual);
        }

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

function validarEngenhariaReversa(operadorDigitado, enigma) {
    const op = operadorDigitado.trim();

    if (op === enigma.resposta_correta.trim()) return true;

    if (!enigma.dados_teste || !enigma.codigo_python) return false;

    try {
        for (let teste of enigma.dados_teste) {
            const expressaoBase = enigma.codigo_python.split('=')[1] || enigma.codigo_python;

            const expressaoCalculada = expressaoBase
                .replace('_____', op)
                .replace(/\bx\b/g, teste.entrada);

            const resultado = Function(`"use strict"; return (${expressaoCalculada})`)();

            if (resultado !== teste.saida) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

function validarReconstrucao(sequenciaDigitada, respostaCorreta) {
    if (!sequenciaDigitada) return false;

    const apenasNumerosUser = sequenciaDigitada.replace(/\D/g, '');
    const apenasNumerosCorreto = respostaCorreta.replace(/\D/g, '');

    return apenasNumerosUser === apenasNumerosCorreto;
}

async function efetivarLogin(nick, fase) {
    estadoJogo.nickname = nick;
    estadoJogo.indiceAtual = fase || 0;
    
    localStorage.setItem('cyberquest_nickname', nick);
    localStorage.setItem('cyberquest_fase', estadoJogo.indiceAtual);
    
    UI.fecharNicknameModal();
    estadoJogo.telaAtual = 'menu';
    UI.menuProgress.textContent = `${estadoJogo.indiceAtual}/${estadoJogo.enigmas.length}`;
    UI.mostrarMenu();
}

if (UI.nicknameInput) {
    UI.nicknameInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            
            const nickDigitado = UI.nicknameInput.value.trim();

            if (estadoJogo.pendenteConfirmacaoNick) {
                const { nick: nickSalvo, fase } = estadoJogo.pendenteConfirmacaoNick;

                if (!nickDigitado || nickDigitado.toLowerCase() === nickSalvo.toLowerCase()) {
                    estadoJogo.pendenteConfirmacaoNick = null;
                    efetivarLogin(nickSalvo, fase);
                    return;
                }

                estadoJogo.pendenteConfirmacaoNick = null;
            }

            if (!nickDigitado) return;

            const dadosExistentes = await buscarDadosJogador(nickDigitado);

            if (dadosExistentes) {
                estadoJogo.pendenteConfirmacaoNick = { nick: dadosExistentes.nickname, fase: dadosExistentes.fase_atual };
                
                const instrucao = document.querySelector('#nickname-modal p') || document.querySelector('#nickname-instrucao');
                if (instrucao) {
                    instrucao.innerHTML = `<span style="color: #ffaa00;">[!] O nick "${dadosExistentes.nickname}" já existe (Fase ${dadosExistentes.fase_atual}).</span><br>Pressione <b>ENTER</b> para carregar ou digite um novo nome acima:`;
                }
                
                UI.focarNicknameInput();
                return;
            }

            const novoProgresso = await buscarOuCriarProgresso(nickDigitado);
            efetivarLogin(nickDigitado, novoProgresso ? novoProgresso.fase_atual : 0);
        }
    });
}

UI.terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();

        if (estadoJogo.modalAberto) {
            UI.fecharModal();
            estadoJogo.modalAberto = false;
            UI.limparInput();

            if (estadoJogo.telaAtual === 'jogo') {
                exibirEnigmaAtual();
            }
            return;
        }

        const inputBruto = UI.terminalInput.value;
        const comando = inputBruto.trim();

        if (estadoJogo.telaAtual === 'menu') {
            if (comando === '1') {
                iniciarJogo();
            } else if (comando === '2') {
                UI.abrirModal("[ COMO JOGAR ]", "Analise o código Python, preveja o resultado e digite sua resposta no prompt. Digite 'dica' se precisar de ajuda.", "info");
                estadoJogo.modalAberto = true;
            } else if (comando === '3') {
                UI.abrirModal("[ SOBRE ]", "CyberQuest v1.0 - Plataforma Interativa de Programação Python.", "info");
                estadoJogo.modalAberto = true;
            } else if (comando === '4' || comando.toLowerCase() === 'sair') {
                localStorage.removeItem('cyberquest_nickname');
                localStorage.removeItem('cyberquest_fase');
                
                estadoJogo.nickname = '';
                estadoJogo.indiceAtual = 0;
                estadoJogo.telaAtual = 'login';
                
                UI.limparInput();
                if (typeof UI.abrirNicknameModal === 'function') {
                    UI.abrirNicknameModal();
                }
            } else {
                UI.abrirModal("[ AVISO ]", "Opção inválida. Digite 1 (Jogar), 2 (Ajuda), 3 (Sobre) ou 4 (Trocar Nick).", "erro");
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
            } else {
                UI.abrirModal("[ AVISO ]", "Opção inválida. Digite 1 para voltar ao menu ou 2 para o próximo nível.", "erro");
                estadoJogo.modalAberto = true;
            }
        }

        UI.limparInput();
    }
});

window.onload = async () => {
    await carregarEnigmas();

    const nickSalvo = localStorage.getItem('cyberquest_nickname');
    const faseSalva = localStorage.getItem('cyberquest_fase');

    if (nickSalvo) {
        estadoJogo.nickname = nickSalvo;
        estadoJogo.indiceAtual = faseSalva ? parseInt(faseSalva, 10) : 0;
        estadoJogo.telaAtual = 'menu';

        if (typeof UI.fecharNicknameModal === 'function') {
            UI.fecharNicknameModal();
        }
        UI.menuProgress.textContent = `${estadoJogo.indiceAtual}/${estadoJogo.enigmas.length}`;
        UI.mostrarMenu();
        console.log(`[SESSÃO RESTAURADA] Usuário: ${nickSalvo} | Fase: ${estadoJogo.indiceAtual}`);
    } else {
        estadoJogo.telaAtual = 'login';
        if (typeof UI.abrirNicknameModal === 'function') {
            UI.abrirNicknameModal();
        } else {
            UI.mostrarMenu();
        }
    }
};