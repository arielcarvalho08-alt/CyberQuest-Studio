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
    
    if (this.terminalInput) {
        this.terminalInput.placeholder = "Digite 1 (Jogar), 2 (Ajuda), 3 (Sobre) ou 4 (Trocar Nick)...";
    }
    this.focarTerminalInput();
    },

    mostrarJogo() {
        this.esconderTodas();
        this.screenGame.classList.remove('hidden');
        this.terminalInput.placeholder = "Digite sua resposta ou 'dica'...";
        this.focarTerminalInput();
    },

    mostrarConclusao(nivelNome, progressoTexto) {
        this.esconderTodas();
        this.screenConclusion.classList.remove('hidden');
        document.getElementById('congrats-msg').textContent = `Parabéns! Você passou pelo nível ${nivelNome}!`;
        document.getElementById('conclusion-progress').textContent = progressoTexto;
        this.terminalInput.placeholder = "Digite 1 para Menu ou 2 para Próximo Nível...";
        this.focarTerminalInput();
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
        this.focarTerminalInput();
    },

    abrirNicknameModal() {
        this.nicknameModal.classList.remove('hidden');
        
        const instrucao = document.querySelector('#nickname-instrucao');
        if (instrucao) {
            instrucao.textContent = "Digite o seu nickname. Se já jogou antes, o seu progresso será carregado!";
        }

        if (this.nicknameInput) {
            this.nicknameInput.placeholder = "Ex: CyberDev";
        }

        this.focarNicknameInput();
    },

    fecharNicknameModal() {
        this.nicknameModal.classList.add('hidden');
        this.focarTerminalInput();
    },

    focarNicknameInput() {
        setTimeout(() => {
            if (this.nicknameInput) {
                this.nicknameInput.focus();
            }
        }, 50);
    },

    focarTerminalInput() {
        setTimeout(() => {
            if (this.terminalInput && this.nicknameModal.classList.contains('hidden')) {
                this.terminalInput.focus();
            }
        }, 50);
    },
    
    carregarEnigma(enigma, indiceAtual, totalEnigmas) {
        this.tipoTag.textContent = enigma.tipo || "geral";
        this.tituloTag.textContent = enigma.titulo || `Fase ${String(indiceAtual + 1).padStart(2, '0')}`;
        
        const txtProgresso = `${indiceAtual + 1}/${totalEnigmas}`;
        this.gameProgress.textContent = txtProgresso;
        this.menuProgress.textContent = `${indiceAtual}/${totalEnigmas}`;
        
        this.enunciadoText.textContent = enigma.enunciado;
        const codeContainer = document.querySelector('.code-box-container');

        if (enigma.tipo === 'engenharia_reversa' && enigma.dados_teste) {
            let tabelaHtml = `
                <div class="code-header">
                    <span>TABELA DE ENTRADA / SAÍDA</span>
                    <span class="file-tag">op_test.py</span>
                </div>
                <table class="tabela-io">
                    <thead>
                        <tr>
                            <th>Entrada (x)</th>
                            <th>➔</th>
                            <th>Saída Esperada</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${enigma.dados_teste.map(t => `
                            <tr>
                                <td><code>x = ${t.entrada}</code></td>
                                <td>➔</td>
                                <td><code class="saida-destaque">${t.saida}</code></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="code-header">
                    <span>CÓDIGO BASE</span>
                </div>
                <pre><code>${enigma.codigo_python}</code></pre>
            `;
            codeContainer.innerHTML = tabelaHtml;
            this.terminalInput.placeholder = "Digite o operador oculto (ex: **, *, //) ou 'dica'...";
        }

        else if (enigma.tipo === 'reconstrucao' && enigma.linhas_embaralhadas) {
            let reconstrucaoHtml = `
                <div class="code-header">
                    <span>LINHAS EMBARALHADAS</span>
                    <span class="file-tag">reconstruct.py</span>
                </div>
                <p class="instrucao-reconstrucao">Organize as linhas e digite a ordem correta dos números:</p>
                <div class="linhas-embaralhadas">
                    ${enigma.linhas_embaralhadas.map(linha => `
                        <div class="linha-code-item"><code>${linha}</code></div>
                    `).join('')}
                </div>
            `;
            codeContainer.innerHTML = reconstrucaoHtml;
            this.terminalInput.placeholder = "Digite a sequência correta (ex: 321 ou 132) ou 'dica'..."; 
        }

        else {
            codeContainer.innerHTML = `
                <div class="code-header">
                    <span>PYTHON CODE</span>
                    <span class="file-tag">script.py</span>
                </div>
                <pre><code id="code-content">${enigma.codigo_python || "# Sem código para esta fase"}</code></pre>
            `;
            this.terminalInput.placeholder = "Digite sua resposta ou 'dica'...";
        }
    },

    limparInput() {
        this.terminalInput.value = "";
    }
};

document.addEventListener('click', (e) => {
    if (!UI.nicknameModal.classList.contains('hidden')) {
        UI.nicknameInput.focus();
    } else {
        UI.terminalInput.focus();
    }
});

export default UI;