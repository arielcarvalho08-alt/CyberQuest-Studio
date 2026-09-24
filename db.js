import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://fojsxjxibbpxacdklkza.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvanN4anhpYmJweGFjZGtsa3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDcxNDMsImV4cCI6MjEwNTIyMzE0M30.ZBG3GjzQX_S_hYKyzS28gb9f0tRl0XavCxpqBnKLkeQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function buscarDadosJogador(nickname) {
    try {
        const { data, error } = await supabase
            .from('Progresso')
            .select('*')
            .eq('nickname', nickname)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Erro ao buscar jogador:", err);
        return null;
    }
}

export async function buscarOuCriarProgresso(nickname) {
    try {
        let data = await buscarDadosJogador(nickname);

        if (!data) {
            const { data: novoJogador, error: errCriar } = await supabase
                .from('Progresso')
                .insert([{ nickname: nickname, fase_atual: 0 }])
                .select()
                .single();

            if (errCriar) throw errCriar;
            return novoJogador;
        }

        return data;
    } catch (err) {
        console.error("Erro ao conectar com o banco.", err);
        return { nickname: nickname, fase_atual: 0 };
    }
}

export async function salvarProgressoNuvem(nickname, novaFase) {
    try {
        const { error } = await supabase
            .from('Progresso')
            .update({ 
                fase_atual: novaFase, 
                atualizado_em: new Date().toISOString() 
            })
            .eq('nickname', nickname);

        if (error) console.error("Erro ao salvar progresso", error);
    } catch (err) {
        console.error("Falha de rede no auto save", err);
    }
}

export async function buscarEnigmasNuvem() {
    try {
        const { data, error } = await supabase
            .from('Enigmas')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Erro ao usar os enigmas na nuvem, usando fallback", err);
        return null;
    }
}