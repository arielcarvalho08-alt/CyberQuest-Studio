/**
 * Engine de Logica e Validacao
 */

let bancoDeEnigmas = [];
let indiceEnigmaAtual = 0;
let jogoIniciado = false;

const inputPrompt = document.getElementById('terminal-input');

// 1. Iniciando a aplicacao
async function carregarBancoDeDados() {
    try {
        const resposta = await fetch('enigmas.json');
        if (!resposta.ok) throw new Error("Erro ao buscar JSON");

        bancoDeEnigmas= await resposta.json();
        console.log("Banco de dados de enigma carregado com sucesso", bancoDeEnigmas);
    } catch (erro) {
        console.error("Falha ao carregar enigmas.json:", erro);
        adicionarLog("[AVISO] Servidor local não detectado. Usando modo de teste.", "info");

        bancoDeEnigmas = [
            {
                id: 1,
                titulo: "Fase 01 - Imprimindo Texto",
                enunciado: "Complete com o comando nativo do Python para exibir textos na tela",
                codigo_python: "____('Invasao iniciada')",
                resposta_correta: "print",
                mensagem_sucesso: "Comando executado! Texto exibido no console."
            }
        ];
    }
}
// --------------------------------------------------------------------------------------------------//

// 2. Escuta da tecla ENTER
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
// --------------------------------------------------------------------------------------------------//

/** 3. Comandos do menu e do jogo
@param {string} entrada
**/

function tratarEntradaDoUsuario(entrada) {
    const comandoLimpo = entrada.trim().toLowerCase();

    if (!jogoIniciado) {
        if (comandoLimpo === 'iniciar' || comandoLimpo === '1') {
            jogoIniciado = true;
            indiceEnigmaAtual = 0;
            adicionarLog("Iniciando sequencia de invasao...", "sucesso");

            setTimeout(() => {
                carregarEnigmaNaTela();
            }, 1000);
            return;
        }

        if (comandoLimpo === 'ajuda' || comandoLimpo === '2') {
            adicionarLog("=== INSTRUÇÕES CYBERQUEST ===", "info");
            adicionarLog("1. Analise o codigo Python na tela.", "info");
            adicionarLog("2. Digite apenas o trecho que falta ou a resposta correta.", "info");
            adicionarLog("3. Pressione ENTER para enviar.", "info");
            return;
        }

        adicionarLog(`Comando '${comandoLimpo}' nao reconhecido. Digite 'iniciar' para jogar.`, "erro");
            return;
    }

    validarRespostaDoEnigma(entrada);
}
// --------------------------------------------------------------------------------------------------//

/**4. Validacao da resposta
@param {string} respostaDigitada
**/

function validarRespostaDoEnigma(respostaDigitada) {
    const enigmaAtual = bancoDeEnigmas[indiceEnigmaAtual];
    if (!enigmaAtual) return;

    const respostaSanitizada = respostaDigitada.trim();
    const gabaritoOficial = enigmaAtual.resposta_correta.trim();

    if (respostaSanitizada === gabaritoOficial) {
        adicionarLog(`[OK]  RESPOSTA CORRRETA! ${enigmaAtual.mensagem_sucesso || ''}` , "sucesso");
        inputPrompt.disabled = true;

        setTimeout(() => {
            indiceEnigmaAtual++;
            inputPrompt.disabled = false;
            inputPrompt.focus(); 

            if (indiceEnigmaAtual < bancoDeEnigmas.length) {
                carregarEnigmaNaTela();
            } else {
                adicionarLog("[SISTEMA HACKEADO] Você concluiu todos os enigmas deste modulo!", "sucesso");
                jogoIniciado = false;
            }
        }, 1500);      
    } else {
        adicionarLog("[ERRO] Sintaxe ou resposta incorreta. Analise o codigo e tente novamente!", "erro");
    }
}
// --------------------------------------------------------------------------------------------------//

// 5. Carregamento do enigma

function carregarEnigmaNaTela() {
    const enigma = bancoDeEnigmas[indiceEnigmaAtual];
    if (enigma) {
        renderizarEnigma(enigma);
        adicionarLog(`--> Enigma ${enigma.id} carregado. Digite a solução no prompt:`, "info");
    }
}

carregarBancoDeDados();