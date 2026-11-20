import UI from './ui.js';
import { SFX } from './ui.js';
import { buscarDadosJogador, buscarOuCriarProgresso, salvarProgressoNuvem, buscarEnigmasNuvem, buscarRankingGlobal } from './db.js';


let estadoJogo = {
    nickname: '',
    avatar: 'masculino',
    telaAtual: 'login',
    moduloAtual: 1,
    modulosDesbloqueados: [1],
    nomeModulos: {
        1: 'Iniciante: Funciona na minha máquina',
        2: 'Intermediário: Gambiarra Provisória',
        3: 'Difícil: Reinicie o PC'
    },
    modoJogo: 'normal',
    enigmas: [],
   
    faseNormal: 1,
    xpNormal: 0,
    xpModulo: 0,
    xpPorModulo: {1: 0, 2: 0, 3: 0},
    xpSessaoTempo: 0,
    xpTempoMax: 0,
    xpGlobal: 0,
    enigmasResolvidosTotal: 0,


    indiceAtual: 0,
    xpFaseAtual: 0,
    combo: 0,
    multiplicador: 1.0,
    tempoRestante: 150,
    intervaloTimer: null,
    dicaUsadaNaFase: false,
    modalAberto: false,
    pendenteConfirmacaoNick: null,
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
        .replace(/\s*\(\s*/g, '(').replace(/\s*\)\s*/g, ')')
        .replace(/\s+/g, ' ')          
        .toLowerCase();
}


function formatarNome(texto) {
    if (!texto) return "";
    return texto
        .toString()
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(palavra => palavra.length > 0)
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}


function embaralharArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


async function carregarEnigmasModulo(moduloNum) {
    const modoAtual = estadoJogo.modoJogo === 'tempo' ? 'tempo' : 'campanha';
    let dadosNuvem = await buscarEnigmasNuvem(moduloNum, modoAtual);
   
    if (dadosNuvem && dadosNuvem.length > 0) {
        estadoJogo.enigmas = dadosNuvem;
    } else {
        try {
            const resposta = await fetch('enigmas.json');
            const todos = await resposta.json();
           
            let filtrados = todos.filter(e => {
                const modoEnigma = e.modo || 'campanha';
                if (modoEnigma !== modoAtual) return false;


                if (moduloNum === 1) return e.nivel === 'facil';
                if (moduloNum === 2) return e.nivel === 'medio';
                if (moduloNum === 3) return e.nivel === 'dificil';
                return true;
            });
           
            estadoJogo.enigmas = filtrados;
        } catch (erro) {
            console.error("Erro ao carregar enigmas.", erro);
            estadoJogo.enigmas = [];
        }
    }
}


function iniciarTemporizadorModulo() {
    pararTemporizador();
    if (estadoJogo.modoJogo !== 'tempo') return;


    estadoJogo.tempoRestante = 150;
    UI.atualizarTimerDisplay(estadoJogo.tempoRestante);


    estadoJogo.intervaloTimer = setInterval(() => {
        estadoJogo.tempoRestante--;
        UI.atualizarTimerDisplay(estadoJogo.tempoRestante);


        if (estadoJogo.tempoRestante <= 0) {
            pararTemporizador();
            gameOverTempoEsgotado();
        }
    }, 1000);
}


function pararTemporizador() {
    if (estadoJogo.intervaloTimer) {
        clearInterval(estadoJogo.intervaloTimer);
        estadoJogo.intervaloTimer = null;
    }
}


async function gameOverTempoEsgotado() {
    estadoJogo.telaAtual = 'menu';
    const xpObtido = estadoJogo.xpSessaoTempo || 0;


    const resumoHtml = `
        <div class="dashboard-container" style="text-align: center;">
            <p>O seu Banco de Tempo esgotou no Modo Contra o Tempo!</p>
            <br>
            <p><strong>Fases Concluídas neste Módulo:</strong> <span class="destaque-amarelo">${estadoJogo.indiceAtual} / ${estadoJogo.enigmas.length}</span></p>
            <p><strong>XP Obtido na Tentativa:</strong> <span class="destaque-verde">+${xpObtido} XP</span></p>
            <br>
            <p style="font-size: 0.9rem; opacity: 0.8; color: #888;">Digite <b style="color: #00ff66;">voltar</b> ou pressione ENTER para retornar ao Menu.</p>
        </div>
    `;


    UI.abrirModal("[ TEMPO ESGOTADO - DERROTA ]", resumoHtml, "erro");
    estadoJogo.modalAberto = true;
}


async function selecionarModulo(numModulo) {
    if (!estadoJogo.modulosDesbloqueados.includes(numModulo)) {
        UI.abrirModal("[ MÓDULO BLOQUEADO ]", "Você precisa concluir os módulos anteriores para liberar este nível!", "erro");
        estadoJogo.modalAberto = true;
        return;
    }


    estadoJogo.moduloAtual = numModulo;
    estadoJogo.telaAtual = 'modos';
    UI.mostrarModosJogo(estadoJogo.nomeModulos[numModulo]);
}


