import UI from './ui.js';
import { buscarOuCriarProgresso, salvarProgressoNuvem, buscarEnigmasPorNivel, buscarRanking } from './db.js';

let estadoJogo = {
    nickname: '',
    telaAtual: 'login',
    nivelAtual: 'facil', // Controla a trilha de níveis ('facil', 'medio', 'dificil')
    enigmas: [],
    indiceAtual: 0,
    modalAberto: false,
    pendenteConfirmacaoNick: null
};

// Função para carregar os enigmas do Supabase baseados no nível selecionado
async function carregarEnigmasDoNivel(nivel) {
    estadoJogo.nivelAtual = nivel;
    let dadosNuvem = await buscarEnigmasPorNivel(nivel);
    
    if (dadosNuvem && dadosNuvem.length > 0) {
        estadoJogo.enigmas = dadosNuvem;
    } else {
        // Fallback local caso caia a net
        try {
            const resposta = await fetch('enigmas.json');
            const todos = await resposta.json();
            estadoJogo.enigmas = todos.filter(e => e.nivel === nivel);
        } catch (erro) {
            console.error("Erro ao carregar enigmas locais.", erro);
            estadoJogo.enigmas = [];
        }
    }
    if (UI.menuProgress) {
        UI.menuProgress.textContent = `${estadoJogo.indiceAtual}/${estadoJogo.enigmas.length} [${nivel.toUpperCase()}]`;
    }
}

// Função para buscar o ranking no Supabase e abrir na tela
async function exibirRankingModal() {
    const ranking = await buscarRanking();
    if (!ranking || ranking.length === 0) {
        UI.abrirModal("[ RANKING ]", "Nenhum registro encontrado no ranking.", "info");
        estadoJogo.modalAberto = true;
        return;
    }

    let conteudoHtml = `<table class="tabela-ranking"><thead><tr><th>#</th><th>NICKNAME</th><th>FASE</th></tr></thead><tbody>`;
    ranking.forEach((pos, idx) => {
        conteudoHtml += `<tr><td>${idx + 1}º</td><td>${pos.nickname}</td><td>${pos.fase_atual}</td></tr>`;
    });
    conteudoHtml += `</tbody></table>`;

    UI.abrirModal("[ TOP 10 JOGADORES ]", conteudoHtml, "info");
    estadoJogo.modalAberto = true;
}

window.onload = async () => {
    await carregarEnigmasDoNivel('facil');
    UI.mostrarMenu();
};