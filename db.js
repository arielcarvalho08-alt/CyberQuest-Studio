import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://fojsxjxibbpxacdklkza.supabase.co";    
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvanN4anhpYmJweGFjZGtsa3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDcxNDMsImV4cCI6MjEwNTIyMzE0M30.ZBG3GjzQX_S_hYKyzS28gb9f0tRl0XavCxpqBnKLkeQ" 

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MAPEAMENTO_NIVEIS = {
    1: 'facil',    
    2: 'medio',   
    3: 'dificil'  
};

const LOCAL_KEY = 'cyberquest_player_data';

export function obterProgressoLocal() {
    try {
        const localData = localStorage.getItem(LOCAL_KEY);
        return localData ? JSON.parse(localData) : null;
    } catch (e) {
        console.error("Erro ao ler do localStorage:", e);
        return null;
    }
}

export function salvarProgressoLocal(dados) {
    try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(dados));
    } catch (e) {
        console.error("Erro ao gravar no localStorage:", e);
    }
}

export async function buscarDadosJogador(nickname) {
    try {
        const { data, error } = await supabase
            .from('Progresso')
            .select('*')
            .ilike('nickname', nickname)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (err) {
        console.warn("Falha de comunicação com o Supabase. Verificando cache local...", err);
        const local = obterProgressoLocal();
        if (local && local.nickname && local.nickname.toLowerCase() === nickname.toLowerCase()) {
            return local;
        }
        return null;
    }
}

export async function buscarOuCriarProgresso(nickname) {
    const defaultData = { 
        nickname: nickname, 
        fase_atual: 0, 
        xp: 0,
        modulos_desbloqueados: [1] 
    };

    try {
        let data = await buscarDadosJogador(nickname);

        if (!data) {
            const { data: novoJogador, error: errCriar } = await supabase
                .from('Progresso')
                .insert([{ nickname: nickname, fase_atual: 0, xp: 0 }])
                .select()
                .single();

            if (errCriar) throw errCriar;
            data = { ...novoJogador, modulos_desbloqueados: [1] };
        } else {
            const fases = data.fase_atual || 0;
            data.modulos_desbloqueados = [1];
            if (fases >= 15) data.modulos_desbloqueados.push(2);
            if (fases >= 30) data.modulos_desbloqueados.push(3);
        }

        salvarProgressoLocal(data);
        return data;
    } catch (err) {
        console.error("Erro ao conectar com o banco. Usando estado local.", err);
        const local = obterProgressoLocal();
        if (local && local.nickname && local.nickname.toLowerCase() === nickname.toLowerCase()) {
            return local;
        }
        salvarProgressoLocal(defaultData);
        return defaultData;
    }
}

export async function salvarProgressoNuvem(dadosJogador) {
    try {
        console.log("[DB] Tentando salvar na nuvem:", dadosJogador);

        const payload = {
            nickname: dadosJogador.nickname,
            xp_global: Number(dadosJogador.xpGlobal) || 0,        
            xp: Number(dadosJogador.xpNormal) || 0,       
            xp_tempo_max: Number(dadosJogador.xpTempoMax) || 0,
            fase_atual: Number(dadosJogador.faseNormal) || 0
        };

        const { data, error } = await supabase
            .from('Progresso') 
            .upsert(payload, { onConflict: 'nickname' })
            .select();

        if (error) {
            console.error("[DB] ERRO CRÍTICO do Supabase ao salvar:", error);
        } else {
            console.log("[DB] Salvo com sucesso na nuvem!", data);
        }
    } catch (err) {
        console.error("[DB] Exceção capturada ao salvar:", err);
    }
}
<<<<<<< HEAD

export async function buscarEnigmasNuvem(moduloNum = 1, modoJogo = 'campanha') {
=======
 adicionar-enigmas
export async function buscarEnigmasPorNivel(nivel) {
    try {
        const { data, error } = await supabase
            .from('enigmas')
            .select('*')
            .eq('nivel', nivel)
export async function buscarEnigmasNuvem() {
>>>>>>> 7ea5fd2fc7aee2f15ba8ca2134ef499e5d3eef1f
    try {
        const nivelTexto = MAPEAMENTO_NIVEIS[moduloNum] || 'facil';

        const { data, error } = await supabase
            .from('Enigmas')
            .select('*')
<<<<<<< HEAD
            .eq('nivel', nivelTexto)
            .eq('modo', modoJogo)
=======
 main
>>>>>>> 7ea5fd2fc7aee2f15ba8ca2134ef499e5d3eef1f
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    } catch (err) {
<<<<<<< HEAD
        console.error(`Erro ao buscar enigmas do Módulo ${moduloNum} (${MAPEAMENTO_NIVEIS[moduloNum]}) no modo ${modoJogo} na nuvem.`, err);
        return null;
    }
}

export async function buscarRankingGlobal() {
    try {
        const { data, error } = await supabase
            .from('Progresso')
            .select('nickname, xp, xp_tempo_max, xp_global, fase_atual') 
            .order('xp_global', { ascending: false }) 
            .limit(10);

        if (error) {
            console.error("Erro na consulta do Supabase para o ranking:", error);
            return [];
        }

        if (!data || data.length === 0) return [];

        return data.map((jogador, index) => {
            const xpVal = Number(jogador.xp_global) || (Number(jogador.xp || 0) + Number(jogador.xp_tempo_max || 0));
            let tier = "Script Kiddie";
            let medalha = "🥉";

            if (xpVal >= 1500) {
                tier = "Senior Hacker";
                medalha = "💎";
            } else if (xpVal >= 800) {
                tier = "SysAdmin";
                medalha = "🥇";
            } else if (xpVal >= 300) {
                tier = "Dev Junior";
                medalha = "🥈";
            }

            return {
                posicao: index + 1,
                nickname: jogador.nickname || "Anon",
                xp: xpVal, 
                fase: jogador.fase_atual || 0,
                tier: tier,
                medalha: medalha
            };
        });
    } catch (err) {
        console.error("Erro ao buscar o ranking global:", err);
        return [];
    }
=======
 adicionar-enigmas
        console.error(`Erro ao buscar enigmas do nível ${nivel}, usando fallback:`, err);
        return null;
    }
}

export async function buscarRanking() {
    try {
        const { data, error } = await supabase
            .from('progresso')
            .select('nickname, fase_atual')
            .order('fase_atual', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        return [];
    }
        console.error("Erro ao usar os enigmas na nuvem, usando fallback", err);
        return null;
    }
 main
>>>>>>> 7ea5fd2fc7aee2f15ba8ca2134ef499e5d3eef1f
}