async function iniciarGameplayComModo(modo) {
    estadoJogo.modoJogo = modo;
    estadoJogo.combo = 0;
    estadoJogo.multiplicador = 1.0;
    estadoJogo.dicaUsadaNaFase = false;
    estadoJogo.indiceAtual = 0;
    estadoJogo.xpModulo = 0;


    await carregarEnigmasModulo(estadoJogo.moduloAtual);


    if (!estadoJogo.enigmas || estadoJogo.enigmas.length === 0) {
        UI.abrirModal("[ AVISO ]", "Nenhum enigma encontrado para este módulo.", "erro");
        return;
    }


    if (modo === 'tempo') {
        estadoJogo.enigmas = embaralharArray(estadoJogo.enigmas);
        estadoJogo.xpSessaoTempo = 0;
        estadoJogo.tempoRestante = 150;
        iniciarTemporizadorModulo();
    } else {
        let inicioModulo = (estadoJogo.moduloAtual - 1) * 15;
        let progressoNoModulo = Math.max(0, estadoJogo.faseNormal - 1 - inicioModulo);
       
        if (progressoNoModulo >= 15) {
            UI.abrirModal("[ MÓDULO CONCLUÍDO ]", "Você já concluiu este módulo no Modo Normal!", "sucesso");
            return;
        }
        estadoJogo.indiceAtual = progressoNoModulo;

        estadoJogo.xpModulo = estadoJogo.xpPorModulo[estadoJogo.moduloAtual] || 0;

        if (UI.timerDisplay) UI.timerDisplay.textContent = "";
    }


    estadoJogo.telaAtual = 'jogo';
    UI.mostrarJogo();
    UI.atualizarComboDisplay(estadoJogo.combo, estadoJogo.multiplicador);
    exibirEnigmaAtual();
}


function exibirEnigmaAtual() {
    const enigma = estadoJogo.enigmas[estadoJogo.indiceAtual];
   
    if (!enigma) {
        if (estadoJogo.indiceAtual >= estadoJogo.enigmas.length) {
            exibirConclusao();
        }
        return;
    }


    let pontosBase = estadoJogo.dicaUsadaNaFase ? 20 : 40;
    let bonusTempo = estadoJogo.modoJogo === 'tempo' ? 10 : 0;
    estadoJogo.xpFaseAtual = Math.round((pontosBase + bonusTempo) * estadoJogo.multiplicador);
   
    UI.carregarEnigma(
        enigma,
        estadoJogo.indiceAtual,
        estadoJogo.enigmas.length,
        estadoJogo.nomeModulos[estadoJogo.moduloAtual],
        {
            modoJogo: estadoJogo.modoJogo,
            tempoRestante: estadoJogo.tempoRestante,
            combo: estadoJogo.combo,
            multiplicador: estadoJogo.multiplicador,
            xpFase: estadoJogo.xpFaseAtual,
            totalResolvidos: estadoJogo.enigmasResolvidosTotal
        }
    );
}


function exibirConclusao() {
    pararTemporizador();
    estadoJogo.telaAtual = 'conclusao';
   
    const total = estadoJogo.enigmas.length;
   
    let medalhaInfo = { emoji: "🥉", titulo: "Medalha de Bronze" };
    if (estadoJogo.xpModulo >= 800) {
        medalhaInfo = { emoji: "💎", titulo: "Medalha Hacker Suprema" };
    } else if (estadoJogo.xpModulo >= 600) {
        medalhaInfo = { emoji: "🥇", titulo: "Medalha de Ouro" };
    } else if (estadoJogo.xpModulo >= 350) {
        medalhaInfo = { emoji: "🥈", titulo: "Medalha de Prata" };
    }


    if (estadoJogo.moduloAtual === 1 && !estadoJogo.modulosDesbloqueados.includes(2)) {
        estadoJogo.modulosDesbloqueados.push(2);
    } else if (estadoJogo.moduloAtual === 2 && !estadoJogo.modulosDesbloqueados.includes(3)) {
        estadoJogo.modulosDesbloqueados.push(3);
    }


    UI.mostrarConclusao(
        estadoJogo.nomeModulos[estadoJogo.moduloAtual],
        `${total}/${total}`,
        estadoJogo.xpModulo,
        medalhaInfo
    );
}


