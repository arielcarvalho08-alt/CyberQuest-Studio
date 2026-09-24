const SUPABASE_URL = "https://fojsxjxibbpxacdklkza.supabase.co/rest/v1/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvanN4anhpYmJweGFjZGtsa3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDcxNDMsImV4cCI6MjEwNTIyMzE0M30.ZBG3GjzQX_S_hYKyzS28gb9f0tRl0XavCxpqBnKLkeQ";

export async function buscarOuCriarProgresso(nickname){
    try{
      let {data, error} = await supabase
        .from('progresso')
        .select('*')
        .eq('nickname', nickname)
        .single();
    if (error && error.code === 'PGRST116') {
    const {data: novoJogador, error: errCriar} = await supabase
        .from('progresso')
        .insert([{nickname: nickname, fase_atual: 0}])
        .select()
        .single();
    if (errCriar) throw errCriar;
       return novoJogador;
    }else if (error) {
        throw error;
    }
      return data;
    } catch (err) {
        console.error("Erro ao conectar com o banco.", err);
        return null;
    }
   }

export async function salvarProgressoNuvem(nickname, novaFase){
    try{
      const {error} = await supabase
      .from('progresso')
      .update({fase_atual: novaFase, atualizado_em: new Date() })
      .eq('nickname', nickname);
      if(error) console.error("Erro ao salvar progresso", error);
    }catch (err){
        console.error("Falha de rede no auto save", err);
    }
}
export async function buscarEnigmasNuvem(){
    try{
      const {data, error} = await supabase
      .from('enigmas')
      .select('*')
      .order('id', {ascending: true});

      if(error) throw error;
        return data;
    }catch(err){
        console.error("Erro ao usar os enigmas na nuvem, usando fallback", err);
        return null;
    }
    }