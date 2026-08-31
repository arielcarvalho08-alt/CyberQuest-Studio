/**
 * Engine de Lógica e Validação (Core Engine)
 */

let bancoDeEnigmas = [];
let indiceEnigmaAtual = 0;
let jogoIniciado = false;

const inputPrompt = document.getElementById('terminal-input');

// 1. Iniciando a aplicação e buscando os enigmas
async function carregarBancoDeDados() {
    try {
        const resposta = await fetch('enigmas.json');
        if (!resposta.ok) throw new Error("Erro ao buscar JSON");

        bancoDeEnigmas = await resposta.json();
        console.log("Banco de dados de enigmas carregado com sucesso!", bancoDeEnigmas);
    } catch (erro) {
        console.error("Falha ao carregar enigmas.json:", erro);
        adicionarLog("[AVISO] Servidor local não detectado. Usando modo de teste.", "info");

        bancoDeEnigmas = [
            {
                id: 1,
                tipo: "preencher_lacuna",
                titulo: "Fase 01 - Imprimindo Texto",
                enunciado: "Complete com o comando nativo do Python para exibir textos na tela",
                codigo_python: "____('Invasao iniciada')",
                resposta_correta: "print",
                dica: "Use a função nativa do Python para exibir textos."
            }
        ];
    }
}

// 2. Escuta da tecla ENTER no prompt
if (inputPrompt) {
    inputPrompt.addEventListener('keydown', function(evento) {
        if (evento.key === 'Enter') {
            const textoDigitado = inputPrompt.value;

            if (textoDigitado.trim() !== '') {
                adicionarLog(`user@cyberquest:~ $ ${textoDigitado}`, 'info');
                tratarEntradaDoUsuario(textoDigitado);
                limparPrompt();
            }
        }
    });
}

// 3. Processamento de comandos do menu e do fluxo do jogo
function tratarEntradaDoUsuario(entrada) {
    const comandoLimpo = entrada.trim().toLowerCase();

    if (!jogoIniciado) {
        if (comandoLimpo === 'iniciar' || comandoLimpo === '1') {
            jogoIniciado = true;
            indiceEnigmaAtual = 0;
            adicionarLog("Iniciando sequência de invasão...", "sucesso");

            setTimeout(() => {
                carregarEnigmaNaTela();
            }, 1000);
            return;
        }

        if (comandoLimpo === 'ajuda' || comandoLimpo === '2') {
            adicionarLog("=== INSTRUÇÕES CYBERQUEST ===", "info");
            adicionarLog("1. Analise o código Python na tela.", "info");
            adicionarLog("2. Digite apenas o trecho que falta ou a resposta correta.", "info");
            adicionarLog("3. Pressione ENTER para enviar.", "info");
            return;
        }

        adicionarLog(`Comando '${comandoLimpo}' não reconhecido. Digite 'iniciar' para jogar.`, "erro");
        return;
    }

    validarRespostaDoEnigma(entrada);
}

// 4. Validação da resposta e transição de fase
function validarRespostaDoEnigma(respostaDigitada) {
    const enigmaAtual = bancoDeEnigmas[indiceEnigmaAtual];
    if (!enigmaAtual) return;

    const respostaSanitizada = respostaDigitada.trim();
    const gabaritoOficial = enigmaAtual.resposta_correta.trim();

    if (respostaSanitizada === gabaritoOficial) {
        adicionarLog(`[OK] RESPOSTA CORRETA! Acesso concedido.`, "sucesso");
        inputPrompt.disabled = true;

        setTimeout(() => {
            indiceEnigmaAtual++;
            inputPrompt.disabled = false;
            inputPrompt.focus(); 

            if (indiceEnigmaAtual < bancoDeEnigmas.length) {
                carregarEnigmaNaTela();
            } else {
                adicionarLog("[SISTEMA HACKEADO] Você concluiu todos os enigmas deste módulo!", "sucesso");
                esconderEnigma();
                jogoIniciado = false;
            }
        }, 1500);     
    } else {
        adicionarLog(`[ERRO] Resposta incorreta. Dica: ${enigmaAtual.dica}`, "erro");
    }
}

// 5. Exibição do enigma atual
function carregarEnigmaNaTela() {
    const enigma = bancoDeEnigmas[indiceEnigmaAtual];
    if (enigma) {
        renderizarEnigma(enigma);
        adicionarLog(`--> Enigma ${indiceEnigmaAtual + 1} de ${bancoDeEnigmas.length} carregado. Digite a solução:`, "info");
    }
}

// Inicializa a carga dos dados ao abrir
carregarBancoDeDados();