async function processarRespostaCorreta() {
    SFX.acerto();
    let pontosBase = estadoJogo.dicaUsadaNaFase ? 20 : 40;
    let bonusTempo = 0;


    if (estadoJogo.modoJogo === 'tempo') {
        bonusTempo = 10;
        estadoJogo.tempoRestante += 5;
    }


    const pontosGanhos = Math.round((pontosBase + bonusTempo) * estadoJogo.multiplicador);
   
    if (estadoJogo.modoJogo === 'tempo') {
        estadoJogo.xpSessaoTempo += pontosGanhos;
        if (estadoJogo.xpSessaoTempo > estadoJogo.xpTempoMax) {
            estadoJogo.xpTempoMax = estadoJogo.xpSessaoTempo;
        }
    } else {
        estadoJogo.xpNormal += pontosGanhos;
        estadoJogo.xpModulo += pontosGanhos;

        if (!estadoJogo.xpPorModulo) estadoJogo.xpPorModulo = {};
        estadoJogo.xpPorModulo[estadoJogo.moduloAtual] = estadoJogo.xpModulo;

        estadoJogo.enigmasResolvidosTotal += 1;
        estadoJogo.faseNormal = Math.max(estadoJogo.faseNormal, estadoJogo.enigmasResolvidosTotal + 1);
    }

    estadoJogo.xpGlobal = estadoJogo.xpNormal + estadoJogo.xpTempoMax;
    estadoJogo.dicaUsadaNaFase = false;


    estadoJogo.combo++;
    if (estadoJogo.combo >= 5) estadoJogo.multiplicador = 2.0;
    else if (estadoJogo.combo >= 3) estadoJogo.multiplicador = 1.5;
    else estadoJogo.multiplicador = 1.0;


    UI.atualizarComboDisplay(estadoJogo.combo, estadoJogo.multiplicador);
    estadoJogo.indiceAtual++;


    await salvarProgressoNuvem({
        nickname: estadoJogo.nickname,
        xpGlobal: estadoJogo.xpGlobal,
        xpNormal: estadoJogo.xpNormal,
        xpTempoMax: estadoJogo.xpTempoMax,
        faseNormal: estadoJogo.faseNormal,
        modulosDesbloqueados: estadoJogo.modulosDesbloqueados,
        xpPorModulo: estadoJogo.xpPorModulo,
        avatar:estadoJogo.avatar
    });


    if (estadoJogo.indiceAtual < estadoJogo.enigmas.length) {
        pararTemporizador();
        UI.abrirModal("[ CORRETO! ]", `Acesso concedido! +${pontosGanhos} XP (Combo ${estadoJogo.combo}x).<br><span style="color:#888; font-size:0.85rem;">Digite <b>voltar</b> a qualquer momento ou pressione ENTER para prosseguir.</span>`, "sucesso");
        estadoJogo.modalAberto = true;
        UI.atualizarExpressaoMascote('acerto', estadoJogo.avatar);
        setTimeout(() => {
        UI.atualizarExpressaoMascote('normal', estadoJogo.avatar);
        }, 4200);
    } else {
        if (estadoJogo.modoJogo === 'tempo') {
            finalizarPartidaTempo();
        } else {
            exibirConclusao();
        }
        UI.atualizarExpressaoMascote('acerto', estadoJogo.avatar);
    }
}


async function processarRespostaErros(respostaDigitada) {
    const entrada = respostaDigitada.trim();


    if (['voltar', 'menu', 'sair'].includes(entrada.toLowerCase())) {
        pararTemporizador();
       
        if (estadoJogo.modoJogo === 'tempo') {
            if (estadoJogo.xpSessaoTempo > estadoJogo.xpTempoMax) {
                estadoJogo.xpTempoMax = estadoJogo.xpSessaoTempo;
            }
            estadoJogo.xpGlobal = estadoJogo.xpNormal + estadoJogo.xpTempoMax;


            await salvarProgressoNuvem({
                nickname: estadoJogo.nickname,
                xpGlobal: estadoJogo.xpGlobal,
                xpNormal: estadoJogo.xpNormal,
                xpTempoMax: estadoJogo.xpTempoMax,
                faseNormal: estadoJogo.faseNormal,
                modulosDesbloqueados: estadoJogo.modulosDesbloqueados,
                avatar: estadoJogo.avatar
            });
            estadoJogo.xpSessaoTempo = 0;
        }


        estadoJogo.modoJogo = null;
        estadoJogo.telaAtual = 'menu';
        UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
        return;
    }


    estadoJogo.combo = 0;
    estadoJogo.multiplicador = 1.0;
    UI.atualizarComboDisplay(estadoJogo.combo, estadoJogo.multiplicador);

    SFX.erro();
    UI.abrirModal("[ INCORRETO ]", "Resposta incorreta! Tente novamente ou digite <b>dica</b> para receber uma ajuda.", "erro");
    estadoJogo.modalAberto = true;
        UI.atualizarExpressaoMascote('erro', estadoJogo.avatar);
        setTimeout(() => {
        UI.atualizarExpressaoMascote('normal', estadoJogo.avatar);
    }, 4900);
}


async function processarResposta(respostaDigitada) {
    console.log("Processando resposta:", respostaDigitada);
   
    const enigmaAtual = estadoJogo.enigmas[estadoJogo.indiceAtual];
    console.log("Enigma atual:", enigmaAtual);
   
    const entrada = respostaDigitada.trim();


    if (['voltar', 'menu', 'sair'].includes(entrada.toLowerCase())) {
        pararTemporizador();
        estadoJogo.telaAtual = 'menu';
        UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
        return;
    }


    if (entrada.toLowerCase() === 'dica') {
        pedirDica();
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
        await processarRespostaCorreta();
    } else {
        await processarRespostaErros(respostaDigitada);
    }
}


