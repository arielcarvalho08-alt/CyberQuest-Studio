const UI = {
    screenMenu: document.getElementById('screen-menu'),
    screenGame: document.getElementById('screen-game'),
    screenConclusion: document.getElementById('screen-conclusion'),
    nicknameModal: document.getElementById('nickname-modal'),
    nicknameInput: document.getElementById('nickname-input'),

    tipoTag: document.getElementById('tipo-tag'),
    tituloTag: document.getElementById('titulo-tag'),
    gameProgress: document.getElementById('game-progress'),
    menuProgress: document.getElementById('menu-progress'),
    enunciadoText: document.getElementById('enunciado-text'),
    codeContent: document.getElementById('code-content'),

    modalOverlay: document.getElementById('modal-overlay'),
    modalCard: document.getElementById('modal-card'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),

    terminalInput: document.getElementById('terminal-input'),

    mostrarMenu() {
        this.esconderTodas();
        this.screenMenu.classList.remove('hidden');
        this.terminalInput.placeholder = "Digite 1, 2 ou 3...";
    },

    mostrarJogo() {
        this.esconderTodas();
        this.screenGame.classList.remove('hidden');
        this.terminalInput.placeholder = "Digite sua resposta ou 'dica'...";
    },

    mostrarConclusao(nivelNome, progressoTexto) {
        this.esconderTodas();
        this.screenConclusion.classList.remove('hidden');
        document.getElementById('congrats-msg').textContent = `Parabéns! Você passou pelo nível ${nivelNome}!`;
        document.getElementById('conclusion-progress').textContent = progressoTexto;
        this.terminalInput.placeholder = "Digite 1 para Menu ou 2 para Próximo Nível...";
    },

    esconderTodas() {
        this.screenMenu.classList.add('hidden');
        this.screenGame.classList.add('hidden');
        this.screenConclusion.classList.add('hidden');
    },

    abrirModal(titulo, texto, tipo = 'info') {
        this.modalCard.className = `modal-card ${tipo}`;
        this.modalTitle.textContent = titulo;
        this.modalText.textContent = texto;
        this.modalOverlay.classList.remove('hidden');
    },

    fecharModal() {
        this.modalOverlay.classList.add('hidden');
    },
    
    carregarEnigma(enigma, indiceAtual, totalEnigmas) {
        this.tipoTag.textContent = enigma.tipo || "geral";
        this.tituloTag.textContent = enigma.titulo || `Fase ${String(indiceAtual + 1).padStart(2, '0')}`;
        
        const txtProgresso = `${indiceAtual + 1}/${totalEnigmas}`;
        this.gameProgress.textContent = txtProgresso;
        this.menuProgress.textContent = `0/${totalEnigmas}`;
        
        this.enunciadoText.textContent = enigma.enunciado;
        this.codeContent.textContent = enigma.codigo_python || "# Sem código para esta fase";
    },

    limparInput() {
        this.terminalInput.value = "";
    },

    fecharNicknameModal(){
        this.nicknameModal.classList('hidden');
    }
};

document.addEventListener('click', () => {
    UI.terminalInput.focus();
});