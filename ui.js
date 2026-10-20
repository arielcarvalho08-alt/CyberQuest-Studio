const UI = {
    screenMenu: document.getElementById('screen-menu'),
    screenModulos: document.getElementById('screen-modulos'),
    screenModos: document.getElementById('screen-modos'),
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
    moduloSelecionadoLabel: document.getElementById('modulo-selecionado-label'),

    timerDisplay: document.getElementById('timer-display'),
    comboDisplay: document.getElementById('combo-display'),

    modalOverlay: document.getElementById('modal-overlay'),
    modalCard: document.getElementById('modal-card'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),

    terminalInput: document.getElementById('terminal-input'),

    esconderTodas() {
        if (this.screenMenu) this.screenMenu.classList.add('hidden');
        if (this.screenModulos) this.screenModulos.classList.add('hidden');
        if (this.screenModos) this.screenModos.classList.add('hidden');
        if (this.screenGame) this.screenGame.classList.add('hidden');
        if (this.screenConclusion) this.screenConclusion.classList.add('hidden');
    },

    focarNicknameInput() {
        setTimeout(() => {
            if (this.nicknameInput) this.nicknameInput.focus();
        }, 50);
    },

    focarTerminalInput() {
        setTimeout(() => {
            if (this.terminalInput && this.nicknameModal && this.nicknameModal.classList.contains('hidden')) {
                this.terminalInput.focus();
            }
        }, 50);
    },

    limparInput() {
        if (this.terminalInput) this.terminalInput.value = "";
    },

    mostrarMenu(nickname = "", xpGlobal = 0) {
        this.esconderTodas();
        if (this.screenMenu) this.screenMenu.classList.remove('hidden');
        
        const local = JSON.parse(localStorage.getItem('cyberquest_player_data') || '{}');
        const nickFinal = nickname || local.nickname || "Anon";
        const xpFinal = xpGlobal !== undefined ? xpGlobal : (local.xp || 0);

        const userTag = document.getElementById('menu-user-tag');
        const xpTag = document.getElementById('menu-xp-tag');
        if (userTag) userTag.textContent = nickFinal;
        if (xpTag) xpTag.textContent = xpFinal;

        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite 1 a 6 para navegar ou 'voltar'...";
        }
        this.focarTerminalInput();
    },

    mostrarModulos(modulosDesbloqueados = [1]) {
        this.esconderTodas();
        if (this.screenModulos) {
            this.screenModulos.classList.remove('hidden');
            for (let i = 1; i <= 3; i++) {
                const badge = document.getElementById(`badge-mod-${i}`);
                if (badge) {
                    if (modulosDesbloqueados.includes(i)) {
                        badge.textContent = "🔓 LIBERADO";
                        badge.className = "status-badge unlocked";
                    } else {
                        badge.textContent = "🔒 BLOQUEADO";
                        badge.className = "status-badge locked";
                    }
                }
            }
        }
        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite o Módulo (1, 2 ou 3) ou 'voltar'...";
        }
        this.focarTerminalInput();
    },

    mostrarModosJogo(nomeModulo) {
        this.esconderTodas();
        if (this.screenModos) {
            this.screenModos.classList.remove('hidden');
            if (this.moduloSelecionadoLabel) {
                this.moduloSelecionadoLabel.textContent = `Módulo Ativo: ${nomeModulo}`;
            }
        }
        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite 1 (Normal), 2 (Contra o Tempo) ou 'voltar'...";
        }
        this.focarTerminalInput();
    },

    mostrarJogo() {
        this.esconderTodas();
        if (this.screenGame) this.screenGame.classList.remove('hidden');
        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite sua resposta, 'dica' ou 'voltar'...";
        }
        this.focarTerminalInput();
    },

    mostrarConclusao(nivelNome, progressoTexto, xpModulo = 0, medalhaInfo = { emoji: "🥇", titulo: "Medalha de Ouro" }) {
        this.esconderTodas();
        if (this.screenConclusion) this.screenConclusion.classList.remove('hidden');
        
        const congratsMsg = document.getElementById('congrats-msg');
        const conclusionProgress = document.getElementById('conclusion-progress');
        const medalhaEmoji = document.getElementById('medalha-icone');
        const medalhaTexto = document.getElementById('medalha-titulo');
        const xpResultadoTexto = document.getElementById('xp-modulo-resultado');

        if (congratsMsg) congratsMsg.textContent = `Parabéns! Você concluiu o ${nivelNome}!`;
        if (conclusionProgress) conclusionProgress.textContent = progressoTexto;
        if (medalhaEmoji) medalhaEmoji.textContent = medalhaInfo.emoji;
        if (medalhaTexto) medalhaTexto.textContent = `${medalhaInfo.titulo} Conquistada!`;
        if (xpResultadoTexto) xpResultadoTexto.textContent = `+${xpModulo} XP obtidos neste Módulo`;

        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite 1 para Menu ou 2 para Próximo Módulo...";
        }
        this.focarTerminalInput();
    },

    formatarCodigoPython(codigo) {
        if (!codigo) return '<span style="color: #666;"># Nenhum código para este enigma</span>';
        const linhas = codigo.trim().split('\n');
        return linhas.map((linha, index) => {
            const numLinha = String(index + 1).padStart(2, '0');
            return `<span style="color: #555; margin-right: 12px; user-select: none;">${numLinha} |</span>${linha}`;
        }).join('\n');
    },

    carregarEnigma(enigma, indiceAtual, totalEnigmas, nivelNome = "Iniciante", stats = {}) {
        let nomeEnigma = enigma.titulo || "";
        if (nomeEnigma.includes('-')) {
            nomeEnigma = nomeEnigma.split('-').slice(1).join('-').trim();
        }
        
        const numFaseFormatado = String(indiceAtual + 1).padStart(2, '0');
        const tituloFormatado = nomeEnigma ? `Fase ${numFaseFormatado} - ${nomeEnigma}` : `Fase ${numFaseFormatado}`;

        if (this.tipoTag) this.tipoTag.textContent = `${enigma.tipo || "geral"} | ${nivelNome.toUpperCase()}`;
        if (this.tituloTag) this.tituloTag.textContent = tituloFormatado;
        
        const txtProgresso = `${indiceAtual + 1}/${totalEnigmas}`;
        if (this.gameProgress) this.gameProgress.textContent = txtProgresso;
        if (this.menuProgress) this.menuProgress.textContent = txtProgresso;
        
        if (this.enunciadoText) this.enunciadoText.textContent = enigma.enunciado;
        
        const statusBar = document.getElementById('status-bar-gameplay');
        if (statusBar) {
            const ehTempo = stats.modoJogo === 'tempo';
            const tempoHtml = ehTempo ? `<span class="badge-hud" id="timer-display">TEMPO: ${String(stats.tempoRestante || 150).padStart(2, '0')}s</span>` : '';
            const comboHtml = `<span class="badge-hud" id="combo-display">COMBO: ${stats.combo || 0}x (x${(stats.multiplicador || 1.0).toFixed(1)})</span>`;
            const xpHtml = `<span class="badge-hud" style="color: #33ff77; border-color: #183d20;">RECOMPENSA: +${stats.xpFase || 40} XP</span>`;
            
            statusBar.innerHTML = `${tempoHtml} ${comboHtml} ${xpHtml}`;
        }

        const codeContainer = document.querySelector('.code-box-container');
        if (!codeContainer) return;

        const placeholderDica = "Digite sua resposta, 'dica' (-15 XP) ou 'voltar'...";

        if (enigma.tipo === 'engenharia_reversa' && enigma.dados_teste) {
            codeContainer.innerHTML = `
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
                <div class="code-header"><span>CÓDIGO BASE</span></div>
                <pre class="python-compiler"><code>${this.formatarCodigoPython(enigma.codigo_python)}</code></pre>
            `;
            if (this.terminalInput) {
                this.terminalInput.placeholder = "Digite o operador, 'dica' (-15 XP) ou 'voltar'...";
            }
        } else if (enigma.tipo === 'reconstrucao' && enigma.linhas_embaralhadas) {
            codeContainer.innerHTML = `
                <div class="code-header">
                    <span>LINHAS EMBARALHADAS</span>
                    <span class="file-tag">reconstruct.py</span>
                </div>
                <p class="instrucao-reconstrucao">Organize as linhas e digite a ordem correta:</p>
                <div class="linhas-embaralhadas">
                    ${enigma.linhas_embaralhadas.map((linha, idx) => {
                        const linhaLimpa = linha.toString().replace(/([a-z]*vert|ert)\{\}/gi, '').trim();
                        return `
                            <div class="linha-code-item">
                                <span style="color: #555; margin-right: 12px; user-select: none;">0${idx + 1} \v|</span><code>${linhaLimpa}</code>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            if (this.terminalInput) {
                this.terminalInput.placeholder = "Digite a sequência (ex: 321), 'dica' (-15 XP) ou 'voltar'...";
            }
        } else {
            codeContainer.innerHTML = `
                <div class="code-header">
                    <span>PYTHON CODE</span>
                    <span class="file-tag">script.py</span>
                </div>
                <pre class="python-compiler"><code>${this.formatarCodigoPython(enigma.codigo_python)}</code></pre>
            `;
            if (this.terminalInput) {
                this.terminalInput.placeholder = placeholderDica;
            }
        }

        this.focarTerminalInput();
    },

    abrirModal(titulo, mensagem, tipo = 'info') {
        if (this.modalCard) this.modalCard.className = `modal-card ${tipo}`;
        if (this.modalTitle) this.modalTitle.textContent = titulo;
        if (this.modalText) this.modalText.innerHTML = mensagem;
        if (this.modalOverlay) this.modalOverlay.classList.remove('hidden');
    },

    fecharModal() {
        if (this.modalOverlay) this.modalOverlay.classList.add('hidden');
        this.focarTerminalInput();
    },

    abrirNicknameModal() {
        if (this.nicknameModal) this.nicknameModal.classList.remove('hidden');
        const instrucao = document.querySelector('#nickname-instrucao');
        if (instrucao) {
            instrucao.textContent = "Digite o seu nickname Hacker. Progresso será carregado!";
        }
        if (this.nicknameInput) {
            this.nicknameInput.placeholder = "Ex: CyberDev";
        }
        this.focarNicknameInput();
    },

    fecharNicknameModal() {
        if (this.nicknameModal) this.nicknameModal.classList.add('hidden');
        this.focarTerminalInput();
    },

    atualizarTimerDisplay(segundos) {
        const timerEl = document.getElementById('timer-display');
        if (timerEl) {
            timerEl.textContent = `TEMPO: ${String(segundos).padStart(2, '0')}s`;
            if (segundos <= 10) {
                timerEl.classList.add('tempo-critico');
            } else {
                timerEl.classList.remove('tempo-critico');
            }
        }
    },

    atualizarComboDisplay(combo, multiplicador) {
        const comboEl = document.getElementById('combo-display');
        if (comboEl) {
            comboEl.textContent = `COMBO: ${combo}x (x${multiplicador.toFixed(1)})`;
        }
    },

    exibirDashboard(dados) {
    let xpGlobalVal = dados.xp_global || ((dados.xp || 0) + (dados.xp_tempo_max || 0));
    let tier = "Script Kiddie 🥉";
    if (xpGlobalVal >= 1500) tier = "Senior Hacker 💎";
    else if (xpGlobalVal >= 800) tier = "SysAdmin 🥇";
    else if (xpGlobalVal >= 300) tier = "Dev Junior 🥈";

    const html = `
        <div class="dashboard-container">
            <p><strong>NICKNAME:</strong> <span style="color: #00ff66;">${dados.nickname}</span></p>
            <p><strong>PATAMAR / TIER:</strong> <span style="color: #ffcc00;">${tier}</span></p>
            <p><strong>XP GLOBAL (RANKING):</strong> <span class="destaque-amarelo">${xpGlobalVal} XP</span></p>
            <hr style="border-color: #00ff66; opacity: 0.2; margin: 10px 0;">
            
            <p style="color: #00ff66; font-weight: bold;">[ MODO NORMAL (CAMPANHA) ]</p>
            <p>• Fase Global Concluída: ${dados.fase_atual || 0} / 45</p>
            <p>• Módulo Atual: ${dados.nivelAtual || 'Iniciante'}</p>
            <p>• Resolvidos neste Módulo: ${dados.resolvidosModulo || 0} / 15</p>
            <p>• XP Acumulado na Campanha: ${dados.xp || 0} XP</p>
            
            <hr style="border-color: #00ff66; opacity: 0.1; margin: 5px 0;">
            
            <p style="color: #ff3377; font-weight: bold;">[ MODO CONTRA O TEMPO (ARCADE) ]</p>
            <p>• Recorde de XP: ${dados.xp_tempo_max || 0} XP</p>
        </div>
    `;

    this.abrirModal("[ DASHBOARD DO JOGADOR ]", html, "info");
    },

    exibirRanking(rankingData) {
        if (!rankingData || rankingData.length === 0) {
            const htmlVazio = `
                <div class="dashboard-container" style="text-align: center;">
                    <p>Nenhum registro encontrado no ranking do Supabase.</p>
                    <p style="color: #888; font-size: 0.9rem; margin-top: 10px;">Pressione ENTER para fechar</p>
                </div>
            `;
            this.abrirModal("[ RANKING GLOBAL TIERLIZADO ]", htmlVazio, "info");
            return;
        }

        const linhasHtml = rankingData.map(j => `
            <tr>
                <td style="text-align: center;">${j.medalha} ${j.posicao}º</td>
                <td class="destaque-verde">${j.nickname}</td>
                <td class="destaque-amarelo" style="text-align: right;">${j.xp} XP</td>
                <td style="text-align: center;">${j.tier}</td>
            </tr>
        `).join('');

        const htmlRanking = `
            <div class="dashboard-container">
                <table class="tabela-ranking">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Pos</th>
                            <th style="width: 35%;">Hacker</th>
                            <th style="width: 25%;">XP Total</th>
                            <th style="width: 25%;">Tier</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linhasHtml}
                    </tbody>
                </table>
                <p style="color: #888; font-size: 0.85rem; text-align: center; margin-top: 10px;">Pressione ENTER para fechar</p>
            </div>
        `;

        this.abrirModal("[ RANKING GLOBAL TIERLIZADO ]", htmlRanking, "sucesso");
    }
};

document.addEventListener('click', () => {
    if (UI.nicknameModal && !UI.nicknameModal.classList.contains('hidden')) {
        UI.focarNicknameInput();
    } else {
        UI.focarTerminalInput();
    }
});

export default UI;