function validarEngenhariaReversa(operadorDigitado, enigma) {
    const op = operadorDigitado.trim();
    if (op === enigma.resposta_correta.trim()) return true;
    if (!enigma.dados_teste || !enigma.codigo_python) return false;


    try {
        for (let teste of enigma.dados_teste) {
            const expressaoBase = enigma.codigo_python.split('=')[1] || enigma.codigo_python;
            const expressaoCalculada = expressaoBase.replace('_____', op).replace(/\bx\b/g, teste.entrada);
            const resultado = Function(`"use strict"; return (${expressaoCalculada})`)();
            if (resultado !== teste.saida) return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}


function validarReconstrucao(sequenciaDigitada, respostaCorreta) {
    if (!sequenciaDigitada) return false;
    return sequenciaDigitada.replace(/\D/g, '') === respostaCorreta.replace(/\D/g, '');
}


async function efetivarLogin(nick, dadosSalvos) {
    estadoJogo.nickname = nick;

   const radioAvatar = document.querySelector('input[name="generoHacker"]:checked');
    console.log("[DEBUG] Radio selecionado no HTML:", radioAvatar ? radioAvatar.value : "Nenhum encontrado");

    console.log("[DEBUG] Dados vindos do banco (dadosSalvos):", dadosSalvos);

    const generoInputHtml = radioAvatar ? radioAvatar.value : 'masculino';

    estadoJogo.avatar = dadosSalvos && dadosSalvos.avatar ? dadosSalvos.avatar : generoInputHtml;
    console.log("[DEBUG] Avatar final definido no estadoJogo:", estadoJogo.avatar);

    estadoJogo.xpNormal = dadosSalvos && (dadosSalvos.xp_normal !== undefined ? dadosSalvos.xp_normal : (dadosSalvos.xp || 0));
    estadoJogo.xpTempoMax = dadosSalvos && dadosSalvos.xp_tempo_max !== undefined ? dadosSalvos.xp_tempo_max : 0;

    estadoJogo.xpPorModulo= dadosSalvos && dadosSalvos.xp_por_modulo ? dadosSalvos.xp_por_modulo : { 1: 0, 2: 0, 3: 0 };
   
    estadoJogo.xpGlobal = dadosSalvos && dadosSalvos.xp_global !== undefined
        ? dadosSalvos.xp_global
        : (estadoJogo.xpNormal + estadoJogo.xpTempoMax);
   
    const fasesFeitasBanco = dadosSalvos && (dadosSalvos.fase_atual !== undefined ? dadosSalvos.fase_atual : 1);
   
    let indiceCalculado = Math.max(0, fasesFeitasBanco - 1);


    let modulos = [1];
    if (fasesFeitasBanco >= 15) modulos.push(2);
    if (fasesFeitasBanco >= 30) modulos.push(3);


    estadoJogo.modulosDesbloqueados = dadosSalvos && dadosSalvos.modulos_desbloqueados
        ? dadosSalvos.modulos_desbloqueados
        : modulos;
       
    estadoJogo.enigmasResolvidosTotal = indiceCalculado;
    estadoJogo.faseNormal = fasesFeitasBanco;
   
    if (fasesFeitasBanco >= 30) {
        estadoJogo.moduloAtual = 3;
        estadoJogo.indiceAtual = indiceCalculado - 30;
    } else if (fasesFeitasBanco >= 15) {
        estadoJogo.moduloAtual = 2;
        estadoJogo.indiceAtual = indiceCalculado - 15;
    } else {
        estadoJogo.moduloAtual = 1;
        estadoJogo.indiceAtual = indiceCalculado;
    }
   
    localStorage.setItem('cyberquest_nickname', nick);

    localStorage.setItem('cyberquest_player_data', JSON.stringify({
        nickname: estadoJogo.nickname,
        xp: estadoJogo.xpGlobal,
        avatar: estadoJogo.avatar
    }));
   
    UI.fecharNicknameModal();
    estadoJogo.telaAtual = 'menu';
    UI.mostrarMascote();
    UI.atualizarExpressaoMascote('normal', estadoJogo.avatar);
    UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal, estadoJogo.avatar);

     await salvarProgressoNuvem({
        nickname: estadoJogo.nickname,
        xpGlobal: estadoJogo.xpGlobal,
        xpNormal: estadoJogo.xpNormal,
        xpTempoMax: estadoJogo.xpTempoMax,
        faseNormal: estadoJogo.faseNormal,
        modulosDesbloqueados: estadoJogo.modulosDesbloqueados,
        xpPorModulo: estadoJogo.xpPorModulo,
        avatar: estadoJogo.avatar
    });
}


function pedirDica() {
    SFX.dica();
    
    const enigmaAtual = estadoJogo.enigmas[estadoJogo.indiceAtual];
    if (!enigmaAtual || !enigmaAtual.dica) {
        UI.abrirModal("[ DICA ]", "Nenhuma dica disponível para este enigma.", "info");
        estadoJogo.modalAberto = true;
        return;  
    }

    if (estadoJogo.modoJogo === 'tempo') {
        pararTemporizador();
    }

    let msgDica = enigmaAtual.dica;
    if (!estadoJogo.dicaUsadaNaFase) {
        const penalidade = 15;
        estadoJogo.xpModulo = Math.max(0, estadoJogo.xpModulo - penalidade);

        if (!estadoJogo.xpPorModulo) estadoJogo.xpPorModulo = {};
        estadoJogo.xpPorModulo[estadoJogo.moduloAtual] = estadoJogo.xpModulo;

        estadoJogo.xpNormal = Math.max(0, estadoJogo.xpNormal - penalidade);
        estadoJogo.xpGlobal = estadoJogo.xpNormal + estadoJogo.xpTempoMax;
        estadoJogo.dicaUsadaNaFase = true;
        msgDica += `<br><br><span class="destaque-amarelo">[ PENALIDADE: -${penalidade} XP por solicitar a dica! ]</span>`;
    }

    UI.mostrarBalaoPensamento(msgDica, estadoJogo.avatar);
    estadoJogo.modalAberto = true;
}


async function finalizarPartidaTempo() {
    pararTemporizador();


    if (estadoJogo.xpSessaoTempo > estadoJogo.xpTempoMax) {
        estadoJogo.xpTempoMax = estadoJogo.xpSessaoTempo;
    }


    estadoJogo.xpGlobal = estadoJogo.xpNormal + estadoJogo.xpTempoMax;


    try {
        await salvarProgressoNuvem({
        nickname: estadoJogo.nickname,
        xpGlobal: estadoJogo.xpGlobal,
        xpNormal: estadoJogo.xpNormal,
        xpTempoMax: estadoJogo.xpTempoMax,
        faseNormal: estadoJogo.faseNormal,
        modulosDesbloqueados: estadoJogo.modulosDesbloqueados,
        xpPorModulo: estadoJogo.xpPorModulo,
        avatar: estadoJogo.avatar
    });
    } catch (error) {
        console.error("Erro ao salvar recorde de tempo na nuvem:", error);
    }


    UI.abrirModal(
        "[ FIM DE JOGO ]",
        `Tempo esgotado ou corrida encerrada!<br>XP obtido nesta tentativa: <strong>${estadoJogo.xpSessaoTempo} XP</strong><br>Seu Recorde no Tempo: <strong>${estadoJogo.xpTempoMax} XP</strong>`,
        "sucesso"
    );
    estadoJogo.modalAberto = true;
}


function retomarTemporizadorModulo() {
    if (estadoJogo.modoJogo !== 'tempo') return;
    pararTemporizador();


    estadoJogo.intervaloTimer = setInterval(() => {
        estadoJogo.tempoRestante--;
        UI.atualizarTimerDisplay(estadoJogo.tempoRestante);


        if (estadoJogo.tempoRestante <= 0) {
            pararTemporizador();
            gameOverTempoEsgotado();
        }
    }, 1000);
}

async function resetarModuloEspecifico(moduloNum) {
    if (!estadoJogo.xpPorModulo) estadoJogo.xpPorModulo = { 1: 0, 2: 0, 3: 0 };
    estadoJogo.xpPorModulo[moduloNum] = 0;

    estadoJogo.xpNormal = Object.values(estadoJogo.xpPorModulo).reduce((a, b) => a + b, 0);
    estadoJogo.xpGlobal = estadoJogo.xpNormal + estadoJogo.xpTempoMax;

    if (moduloNum === 1) {
        estadoJogo.faseNormal = 1;
        estadoJogo.enigmasResolvidosTotal = 0;
    } else if (moduloNum === 2) {
        estadoJogo.faseNormal = Math.min(estadoJogo.faseNormal, 16);
        estadoJogo.enigmasResolvidosTotal = 15;
    } else if (moduloNum === 3) {
        estadoJogo.faseNormal = Math.min(estadoJogo.faseNormal, 31);
        estadoJogo.enigmasResolvidosTotal = 30;
    }

    await salvarProgressoNuvem({
        nickname: estadoJogo.nickname,
        xpGlobal: estadoJogo.xpGlobal,
        xpNormal: estadoJogo.xpNormal,
        xpTempoMax: estadoJogo.xpTempoMax,
        faseNormal: estadoJogo.faseNormal,
        modulosDesbloqueados: estadoJogo.modulosDesbloqueados,
        xpPorModulo: estadoJogo.xpPorModulo,
        avatar: estadoJogo.avatar
    });

    UI.abrirModal("[ MÓDULO REINICIADO ]", `O Módulo ${moduloNum} foi resetado com sucesso!<br>Pressione ENTER para continuar.`, "sucesso");
    estadoJogo.modalAberto = true;
    UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
}

async function resetarTudoCompleto() {
    estadoJogo.faseNormal = 1;
    estadoJogo.xpNormal = 0;
    estadoJogo.xpModulo = 0;
    estadoJogo.xpPorModulo = { 1: 0, 2: 0, 3: 0 };
    estadoJogo.modulosDesbloqueados = [1];
    estadoJogo.moduloAtual = 1;
    estadoJogo.enigmasResolvidosTotal = 0;
    estadoJogo.xpGlobal = estadoJogo.xpTempoMax;

    await salvarProgressoNuvem({
        nickname: estadoJogo.nickname,
        xpGlobal: estadoJogo.xpGlobal,
        xpNormal: 0,
        xpTempoMax: estadoJogo.xpTempoMax,
        faseNormal: 1,
        modulosDesbloqueados: [1],
        xpPorModulo: estadoJogo.xpPorModulo,
        avatar: estadoJogo.avatar
    });

    UI.abrirModal("[ SISTEMA FORMATADO ]", "Todo o progresso da campanha foi zerado com sucesso!<br>Pressione ENTER para continuar.", "sucesso");
    estadoJogo.modalAberto = true;
    UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
}

const radiosGenero = document.querySelectorAll('input[name="generoHacker"]');
radiosGenero.forEach(radio => {
    radio.addEventListener('change', (evento) => {
        UI.atualizarExpressaoMascote('normal', evento.target.value);
    });
});

if (UI.nicknameInput) {
    const containerGenero = document.querySelector('.avatar-selector');
    let timerBuscaNick = null;

    UI.nicknameInput.addEventListener('input', () => {
        clearTimeout(timerBuscaNick);
        const nickDigitado = formatarNome(UI.nicknameInput.value);


        if (estadoJogo.pendenteConfirmacaoNick) {
            estadoJogo.pendenteConfirmacaoNick = null;
        }

        if (!nickDigitado) {
            if (containerGenero) containerGenero.style.display = 'flex';
            return;
        }

        timerBuscaNick = setTimeout(async () => {
            const dadosExistentes = await buscarDadosJogador(nickDigitado);


            if (dadosExistentes) {
                if (containerGenero) containerGenero.style.display = 'none';
                if (dadosExistentes.avatar) {
                    UI.atualizarExpressaoMascote('normal', dadosExistentes.avatar);
                }
            } else {
                if (containerGenero) containerGenero.style.display = 'flex';
                const marcado = document.querySelector('input[name="generoHacker"]:checked');
                if (marcado) {
                    UI.atualizarExpressaoMascote('normal', marcado.value);
                }
            }
        }, 400);
    });

    UI.nicknameInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nickDigitado = formatarNome(UI.nicknameInput.value);
            if (!nickDigitado) return;

            if (estadoJogo.pendenteConfirmacaoNick) {
                const { nick: nickSalvo, dados } = estadoJogo.pendenteConfirmacaoNick;

                if (nickDigitado.toLowerCase() === nickSalvo.toLowerCase()) {
                    estadoJogo.pendenteConfirmacaoNick = null;
                    estadoJogo.avatar = dados.avatar || 'masculino';
                    dados.avatar = estadoJogo.avatar;
                    efetivarLogin(nickSalvo, dados);
                    return;
                } else {
                    estadoJogo.pendenteConfirmacaoNick = null;
                }
            }

            const dadosExistentes = await buscarDadosJogador(nickDigitado);

            if (dadosExistentes) {
                estadoJogo.pendenteConfirmacaoNick = { nick: dadosExistentes.nickname, dados: dadosExistentes };
                
                if (containerGenero) containerGenero.style.display = 'none';

                if (dadosExistentes.avatar) {
                    UI.atualizarExpressaoMascote('normal', dadosExistentes.avatar);
                }

                const instrucao = document.getElementById('nickname-instrucao');
                if (instrucao) {
                    const xpExibicao = dadosExistentes.xp_global || dadosExistentes.xp || 0;
                    instrucao.innerHTML = `
                        <span style="color: #ffcc00; font-weight: bold;">[!] O nick "${dadosExistentes.nickname}" já possui um cadastro salvo (${xpExibicao} XP).</span><br>
                        Pressione <b style="color: #00ff66;">ENTER</b> novamente para carregar este perfil ou digite outro nome:
                    `;
                }
                UI.focarNicknameInput();
                return;
            }

            if (containerGenero) containerGenero.style.display = 'flex';


            const radioMarcado = document.querySelector('input[name="generoHacker"]:checked');
            const generoEscolhido = radioMarcado ? radioMarcado.value : 'masculino';

            const novoProgresso = await buscarOuCriarProgresso(nickDigitado, generoEscolhido);
            estadoJogo.avatar = novoProgresso.avatar || generoEscolhido;
            novoProgresso.avatar = estadoJogo.avatar;
            efetivarLogin(nickDigitado, novoProgresso);
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key.length === 1 || e.key === 'Backspace') {
        SFX.tecla();
    }

    if (e.key === 'Enter') {
        SFX.enter();
    }
});

UI.terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();

        const temEfeitoAtivo = 
            document.getElementById('fortune-cookie-overlay') || 
            document.getElementById('matrix-rain-container') || 
            document.getElementById('rosa-barbie-style') || 
            document.getElementById('bat-signal-overlay') ||
            document.getElementById('zelda-overlay') || 
            document.getElementById('disco-party-overlay') ||
            document.getElementById('fbi-alarm-overlay') ||
            UI.pacmanRodando;

        if (temEfeitoAtivo) {
            const comando = UI.terminalInput.value.trim().toLowerCase();

            if (comando === '/off' || comando === '/reset') {
                UI.limparEfeitosVisuais();
                UI.limparInput();
                UI.terminalInput.placeholder = "Digite 1 a 7 para navegar ou 'voltar'...";
                
                const pacmanOverlay = document.getElementById('pacman-terminal-overlay');
                if (pacmanOverlay) pacmanOverlay.remove();
                if (UI.intervaloPacmanGlobal) clearInterval(UI.intervaloPacmanGlobal);
                UI.pacmanRodando = false; 

                UI.terminalInput.focus();
                return;
            }
           
            UI.limparInput();
            return; 
        }

        if (estadoJogo.modalAberto) {
            UI.fecharModal();
            UI.esconderBalaoPensamento(estadoJogo.avatar);
            estadoJogo.modalAberto = false;
            UI.limparInput();
            UI.limparEfeitosVisuais();

            if (estadoJogo.telaAtual === 'menu') {
                UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
            } else if (estadoJogo.telaAtual === 'jogo') {
                if (estadoJogo.modoJogo === 'tempo') {
                    retomarTemporizadorModulo();
                }
                exibirEnigmaAtual();
            }
            return;
        }

        const inputBruto = UI.terminalInput.value;
        const comando = inputBruto.trim();
        const cmdLower = comando.toLowerCase();

        if (estadoJogo.telaAtual === 'clear' || estadoJogo.telaAtual === 'creditos') {
            if (comando === '' || cmdLower === 'voltar' || !isNaN(comando)) {
                estadoJogo.telaAtual = 'menu';
                
                const containerLimpeza = document.getElementById('clear-message-container');
                const containerCreditos = document.getElementById('credits-scroll-container');
                 
                if (containerLimpeza) containerLimpeza.remove();
                if (containerCreditos) containerCreditos.remove();
                
                if (UI.screenMenu) {
                    Array.from(UI.screenMenu.children).forEach(filho => {
                        filho.style.display = ''; 
                    });
                }
                
                UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
                UI.limparInput();
                return;
            }
        }

        if (cmdLower === '/off' || cmdLower === '/reset') { 
            UI.limparEfeitosVisuais(); 
            UI.limparInput(); 
            return; 
        }
        if (cmdLower === '/matrix') { UI.aplicarTemaMatrix(); UI.limparInput(); return; }
        if (cmdLower === '/rosa' || cmdLower === '/pink' || cmdLower === '/barbie') { UI.aplicarTemaRosa(); UI.limparInput(); return; }
        if (cmdLower === '/batman' || cmdLower === '/gotham') { UI.mostrarBatman(); UI.limparInput(); return; }
        if (cmdLower === '/glitch') { UI.ativarGlitch(); UI.limparInput(); return; }
        if (cmdLower === '/fbi' || cmdLower === '/policia') { UI.ativarAlarmePolicia(); UI.limparInput(); return; }
        if (cmdLower === '/fortuna' || cmdLower === '/quote') { UI.mostrarBiscoitoSorte(); UI.limparInput(); return; }
        if (cmdLower === '/disco' || cmdLower === '/party') { UI.ativarDisco(); UI.limparInput(); return; }
        if (cmdLower === '/zelda' || cmdLower === '/triforce') { UI.mostrarZelda(); UI.limparInput(); return; }
        
        if (cmdLower === '/pacman') { UI.mostrarPacman(); UI.limparInput(); return; }

        if (cmdLower === '/clear' || cmdLower === '/cls') { UI.falsoClear(); estadoJogo.telaAtual = 'clear'; UI.limparInput(); return; }
        if (cmdLower === '/creditos' || cmdLower === '/devs') { UI.mostrarCreditosEquipe(); estadoJogo.telaAtual = 'creditos'; UI.limparInput(); return; }

       if (estadoJogo.telaAtual === 'menu') {
            if (comando === '1') {
                if (estadoJogo.enigmasResolvidosTotal >= 45) {
                    UI.abrirModal("[ SISTEMA CONCLUÍDO ]", "Parabéns! Você já resolveu todos os 45 enigmas do jogo.<br>Seu progresso máximo está gravado no ranking.", "info");
                    estadoJogo.modalAberto = true;
                    return;
                }
                estadoJogo.telaAtual = 'modulos';
                UI.mostrarModulos(estadoJogo.modulosDesbloqueados);
                } else if (comando === '2') {
                    const totalResolvidos = estadoJogo.enigmasResolvidosTotal || 0;
                    const moduloAtualNum = estadoJogo.moduloAtual || 1;

                    let resolvidosNoModuloAtual = 0;
                    if (moduloAtualNum === 1) {
                        resolvidosNoModuloAtual = Math.min(15, totalResolvidos);
                    } else if (moduloAtualNum === 2) {
                        resolvidosNoModuloAtual = Math.max(0, Math.min(15, totalResolvidos - 15));
                    } else if (moduloAtualNum === 3) {
                        resolvidosNoModuloAtual = Math.max(0, Math.min(15, totalResolvidos - 30));
                    }

                    UI.exibirDashboard({
                        nickname: estadoJogo.nickname,
                        xp_global: estadoJogo.xpGlobal,
                        xp: estadoJogo.xpNormal,
                        xp_tempo_max: estadoJogo.xpTempoMax,
                        fase_atual: estadoJogo.enigmasResolvidosTotal,
                        resolvidos: totalResolvidos,
                        nivelAtual: estadoJogo.nomeModulos[moduloAtualNum],
                        resolvidosModulo: resolvidosNoModuloAtual,
                        modulosDesbloqueados: estadoJogo.modulosDesbloqueados
                    });
                    estadoJogo.modalAberto = true;
                } else if (comando === '3') {
                    const ranking = await buscarRankingGlobal();
                    UI.exibirRanking(ranking);
                    estadoJogo.modalAberto = true;
                } else if (comando === '4') {
                    UI.abrirModal("[ COMO JOGAR ]", "Resolva os 15 enigmas Python de cada módulo.<br>Use combos e o modo Contra o Tempo para maximizar seu XP e subir no Ranking!<br><br><span style='color:#888;'>Digite <b>voltar</b> a qualquer momento no terminal para retornar ao Menu.</span>", "info");
                    estadoJogo.modalAberto = true;
                } else if (comando === '5') {
                    UI.abrirModal("[ SOBRE ]", "CyberQuest v2.0 - Trilha de Níveis, Módulos e Modos de Jogo.", "info");
                    estadoJogo.modalAberto = true;
                } else if (comando === '6' || comando.toLowerCase() === 'sair') {
                    localStorage.clear();
                    window.location.reload();
                } else if (comando === '7') {
                    estadoJogo.telaAtual = 'menu_reset';
                    UI.fecharModal(); 
                    estadoJogo.modalAberto = false;
                    UI.mostrarMenuReset();
                    UI.limparInput();
                    return;
                } else {
                    UI.abrirModal("[ AVISO ]", "Opção inválida. Digite de 1 a 7.", "erro");
                    estadoJogo.modalAberto = true;
                }
            } 
            else if (estadoJogo.telaAtual === 'menu_reset') {
                if (comando === '1' || comando === '2' || comando === '3') {
                    const modAlvo = parseInt(comando, 10);
                    await resetarModuloEspecifico(modAlvo);
                } else if (comando === '4') {
                    await resetarTudoCompleto();
                }
                window.location.reload(); 
                return;
            }
            else if (estadoJogo.telaAtual === 'modulos') {
                if (['1', '2', '3'].includes(comando)) {
                    await selecionarModulo(parseInt(comando, 10));
                } else if (comando.toLowerCase() === 'voltar' || comando === '0') {
                    estadoJogo.telaAtual = 'menu';
                    UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
                } else {
                    UI.abrirModal("[ AVISO ]", "Módulo inválido. Escolha 1, 2 ou 3.", "erro");
                    estadoJogo.modalAberto = true;
                }
            } 
            else if (estadoJogo.telaAtual === 'modos') {
                if (comando === '1') {
                    await iniciarGameplayComModo('normal');
                } else if (comando === '2') {
                    await iniciarGameplayComModo('tempo');
                } else if (comando.toLowerCase() === 'voltar') {
                    estadoJogo.telaAtual = 'modulos';
                    UI.mostrarModulos(estadoJogo.modulosDesbloqueados);
                } else {
                    UI.abrirModal("[ AVISO ]", "Modo inválido. Digite 1 (Normal) ou 2 (Contra o Tempo).", "erro");
                    estadoJogo.modalAberto = true;
                }
            } 
            else if (estadoJogo.telaAtual === 'jogo') {
                if (comando !== "") {
                    await processarResposta(comando);
                }
            } 
            else if (estadoJogo.telaAtual === 'conclusao') {
                if (comando === '1' || comando.toLowerCase() === 'voltar') {
                    estadoJogo.telaAtual = 'menu';
                    UI.mostrarMenu(estadoJogo.nickname, estadoJogo.xpGlobal);
                } else if (comando === '2') {
                    const proximoModulo = estadoJogo.moduloAtual + 1;
                    if (proximoModulo <= 3) {
                        await selecionarModulo(proximoModulo);
                    } else {
                        UI.abrirModal("[ PARABÉNS ]", "Você concluiu todos os módulos do CyberQuest!", "sucesso");
                        estadoJogo.modalAberto = true;
                    }
                } else {
                    UI.abrirModal("[ AVISO ]", "Opção inválida. Digite 1 para Menu ou 2 para Próximo Módulo.", "erro");
                    estadoJogo.modalAberto = true;
                }
            }

        UI.limparInput();
    }
});

const btnMute = document.getElementById('btn-mute');
if (btnMute) {
    btnMute.addEventListener('click', () => {
        const estaMutado = SFX.toggleMute();
        if (estaMutado) {
            btnMute.textContent = '🔇';
            btnMute.classList.add('muted');
        } else {
            btnMute.textContent = '🔊';
            btnMute.classList.remove('muted');
        }
    });
}

window.onload = async () => {
    const nickSalvo = localStorage.getItem('cyberquest_nickname');
    if (nickSalvo) {
        const dadosNuvem = await buscarDadosJogador(nickSalvo);
        efetivarLogin(nickSalvo, dadosNuvem);
        console.log(`[SESSÃO RESTAURADA] Usuário: ${nickSalvo}`);
    } else {
        estadoJogo.telaAtual = 'login';
        if (typeof UI.abrirNicknameModal === 'function') {
            UI.abrirNicknameModal();
        }
    }
};

export default estadoJogo;
