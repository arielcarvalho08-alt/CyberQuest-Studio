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
    timerDisplay: document.getElementById('timer-display'),
    comboDisplay: document.getElementById('combo-display'),


    terminalInput: document.getElementById('terminal-input'),

    adicionarComboDisplay(combo, multiplicador) {
        if (this.comboDisplay) {
            this.comboDisplay.textContent = `COMBO: ${combo}x (x${multiplicador.toFixed(1)})`;
        }
    },

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


    mostrarMenu(nickname = "", xpGlobal = 0, avatar = null) {
        this.esconderTodas();
        if (this.screenMenu) this.screenMenu.classList.remove('hidden');
       
        const local = JSON.parse(localStorage.getItem('cyberquest_player_data') || '{}');
        const nickFinal = nickname || local.nickname || "Anon";
        const xpFinal = xpGlobal !== undefined ? xpGlobal : (local.xp || 0);

        const avatarFinal = avatar || this.avatarAtual || local.avatar || 'masculino';

        const userTag = document.getElementById('menu-user-tag');
        const xpTag = document.getElementById('menu-xp-tag');
        if (userTag) userTag.textContent = nickFinal;
        if (xpTag) xpTag.textContent = xpFinal;


        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite 1 a 7 para navegar ou 'voltar'...";
        }
        this.focarTerminalInput();

        this.esconderBalaoPensamento(avatarFinal);
        this.atualizarExpressaoMascote('normal', avatarFinal);
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
       
        if (this.codeContent) {
            this.codeContent.innerHTML = this.formatarCodigoPython(enigma.codigo);
        }

        const statusBar = document.getElementById('status-bar-gameplay');
        if (statusBar) {
            const ehTempo = stats.modoJogo === 'tempo';
            const tempoRestanteVal = stats.tempoRestante ?? 150;
            const comboVal = stats.combo ?? 0;
            const multVal = stats.multiplicador ?? 1.0;
            const recompensaVal = enigma.recompensa_xp ?? 30;
            const tempoHtml = ehTempo ? `<span class="badge-hud" id="timer-display">TEMPO: ${String(tempoRestanteVal).padStart(2, '0')}s</span>` : '';
            const comboHtml = `<span class="badge-hud" id="combo-display">COMBO: ${comboVal}x (x${multVal.toFixed(1)})</span>`;
            const recompensaHtml = `<span class="badge-hud" style="color: #33ff77; border-color: #14331c;">RECOMPENSA: +${recompensaVal} XP</span>`;

            statusBar.innerHTML = `${tempoHtml} ${comboHtml} ${recompensaHtml}`;
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
    if (xpGlobalVal >= 3500) tier = "Senior Hacker 💎";
    else if (xpGlobalVal >= 2200) tier = "SysAdmin 🥇";
    else if (xpGlobalVal >= 1000) tier = "Dev Junior 🥈";


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
    },

    mostrarMenuReset() {
        this.esconderTodas();
        if (this.screenMenu) {
            this.screenMenu.classList.remove('hidden');
            this.screenMenu.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
                    <div style="max-width: 850px; width: 100%; padding: 20px;">
                        
                        <!-- Título Principal sem as barras -->
                        <h2 style="font-family: 'Press Start 2P', cursive; font-size: 1.8rem; color: #ff3344; margin-bottom: 8px; text-shadow: 0 0 10px rgba(255, 51, 68, 0.4); line-height: 1.4;">
                            [ GERENCIAMENTO DE SISTEMA ]
                        </h2>
                        <h3 style="font-family: 'Press Start 2P', cursive; font-size: 1.2rem; color: #ffcc00; margin-bottom: 24px; letter-spacing: 1px;">
                            PROTOCOLO DE RESET
                        </h3>
                        
                        <!-- Texto maior e com a cor secundária ("transparente" igual aos parênteses) -->
                        <p style="color: #557760; font-size: 1.6rem; margin-bottom: 30px; font-family: 'VT323', monospace;">
                            Selecione o alvo da redefinição de dados na rede:
                        </p>
                        
                        <!-- Opções -->
                        <div style="display: inline-block; text-align: left; font-size: 1.5rem; font-family: 'VT323', monospace; line-height: 1.8; background: #040d06; border: 1px solid #183d20; padding: 20px 30px; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                            <p style="color: #00ff66; margin: 8px 0;"><strong style="color: #33ff77;">[1]</strong> Módulo 1: Iniciante <span style="color: #557760;">(Funciona na minha máquina)</span></p>
                            <p style="color: #00ff66; margin: 8px 0;"><strong style="color: #33ff77;">[2]</strong> Módulo 2: Intermediário <span style="color: #557760;">(Gambiarra Provisória)</span></p>
                            <p style="color: #00ff66; margin: 8px 0;"><strong style="color: #33ff77;">[3]</strong> Módulo 3: Difícil <span style="color: #557760;">(Reinicie o PC)</span></p>
                            <div style="height: 1px; background: #14331c; margin: 12px 0;"></div>
                            <p style="color: #ff3344; margin: 8px 0;"><strong style="color: #ff3344;">[4]</strong> Resetar TUDO <span style="color: #ff3344; opacity: 0.8;">(Campanha Completa)</span></p>
                            <p style="color: #88a390; margin-top: 15px;"><strong style="color: #ccc;">[0]</strong> Cancelar e Voltar ao Menu</p>
                        </div>

                    </div>
                </div>
            `;
        }
        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite 1, 2, 3, 4 ou 0 para cancelar...";
        }
        this.focarTerminalInput();
    },

    aplicarTemaMatrix() {
        document.body.style.backgroundColor = "#000000";
        document.body.style.color = "#00ff66";
        
        let containerMatrix = document.getElementById('matrix-rain-container');
        if (!containerMatrix) {
            containerMatrix = document.createElement('div');
            containerMatrix.id = 'matrix-rain-container';
            containerMatrix.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999; overflow: hidden; font-family: monospace; opacity: 0.9; font-weight: bold;";
            document.body.appendChild(containerMatrix);
        }
        containerMatrix.innerHTML = "";

        for (let i = 0; i < 250; i++) {
            let span = document.createElement('span');
            let velocidade = Math.random() * 0.6 + 0.3;
            let atraso = Math.random() * 1.0;

            span.style.cssText = `position: absolute; color: #00ff66; left: ${Math.random() * 100}%; top: -50px; font-size: ${Math.random() * 6 + 12}px; animation: cairMatrix ${velocidade}s linear infinite; animation-delay: ${atraso}s; text-shadow: 0 0 10px #00ff66;`;
            span.textContent = Math.random() > 0.5 ? "1" : "0";
            containerMatrix.appendChild(span);
        }

        if (!document.getElementById('matrix-style')) {
            const style = document.createElement('style');
            style.id = 'matrix-style';
            style.innerHTML = `@keyframes cairMatrix { to { transform: translateY(110vh); } }`;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            if (containerMatrix) {
                containerMatrix.remove();
            }
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        }, 4000);
    },

    aplicarTemaRosa() {
    let rosaStyle = document.getElementById('rosa-barbie-style');
    if (!rosaStyle) {
        rosaStyle = document.createElement('style');
        rosaStyle.id = 'rosa-barbie-style';
        rosaStyle.innerHTML = `
            /* Fundo geral preto profundo para dar destaque ao neon */
            html, body {
                background-color: #050204 !important;
                color: #ff80bf !important;
            }
            
            /* Painéis, blocos e cartões com tom roxo-escuro elegante e bordas rosa choque */
            div, section, main, header, footer, article {
                border-color: #ff2a85 !important;
            }

            .terminal-container, .modal-card, .enunciado-card, .code-box-container, .dashboard-container, .medalha-card {
                background: linear-gradient(135deg, #14051a 0%, #08010b 100%) !important;
                border: 2px solid #ff2a85 !important;
                box-shadow: 0 0 15px rgba(255, 42, 133, 0.3) !important;
            }

            /* Força a eliminação de qualquer borda verde residual no topo ou barras */
            .top-system-bar, .top-bar, .status-bar-sub, .badge-tipo, div[style*="border"] {
                border-color: #ff2a85 !important;
                background-color: #14051a !important;
            }

            /* Títulos e destaques em rosa claro brilhante e branco */
            h1, h2, h3, h4, .pixel-title, .pixel-subtitle, .enigma-titulo {
                color: #ffffff !important;
                text-shadow: 0 0 10px rgba(255, 128, 191, 0.6) !important;
            }

            /* Textos normais e códigos legíveis */
            p, span, code, pre, label, strong {
                color: #fface4 !important;
            }

            /* Cores específicas para opções e números */
            .option-num, .saida-destaque, .destaque-amarelo {
                color: #ff3399 !important;
                font-weight: bold !important;
            }

            /* Inputs e barras de terminal */
            input, textarea, .terminal-input {
                background-color: #0d0212 !important;
                color: #ffffff !important;
                border-color: #ff2a85 !important;
            }
        `;
        document.head.appendChild(rosaStyle);
    }

    if (this.terminalInput) {
        this.terminalInput.placeholder = "Modo Barbie Ativo! Digite '/off' para desativar...";
    }
},

    removerTemaRosa() {
        const rosaStyle = document.getElementById('rosa-barbie-style');
        if (rosaStyle) {
            rosaStyle.remove();
        }
        if (this.terminalInput) {
            this.terminalInput.placeholder = "Digite 1 a 7 para navegar ou 'voltar'...";
        }
    },

    mostrarBiscoitoSorte() {
        const frases = [
            "Existem 10 tipos de pessoas no mundo: as que entendem binário e as que não entendem.",
            "Primeiro, resolva o problema. Depois, escreva o código. — John Johnson",
            "O código é como humor. Quando você precisa explicá-lo, é ruim. — Cory House",
            "Funciona na minha máquina! ¯\\_(ツ)_/¯",
            "O computador faz o que você manda ele fazer, não o que você quer que ele faça.",
            "Commit frequente afasta o bug de repente.",
            "Em terra de código limpo, quem tem printf é rei.",
            "Não é um bug, é uma funcionalidade não documentada."
        ];
        
        const indiceAleatorio = Math.floor(Math.random() * frases.length);
        const fraseSorte = frases[indiceAleatorio];

        const antigo = document.getElementById('fortune-cookie-overlay');
        if (antigo) antigo.remove();

        if (!document.getElementById('cookie-anim-style')) {
            const styleAnim = document.createElement('style');
            styleAnim.id = 'cookie-anim-style';
            styleAnim.innerHTML = `
                @keyframes biscoitoEntrada {
                    0% { transform: scale(0.2) rotate(-15deg); opacity: 0; }
                    50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
                    70% { transform: scale(1) rotate(0deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes quebrarEsquerda {
                    0% { transform: translateX(0) rotate(0deg); }
                    100% { transform: translateX(-45px) rotate(-18deg); }
                }
                @keyframes quebrarDireita {
                    0% { transform: translateX(0) rotate(0deg); }
                    100% { transform: translateX(45px) rotate(18deg); }
                }
                @keyframes revelacaoPapel {
                    0% { transform: scaleX(0.05); opacity: 0; }
                    60% { opacity: 1; }
                    100% { transform: scaleX(1); opacity: 1; }
                }
                @keyframes brilhoTexto {
                    0%, 100% { text-shadow: 0 0 8px rgba(255,204,0,0.5); }
                    50% { text-shadow: 0 0 18px rgba(255,204,0,0.9); }
                }
            `;
            document.head.appendChild(styleAnim);
        }

        const overlay = document.createElement('div');
        overlay.id = 'fortune-cookie-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(2, 3, 5, 0.92);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: fadeInBat 0.3s ease-in-out;
            pointer-events: none;
        `;

        overlay.innerHTML = `
            <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 0 20px;
                animation: biscoitoEntrada 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            ">
                <h3 style="
                    color: #ffcc00; 
                    font-family: 'VT323', monospace; 
                    font-size: 2.2rem; 
                    margin-bottom: 40px; 
                    animation: brilhoTexto 2s infinite alternate;
                ">
                    [ BISCOITO DA SORTE HACKER ]
                </h3>

                <!-- ESTRUTURA COM ANIMAÇÃO DE QUEBRA -->
                <div style="
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                ">
                    <!-- Metade Esquerda -->
                    <svg width="95" height="85" viewBox="0 0 100 100" style="
                        position: relative;
                        right: -20px;
                        z-index: 3;
                        flex-shrink: 0;
                        filter: drop-shadow(-4px 4px 6px rgba(0,0,0,0.6));
                        animation: quebrarEsquerda 0.5s ease-out 0.7s forwards;
                    ">
                        <path d="M 75,15 Q 100,50 75,85 Q 50,50 75,15 Z" fill="#2d1302"/>
                        <path d="M 85,15 Q 45,5 5,50 Q 45,95 85,85 Q 65,50 85,15 Z" fill="#f59e0b" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
                        <path d="M 85,15 Q 45,25 20,50 Q 45,75 85,85" fill="none" stroke="#d97706" stroke-width="3"/>
                    </svg>

                    <!-- Fita de Papel Central (Desdobra após a quebra) -->
                    <div style="
                        position: relative;
                        background: #fff8e7;
                        color: #1e1b18;
                        font-family: 'Courier New', monospace;
                        font-size: 1rem;
                        font-weight: bold;
                        padding: 16px 35px;
                        border-radius: 4px;
                        box-shadow: 0 6px 20px rgba(0,0,0,0.7);
                        border: 1px solid #cbd5e1;
                        z-index: 2;
                        white-space: nowrap;
                        opacity: 0;
                        transform-origin: center;
                        animation: revelacaoPapel 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.9s forwards;
                    ">
                        ${fraseSorte}
                    </div>

                    <!-- Metade Direita -->
                    <svg width="95" height="85" viewBox="0 0 100 100" style="
                        position: relative;
                        left: -20px;
                        z-index: 3;
                        flex-shrink: 0;
                        filter: drop-shadow(4px 4px 6px rgba(0,0,0,0.6));
                        animation: quebrarDireita 0.5s ease-out 0.7s forwards;
                    ">
                        <path d="M 25,15 Q 0,50 25,85 Q 50,50 25,15 Z" fill="#2d1302"/>
                        <path d="M 15,15 Q 55,5 95,50 Q 55,95 15,85 Q 35,50 15,15 Z" fill="#f59e0b" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
                        <path d="M 15,15 Q 55,25 80,50 Q 55,75 15,85" fill="none" stroke="#d97706" stroke-width="3"/>
                    </svg>
                </div>

                <p style="
                    color: #ffcc00; 
                    font-family: 'VT323', monospace; 
                    font-size: 1.6rem; 
                    margin-top: 35px; 
                    text-shadow: 0 0 8px rgba(255,204,0,0.5);
                ">
                    &gt; Digite '/off' para desligar e continuar.
                </p>
            </div>
        `;

        document.body.appendChild(overlay);
    },

    ativarAlarmePolicia() {
        const alarmeAntigo = document.getElementById('fbi-alarm-overlay');
        if (alarmeAntigo) alarmeAntigo.remove();

        const overlay = document.createElement('div');
        overlay.id = 'fbi-alarm-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            pointer-events: none;
            mix-blend-mode: overlay;
            transition: background 0.08s ease-in-out;
        `;
        document.body.appendChild(overlay);

        const avisoAviso = document.createElement('div');
        avisoAviso.id = 'fbi-warning-banner';
        avisoAviso.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: #ff3333;
            border: 3px double #ff3333;
            font-family: 'Press Start 2P', 'VT323', monospace;
            padding: 30px 50px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.6);
            animation: fbiPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        `;
        avisoAviso.innerHTML = `
            <h2 style="margin: 0 0 15px 0; font-size: 1.4rem; letter-spacing: 2px;">⚠️ ALERTA DO SISTEMA ⚠️</h2>
            <p style="margin: 0 0 10px 0; font-size: 1.1rem; color: #fff;">SESSÃO COMPROMETIDA</p>
            <p style="margin: 0; font-size: 0.8rem; color: #888;">ACESSO DO FBI DETECTADO...</p>
        `;
        document.body.appendChild(avisoAviso);

        if (!document.getElementById('fbi-keyframes')) {
            const style = document.createElement('style');
            style.id = 'fbi-keyframes';
            style.innerHTML = `
                @keyframes fbiPopIn { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }

            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = null;
        let gainNode = null;

        if (audioCtx) {
            osc = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();

            osc.type = 'sawtooth';
            
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);

            let tempoAtual = audioCtx.currentTime;
            const duracaoTotalSirene = 5.0;
            const tempoCiclo = 0.4;     
            for (let t = 0; t < duracaoTotalSirene; t += tempoCiclo * 2) {
                osc.frequency.linearRampToValueAtTime(850, tempoAtual + t + tempoCiclo);
                osc.frequency.linearRampToValueAtTime(400, tempoAtual + t + tempoCiclo * 2);
            }

            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime + duracaoTotalSirene - 0.3);
            gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + duracaoTotalSirene);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duracaoTotalSirene);
        }

        let vezes = 0;
        const intervalo = setInterval(() => {
            overlay.style.backgroundColor = vezes % 2 === 0 ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 255, 0.8)";
            vezes++;
            
            if (vezes > 25) { 
                clearInterval(intervalo);
                overlay.remove();
                avisoAviso.remove();
            }
        }, 200);
    },

    ativarGlitch() {
        let vezes = 0;
        const maxGlitch = 15;
        const corOriginal = document.body.style.filter;
        const transformOriginal = document.body.style.transform;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function tocarBipErro(freq, dur, vol = 0.05) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + dur);
        }

        const intervaloGlitch = setInterval(() => {
            const skewX = (Math.random() * 8 - 4).toFixed(2);
            const skewY = (Math.random() * 8 - 4).toFixed(2); 
            const translateX = Math.floor(Math.random() * 14 - 7); 
            const translateY = Math.floor(Math.random() * 14 - 7);
            
            const sorteioEfeito = Math.random();
            if (sorteioEfeito > 0.6) {
                document.body.style.filter = "invert(1) hue-rotate(180deg) brightness(1.2)";
                tocarBipErro(120 + Math.random() * 80, 0.04, 0.04); 
            } else if (sorteioEfeito > 0.3) {
                document.body.style.filter = "contrast(3) saturate(2) brightness(0.8) blur(1px)";
                tocarBipErro(800 + Math.random() * 400, 0.03, 0.02);
            } else {
                document.body.style.filter = "none";
            }

            document.body.style.transform = `translate(${translateX}px, ${translateY}px) skew(${skewX}deg, ${skewY}deg) scale(1.02)`;

            vezes++;
            
            if (vezes > maxGlitch) {
                clearInterval(intervaloGlitch);
                document.body.style.filter = corOriginal || "none";
                document.body.style.transform = transformOriginal || "none";
            }
        }, 65);
    },

    ativarDisco() {
        const discoAntigo = document.getElementById('disco-party-overlay');
        if (discoAntigo) discoAntigo.remove();

        const overlay = document.createElement('div');
        overlay.id = 'disco-party-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 9999; pointer-events: none; overflow: hidden;
            background: rgba(4, 4, 12, 0.15);
            animation: crtOn 0.2s ease-in-out;
        `;

        overlay.innerHTML = `
            <!-- Camada Strobo com mix-blend-mode para fundir as cores com o seu terminal por baixo -->
            <div id="disco-strobe-layer" style="
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 1; mix-blend-mode: overlay; transition: background 0.06s ease-in-out;
            "></div>

            <!-- GLOBO DE DISCOTECA ESPELHADO REALISTA (Desce balançando no topo central da tela) -->
            <div style="
                position: absolute; top: 0; left: 50%;
                transform: translateX(-50%); z-index: 3;
                display: flex; flex-direction: column; align-items: center;
                animation: discoBallDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            ">
                <!-- Cabo metálico prateado com brilho realista -->
                <div style="width: 2px; height: 60px; background: linear-gradient(90deg, #555, #fff, #999, #222); box-shadow: 0 0 8px rgba(255,255,255,0.6);"></div>
                
                <!-- Globo de Cristal Espelhado Prateado com animação de rotação de brilho -->
                <div id="real-disco-ball" style="
                    width: 100px; height: 100px;
                    position: relative;
                    animation: realBallSway 3s ease-in-out infinite alternate;
                ">
                    <svg width="100" height="100" viewBox="0 0 100 100" style="filter: drop-shadow(0 6px 20px rgba(0,0,0,0.7));">
                        <defs>
                            <!-- Gradiente de base cromada/prateada de alto contraste -->
                            <linearGradient id="chromeSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="20%" stop-color="#dcdcdc"/>
                                <stop offset="45%" stop-color="#777777"/>
                                <stop offset="50%" stop-color="#f5f5f5"/>
                                <stop offset="55%" stop-color="#aaaaaa"/>
                                <stop offset="80%" stop-color="#ffffff"/>
                                <stop offset="100%" stop-color="#444444"/>
                            </linearGradient>

                            <!-- Sombreamento de Esfera 3D profunda -->
                            <radialGradient id="ball3dShade" cx="35%" cy="35%" r="65%">
                                <stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
                                <stop offset="15%" stop-color="rgba(255,255,255,0.3)"/>
                                <stop offset="60%" stop-color="rgba(0,0,0,0.1)"/>
                                <stop offset="90%" stop-color="rgba(0,0,0,0.65)"/>
                                <stop offset="100%" stop-color="rgba(0,0,0,0.9)"/>
                            </radialGradient>

                            <!-- Padrão geométrico repetitivo simulando facetas/quadradinhos de espelho verdadeiros -->
                            <pattern id="mirrorFacets" width="6" height="6" patternUnits="userSpaceOnUse">
                                <rect width="5" height="5" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
                                <rect x="0.5" y="0.5" width="4" height="4" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
                            </pattern>
                        </defs>
                        
                        <!-- 1. Fundo da esfera com o gradiente metálico cromado -->
                        <circle cx="50" cy="50" r="46" fill="url(#chromeSilver)"/>
                        
                        <!-- 2. Linhas de curvatura 3D dos espelhos (meridianos e paralelos) -->
                        <g fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="0.6">
                            <path d="M50,4 A46,46 0 0,0 50,96 M50,4 A36,46 0 0,0 50,96 M50,4 A22,46 0 0,0 50,96 M50,4 A9,46 0 0,0 50,96 M50,4 A-9,46 0 0,0 50,96 M50,4 A-22,46 0 0,0 50,96 M50,4 A-36,46 0 0,0 50,96 M50,4 A-46,46 0 0,0 50,96"/>
                            <path d="M4,50 A46,46 0 0,0 96,50 M5,37 A46,42 0 0,0 95,37 M9,25 A46,35 0 0,0 91,25 M16,14 A46,25 0 0,0 84,14 M5,63 A46,42 0 0,0 95,63 M9,75 A46,35 0 0,0 91,75 M16,86 A46,25 0 0,0 84,86"/>
                        </g>

                        <!-- 3. Sobreposição do padrão quadriculado de mosaico de vidro -->
                        <circle cx="50" cy="50" r="46" fill="url(#mirrorFacets)" style="mix-blend-mode: overlay;"/>

                        <!-- 4. Camada final de sombreamento esférico e ponto de luz estourado (Glow) -->
                        <circle cx="50" cy="50" r="46" fill="url(#ball3dShade)"/>
                        <circle cx="50" cy="50" r="46" fill="url(#chromeSilver)" style="mix-blend-mode: color-dodge; opacity: 0.3; animation: discoGlowSpin 4s linear infinite;"/>
                    </svg>

                    <!-- PONTOS DE BRILHO CINTILANTES (Glow Flares extras nas quinas da bola) -->
                    <div class="disco-flare" style="position: absolute; top: 20%; left: 20%; width: 15px; height: 15px; background: #fff; border-radius: 50%; filter: blur(2px); box-shadow: 0 0 10px #fff, 0 0 20px #fff; animation: flareBlink 0.8s infinite alternate;"></div>
                    <div class="disco-flare" style="position: absolute; bottom: 25%; right: 15%; width: 10px; height: 10px; background: #fff; border-radius: 50%; filter: blur(1px); box-shadow: 0 0 8px #fff; animation: flareBlink 0.5s infinite alternate-reverse;"></div>
                </div>
            </div>

            <!-- CANHÕES DE RAIO LASER NEON GOTHAM -->
            <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 2; opacity: 0.4;">
                <div style="position: absolute; top: 0; left: 50%; width: 4px; height: 150vh; background: linear-gradient(to bottom, #fff, #00ffbc); box-shadow: 0 0 20px #00ffbc, 0 0 40px #00ffbc; transform-origin: top center; animation: sweepL 2s ease-in-out infinite alternate;"></div>
                <div style="position: absolute; top: 0; left: 50%; width: 4px; height: 150vh; background: linear-gradient(to bottom, #fff, #ff0077); box-shadow: 0 0 20px #ff0077, 0 0 40px #ff0077; transform-origin: top center; animation: sweepR 2s ease-in-out infinite alternate;"></div>
                <div style="position: absolute; top: 0; left: 50%; width: 3px; height: 150vh; background: linear-gradient(to bottom, #fff, #00bfff); box-shadow: 0 0 20px #00bfff, 0 0 40px #00bfff; transform-origin: top center; animation: sweepL 3s ease-in-out infinite alternate-reverse;"></div>
            </div>
        `;

        if (!document.getElementById('disco-arcade-core-styles')) {
            const style = document.createElement('style');
            style.id = 'disco-arcade-core-styles';
            style.innerHTML = `
                @keyframes discoBallDrop { from { top: -150px; } to { top: 0; } }
                @keyframes realBallSway { 0% { transform: rotate(-8deg); } 100% { transform: rotate(8deg); } }
                @keyframes sweepL { 0% { transform: rotate(-60deg); } 100% { transform: rotate(30deg); } }
                @keyframes sweepR { 0% { transform: rotate(60deg); } 100% { transform: rotate(-25deg); } }
                @keyframes flareBlink { 0% { transform: scale(0.5); opacity: 0.3; } 100% { transform: scale(1.2); opacity: 1; } }
                @keyframes discoGlowSpin { 0% { transform: rotate(0deg); filter: hue-rotate(0deg); } 100% { transform: rotate(360deg); filter: hue-rotate(360deg); } }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContextClass();
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        function tocarSintetizadorAberto(frequencia, momentoSubida, tempoDuracao) {
            if (!audioCtx) return;
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const filterNode = audioCtx.createBiquadFilter();
        
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(frequencia, momentoSubida);
            
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(frequencia * 1.005, momentoSubida);
            
            filterNode.type = 'peaking';
            filterNode.frequency.setValueAtTime(1500, momentoSubida);
            filterNode.Q.setValueAtTime(2, momentoSubida);
            
            gainNode.gain.setValueAtTime(0.06, momentoSubida);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, momentoSubida + tempoDuracao);
            
            osc1.connect(filterNode);
            osc2.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc1.start(momentoSubida);
            osc2.start(momentoSubida);
            osc1.stop(momentoSubida + tempoDuracao);
            osc2.stop(momentoSubida + tempoDuracao);
        }

        const loopNotas = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 349.23, 293.66]; 
        let vezes = 0;
        const strobeLayer = document.getElementById('disco-strobe-layer');
        const coresNeon = ["rgba(255, 0, 85, 0.75)", "rgba(0, 255, 102, 0.75)", "rgba(0, 255, 255, 0.75)", "rgba(255, 204, 0, 0.75)", "rgba(153, 0, 255, 0.75)"];

        const intervaloBatida = setInterval(() => {
            if (strobeLayer) {
                strobeLayer.style.backgroundColor = coresNeon[Math.floor(Math.random() * coresNeon.length)];
            }

            const notaFrequencia = loopNotas[vezes % loopNotas.length];
            tocarSintetizadorAberto(notaFrequencia, audioCtx.currentTime, 0.13);

            vezes++;

            if (vezes > 32) {
                clearInterval(intervaloBatida);
                overlay.style.transition = "opacity 0.3s ease";
                overlay.style.opacity = "0";
                
            setTimeout(() => overlay.remove(), 300);

                if (audioCtx) audioCtx.close();
            }
        }, 150);
    },

    mostrarZelda() {
        const antigo = document.getElementById('zelda-overlay');
        if (antigo) antigo.remove();

        const overlay = document.createElement('div');
        overlay.id = 'zelda-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at center, rgba(12, 18, 8, 0.98) 0%, rgba(2, 3, 5, 1) 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: zeldaFadeIn 0.5s ease-out;
            pointer-events: none;
            overflow: hidden;
            perspective: 1000px;
        `;

        let particulasHTML = '';
        for (let i = 0; i < 20; i++) {
            const tamanho = Math.random() * 5 + 3;
            const posX = Math.random() * 100;
            const delay = Math.random() * 4;
            const duracao = Math.random() * 3 + 4;
            particulasHTML += `
                <div style="
                    position: absolute;
                    bottom: -20px;
                    left: ${posX}vw;
                    width: ${tamanho}px;
                    height: ${tamanho}px;
                    background: #ffcc00;
                    border-radius: 50%;
                    filter: blur(1px) drop-shadow(0 0 6px #f59e0b);
                    opacity: 0;
                    animation: zeldaParticles ${duracao}s linear infinite;
                    animation-delay: ${delay}s;
                "></div>
            `;
        }

        overlay.innerHTML = `
            ${particulasHTML}
            <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 0 20px;
                max-width: 600px;
                animation: zeldaPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
                <h3 style="
                    color: #ffcc00; 
                    font-family: 'Press Start 2P', cursive; 
                    font-size: 1.2rem; 
                    margin-bottom: 40px; 
                    text-shadow: 0 0 12px rgba(255,204,0,0.8);
                    letter-spacing: 2px;
                    animation: zeldaTitleGlow 2s ease-in-out infinite alternate;
                ">
                    [ LEGENDARY TREASURE ]
                </h3>

                <div style="
                    position: relative;
                    margin-bottom: 40px;
                    transform-style: preserve-3d;
                    animation: triforceFloat 3s ease-in-out infinite;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 160px;
                        height: 160px;
                        background: radial-gradient(circle, rgba(255, 204, 0, 0.25) 0%, rgba(245, 158, 11, 0) 70%);
                        filter: blur(12px);
                        animation: auraPulse 1.5s ease-in-out infinite alternate;
                    "></div>

                    <svg width="160" height="140" viewBox="0 0 100 88" style="filter: drop-shadow(0 0 20px rgba(255, 204, 0, 0.9));">
                        <polygon points="50,2 26,44 74,44" fill="#ffcc00" stroke="#b45309" stroke-width="2.5" stroke-linejoin="round"/>
                        <polygon points="24,46 2,86 50,86" fill="#ffcc00" stroke="#b45309" stroke-width="2.5" stroke-linejoin="round"/>
                        <polygon points="76,46 50,86 98,86" fill="#ffcc00" stroke="#b45309" stroke-width="2.5" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div style="
                    position: relative;
                    background: rgba(16, 21, 17, 0.95);
                    color: #33ff77;
                    font-family: 'Courier New', monospace;
                    font-size: 1.15rem;
                    font-weight: bold;
                    padding: 22px 35px;
                    border-radius: 6px;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(51,255,119,0.1);
                    border: 1px solid #183d20;
                    line-height: 1.5;
                    min-width: 460px;
                    min-height: 54px;
                ">
                    <span id="zelda-text-field"></span><span class="zelda-cursor">_</span>
                </div>

                <p style="color: #557760; font-family: 'VT323', monospace; font-size: 1.5rem; margin-top: 45px; animation: zeldaTextBlink 1.2s infinite;">
                    > Digite '/off' para desligar e continuar.
                </p>
            </div>
        `;

        if (!document.getElementById('zelda-advanced-styles')) {
            const style = document.createElement('style');
            style.id = 'zelda-advanced-styles';
            style.innerHTML = `
                @keyframes zeldaFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zeldaPopIn {
                    0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes triforceFloat {
                    0%, 100% { transform: translateY(0) rotateY(0deg); }
                    50% { transform: translateY(-12px) rotateY(8deg); }
                }
                @keyframes auraPulse {
                    0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
                    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                }
                @keyframes zeldaTitleGlow {
                    0% { text-shadow: 0 0 10px rgba(255,204,0,0.6); }
                    100% { text-shadow: 0 0 25px rgba(255,204,0,1), 0 0 10px rgba(245,158,11,0.6); color: #fff; }
                }
                @keyframes zeldaParticles {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.4; }
                    100% { transform: translateY(-105vh); opacity: 0; }
                }
                @keyframes zeldaTextBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                .zelda-cursor { animation: zeldaTextBlink 0.6s infinite; color: #33ff77; font-weight: bold; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        function tocarNota(frequencia, duracao, tipo = 'square', volume = 0.1) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = tipo;
            osc.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracao);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duracao);
        }

        setTimeout(() => {
            const notasFanfarra = [392, 440, 494, 523];
            notasFanfarra.forEach((freq, index) => {
                setTimeout(() => {
                    tocarNota(freq, 0.15, 'square', 0.15);
                }, index * 120);
            });
            setTimeout(() => tocarNota(587, 0.6, 'square', 0.15), 480); 
        }, 100);

        setTimeout(() => {
            const txt = '"It\'s dangerous to go alone! Take this code."';
            const campo = document.getElementById('zelda-text-field');
            let index = 0;
            
            function digitar() {
                if (campo && index < txt.length) {
                    campo.innerHTML += txt.charAt(index);
                    
                    if (txt.charAt(index) !== ' ') {
                        tocarNota(850, 0.03, 'triangle', 0.05); 
                    }

                    index++;
                    setTimeout(digitar, 45); 
                } else if (index >= txt.length) {
                    const cursor = document.querySelector('.zelda-cursor');
                    if (cursor) cursor.style.display = 'none';
                }
            }
            digitar();
        }, 1100); 
    },

    mostrarPacman() {
        const inputTerminal = this.terminalInput;
        if (!inputTerminal) return;

        if (this.pacmanRodando) return;
        this.pacmanRodando = true;

        const placeholderOriginal = inputTerminal.placeholder;
        
        inputTerminal.value = "";
        inputTerminal.placeholder = "";

        if (!document.getElementById('pacman-waka-style')) {
            const estilo = document.createElement('style');
            estilo.id = 'pacman-waka-style';
            estilo.textContent = `
                .pacman-waka::placeholder {
                    color: #ffff00 !important;
                    opacity: 1 !important;
                    text-shadow: 0 0 8px #ffff00;
                }
            `;
            document.head.appendChild(estilo);
        }

        const pacmanSvgAberto = `<svg width="32" height="32" viewBox="0 0 100 100" style="vertical-align: middle; display: inline-block; transform: scaleX(-1); margin: 0 4px; filter: drop-shadow(0 0 8px #ffff00);"><path d="M50 50 L90 20 A48 48 0 1 0 90 80 Z" fill="#ffff00"/></svg>`;
        const pacmanSvgFechado = `<svg width="32" height="32" viewBox="0 0 100 100" style="vertical-align: middle; display: inline-block; margin: 0 4px; filter: drop-shadow(0 0 8px #ffff00);"><circle cx="50" cy="50" r="48" fill="#ffff00"/></svg>`;

        const overlay = document.createElement('div');
        overlay.id = 'pacman-terminal-overlay';
        overlay.style.cssText = `
            position: absolute;
            left: ${inputTerminal.offsetLeft}px;
            top: ${inputTerminal.offsetTop}px;
            width: ${inputTerminal.offsetWidth}px;
            height: ${inputTerminal.offsetHeight}px;
            background: #020305;
            font-family: inherit;
            font-size: 1.6rem; 
            font-weight: bold;
            color: inherit;
            line-height: ${inputTerminal.offsetHeight}px;
            white-space: nowrap;
            overflow: hidden;
            pointer-events: none;
            z-index: 10000;
            display: flex;
            align-items: center;
        `;
        inputTerminal.parentNode.appendChild(overlay);

        const textoOriginal = "Digite 1 a 7 para navegar ou 'voltar'...";
        const espacosExtras = 40; 
        let larguraTotal = textoOriginal.length + espacosExtras;
        let posicaoPacman = larguraTotal - 1;
        let somAlternado = true;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        function tocarWaka(frequencia, duracao) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracao);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + duracao);
        }

        function tocarComendo(subindo) {
            if (!audioCtx) return;
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const filtro = audioCtx.createBiquadFilter();
            const gain = audioCtx.createGain();

            osc.type = 'square';
            filtro.type = 'lowpass';
            filtro.frequency.setValueAtTime(1400, t);

            const inicio = subindo ? 230 : 520;
            const fim = subindo ? 520 : 230;
            osc.frequency.setValueAtTime(inicio, t);
            osc.frequency.exponentialRampToValueAtTime(fim, t + 0.07);

            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

            osc.connect(filtro); filtro.connect(gain); gain.connect(audioCtx.destination);
            osc.start(t); osc.stop(t + 0.08);
        }

        const timerPacman = setInterval(() => {
            if (posicaoPacman >= 0) {
                let htmlResultado = `<span style="margin-right: 8px; font-weight: bold; color: #00ff66;">&gt;</span>`;

                for (let i = 0; i < larguraTotal; i++) {
                    if (i === posicaoPacman) {
                        htmlResultado += somAlternado ? pacmanSvgAberto : pacmanSvgFechado;
                    } else if (i < textoOriginal.length) {
                        if (i > posicaoPacman) {
                            htmlResultado += `<span style="opacity: 0;">${textoOriginal[i] === ' ' ? '&nbsp;' : textoOriginal[i]}</span>`;
                        } else {
                            htmlResultado += `<span style="color: #a0a0a0;">${textoOriginal[i] === ' ' ? '&nbsp;' : textoOriginal[i]}</span>`;
                        }
                    } else {
                        if (i > posicaoPacman) {
                            htmlResultado += `<span style="opacity: 0;">&nbsp;</span>`;
                        } else {
                            htmlResultado += `<span style="color: #ffb8ae; margin: 0 4px; text-shadow: 0 0 5px #ffb8ae;">•</span>`;
                        }
                    }
                }

                overlay.innerHTML = htmlResultado;

                tocarComendo(somAlternado);
                somAlternado = !somAlternado;

                posicaoPacman--;
            } else {
                clearInterval(timerPacman);
                overlay.remove();

                if (audioCtx) {
                    tocarWaka(587, 0.08);
                    setTimeout(() => tocarWaka(698, 0.08), 70);
                    setTimeout(() => tocarWaka(880, 0.08), 140);
                    setTimeout(() => tocarWaka(1174, 0.25), 210);
                }

                this.pacmanRodando = false;
                this.intervaloPacmanGlobal = null;

                inputTerminal.value = ""; 
                inputTerminal.classList.add('pacman-waka');
                inputTerminal.placeholder = "[ WAKA WAKA! TODOS OS BUGS FORAM DELETADOS COM SUCESSO! 💛 ]";

                setTimeout(() => {
                    inputTerminal.classList.remove('pacman-waka');
                    if (inputTerminal.placeholder.includes("WAKA WAKA!")) {
                        inputTerminal.placeholder = placeholderOriginal;
                    }
                }, 4000);
            }
        }, 75);

        this.intervaloPacmanGlobal = timerPacman;
    },

   mostrarBatman() {
        const batAntigo = document.getElementById('bat-signal-overlay');
        if (batAntigo) batAntigo.remove();

        const overlay = document.createElement('div');
        overlay.id = 'bat-signal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at center, rgba(10, 12, 18, 0.98) 0%, rgba(2, 3, 5, 1) 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: fadeInBat 0.5s ease-in-out;
            pointer-events: none; 
            overflow: hidden;
        `;

        let nuvensHTML = '';
        for (let i = 0; i < 3; i++) {
            const delay = i * 4;
            const duracao = 25 + i * 10;
            const tamanho = 500 + i * 150;
            const opacidade = 0.04 - i * 0.01;
            nuvensHTML += `
                <div style="
                    position: absolute;
                    width: ${tamanho}px;
                    height: ${tamanho}px;
                    background: radial-gradient(circle, rgba(255,255,255,${opacidade}) 0%, rgba(0,0,0,0) 70%);
                    border-radius: 50%;
                    top: ${Math.random() * 40}vh;
                    left: -600px;
                    filter: blur(40px);
                    animation: gothamClouds ${duracao}s linear infinite;
                    animation-delay: -${delay}s;
                    z-index: 1;
                "></div>
            `;
        }

        overlay.innerHTML = `
            ${nuvensHTML}
            
            <div style="
                position: relative; 
                width: 100%; 
                max-width: 900px; 
                height: 550px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
            ">
                <!-- CAMADA 1: O Holofote Gigante com animação de Falha Elétrica e Pulsação de Névoa -->
                <div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(
                        ellipse at center, 
                        rgba(255, 255, 240, 1) 0%, 
                        rgba(255, 215, 60, 0.95) 25%, 
                        rgba(210, 150, 15, 0.45) 50%, 
                        rgba(40, 45, 55, 0.1) 75%, 
                        rgba(2, 3, 5, 0) 98%
                    );
                    border-radius: 50%;
                    filter: blur(10px);
                    z-index: 2;
                    animation: batSignalFlicker 4s linear, batSignalGlow 3s ease-in-out infinite alternate;
                    animation-delay: 0s, 4s;
                "></div>

                <!-- CAMADA 2: O SVG da Sombra do Morcego -->
                <svg version="1.0" xmlns="http://w3.org" 
                    width="300" viewBox="0 0 4000 1887" 
                    preserveAspectRatio="xMidYMid meet" 
                    style="
                        z-index: 3; 
                        filter: drop-shadow(0 0 12px rgba(0,0,0,0.95)); 
                        display: block; 
                        overflow: visible;
                        animation: batSignalFlicker 4s linear;
                    ">
                    <g transform="translate(100, 1887) scale(0.1,-0.1)" fill="#020305" stroke="none">
                        <path d="M21996 18817 c-162 -161 -390 -535 -654 -1069 l-137 -278 -35 0 c-19 0 -289 18 -599 39 -320 22 -571 35 -580 31 -9 -5 -266 -25 -571 -44 -305 -20 -570 -38 -588 -41 l-34 -4 -97 202 c-289 599 -561 1039 -729 1179 -51 43 -91 17 -141 -92 -96 -207 -191 -746 -271 -1535 -27 -265 -28 -322 -11 -635 41 -742 -90 -1577 -356 -2254 -19 -50 -71 -163 -114 -251 -375 -770 -873 -1317 -1453 -1599 -589 -286 -1246 -332 -2006 -141 -671 169 -1437 549 -2089 1036 -130 96 -177 150 -283 322 -360 580 -434 1251 -218 1979 222 749 772 1595 1507 2320 156 154 159 157 146 182 -16 31 -17 31 -112 5 -1607 -444 -3151 -960 -4491 -1502 -3256 -1316 -5597 -2884 -6900 -4622 -660 -881 -1040 -1776 -1134 -2675 -9 -85 -22 -191 -27 -235 -18 -130 -23 -495 -10 -665 46 -602 199 -1196 465 -1805 78 -177 275 -560 376 -730 572 -962 1386 -1855 2441 -2677 1424 -1109 3262 -2076 5509 -2898 351 -129 1025 -360 1047 -360 8 0 33 42 33 55 0 2 -48 55 -107 117 -662 700 -1302 1590 -1694 2353 -322 628 -491 1140 -560 1700 -21 164 -16 505 10 670 61 404 212 755 459 1069 71 91 339 358 419 418 108 80 297 146 539 189 112 20 163 23 389 23 277 0 392 -11 645 -60 1137 -223 2497 -1005 3912 -2251 l117 -102 47 87 c351 644 798 1158 1171 1346 132 66 214 88 368 98 77 5 168 11 203 14 115 10 309 -45 472 -134 874 -477 1963 -1998 3126 -4367 159 -325 389 -810 514 -1088 l53 -118 31 7 c39 8 36 4 76 94 83 188 322 695 469 998 1324 2727 2569 4373 3484 4604 63 16 98 19 170 14 51 -3 142 -7 202 -10 186 -7 363 -75 559 -213 99 -71 385 -353 488 -484 168 -210 349 -483 479 -719 33 -60 63 -110 66 -110 3 0 56 45 118 100 63 55 213 183 335 284 1449 1209 2804 1905 3924 2015 162 16 464 14 608 -5 272 -35 513 -117 637 -217 352 -285 619 -657 754 -1052 83 -243 114 -422 124 -700 16 -498 -100 -1025 -365 -1650 -367 -866 -1067 -1894 -1901 -2790 -61 -66 -111 -122 -111 -125 0 -3 8 -15 18 -28 l17 -22 250 84 c1705 573 3181 1218 4455 1946 969 554 1785 1132 2525 1791 326 289 784 767 1060 1104 884 1080 1406 2222 1541 3375 21 180 29 574 16 720 -43 457 -79 698 -144 954 -305 1223 -1134 2431 -2433 3550 -2097 1805 -5426 3367 -9780 4591 -148 41 -277 78 -285 80 -10 3 -22 -6 -33 -24 l-17 -29 118 -110 c270 -253 663 -702 899 -1027 713 -982 989 -1874 809 -2610 -88 -360 -254 -646 -553 -955 -590 -609 -1329 -1110 -1998 -1354 -202 -74 -454 -136 -675 -167 -142 -20 -488 -17 -630 5 -431 67 -805 236 -1170 529 -120 97 -397 381 -514 527 -205 257 -418 596 -600 955 -122 238 -172 356 -246 571 -216 632 -321 1375 -290 2056 6 128 13 253 16 278 9 71 -56 682 -117 1100 -37 253 -99 567 -135 680 -46 148 -104 240 -151 240 -8 0 -38 -24 -67 -53z"/>
                    </g>
                </svg>
            </div>
            
            <!-- PROMPT DE COMANDO COM TYPEWRITER -->
            <p style="
                color: #ffcc00; 
                font-family: 'VT323', monospace; 
                font-size: 1.8rem; 
                margin-top: 30px; 
                text-shadow: 0 0 12px rgba(255, 204, 0, 0.6);
                z-index: 10000;
                min-height: 36px;
            ">> <span id="batman-text-field"></span><span class="batman-cursor">_</span></p>
        `;

        if (!document.getElementById('bat-styles')) {
            const style = document.createElement('style');
            style.id = 'bat-styles';
            style.innerHTML = `
                @keyframes fadeInBat { from { opacity: 0; } to { opacity: 1; } }
                @keyframes gothamClouds {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(110vw); }
                }
                @keyframes batSignalGlow {
                    0% { opacity: 0.9; transform: scale(1); filter: blur(10px); }
                    100% { opacity: 1; transform: scale(1.03); filter: blur(12px); }
                }
                /* Simulação perfeita de lâmpada falhando de gerador antigo */
                @keyframes batSignalFlicker {
                    0% { opacity: 0; } 5% { opacity: 0.8; } 7% { opacity: 0.1; }
                    11% { opacity: 0.9; } 13% { opacity: 0.2; } 20% { opacity: 1; }
                    22% { opacity: 0.1; } 24% { opacity: 0.95; } 28% { opacity: 0.3; }
                    35% { opacity: 1; } 38% { opacity: 0.1; } 42% { opacity: 1; }
                    100% { opacity: 1; }
                }
                @keyframes batTextBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                .batman-cursor { animation: batTextBlink 0.6s infinite; color: #ffcc00; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function tocarSintetizadorBatman(frequencia, duracao, delayTime, volume = 0.15) {
        if (!audioCtx) return;
        setTimeout(() => {
            const oscMain = audioCtx.createOscillator();
            const oscDetune = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            
            oscMain.type = 'sawtooth';
            oscMain.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
            
            oscDetune.type = 'sawtooth';
            oscDetune.frequency.setValueAtTime(frequencia * 1.01, audioCtx.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracao);
            
            oscMain.connect(filter);
            oscDetune.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscMain.start();
            oscDetune.start();
            oscMain.stop(audioCtx.currentTime + duracao);
            oscDetune.stop(audioCtx.currentTime + duracao);
        }, delayTime);
    }

    function dispararTrovaoHacker() {
        if (!audioCtx) return;
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, audioCtx.currentTime); 
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
    }

    tocarSintetizadorBatman(60, 0.1, 50, 0.1);
    tocarSintetizadorBatman(70, 0.08, 300, 0.1);
    tocarSintetizadorBatman(55, 0.15, 800, 0.15);

    setTimeout(() => {
        dispararTrovaoHacker();
        tocarSintetizadorBatman(116.54, 0.4, 0, 0.25);    
        tocarSintetizadorBatman(92.50,  0.4, 350, 0.25); 
        tocarSintetizadorBatman(138.59, 0.4, 700, 0.25);  
        tocarSintetizadorBatman(130.81, 0.4, 1050, 0.25); 
        tocarSintetizadorBatman(87.31,  1.2, 1400, 0.35);
    }, 1500);


    setTimeout(() => {
        const txt = "EU SOU A NOITE. (Digite '/off' para desligar o sinal)";
        const campo = document.getElementById('batman-text-field');
        let index = 0;
        
        function digitar() {
            if (campo && index < txt.length) {
                campo.innerHTML += txt.charAt(index);
        
                if (txt.charAt(index) !== ' ' && audioCtx) {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(380, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.03);
                }
                
                index++;
                setTimeout(digitar, 40);
            } else if (index >= txt.length) {
                const cursor = document.querySelector('.batman-cursor');
                if (cursor) cursor.style.display = 'none';
            }
        }
        digitar();
    }, 4500); 
},

    falsoClear() {
        const limpaAntiga = document.getElementById('clear-message-container');
        if (limpaAntiga) limpaAntiga.remove();

        if (this.screenMenu) {
            this.screenMenu.classList.remove('hidden');
            
            Array.from(this.screenMenu.children).forEach(filho => {
                if (filho.id !== 'clear-message-container') {
                    filho.style.display = 'none';
                }
            });

            const containerLimpeza = document.createElement('div');
            containerLimpeza.id = 'clear-message-container';
            containerLimpeza.style.cssText = `
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                height: 70vh; 
                text-align: center; 
                font-family: 'VT323', monospace;
                animation: fadeInBat 0.2s ease-in-out;
            `;
            containerLimpeza.innerHTML = `
                <div style="border-left: 3px solid #00ff66; padding-left: 20px; text-align: left; font-family: 'VT323', monospace;">
                    <p style="color: #00ff66; font-size: 2.5rem; margin: 0; text-shadow: 0 0 8px #00ff66, 0 0 15px rgba(0,255,102,0.4);">
                        > STDOUT: LIMPEZA_CONCLUIDA
                    </p>
                    
                    <!-- Barra de Progresso Fake -->
                    <div style="color: #00ff66; font-size: 1.2rem; margin: 10px 0 5px 0; letter-spacing: 1px; text-shadow: 0 0 5px #00ff66;">
                        [██████████████████████████████] 100%
                    </div>

                    <!-- Detalhes de Baixo Nível (Cinza Escuro) -->
                    <div style="color: #445949; font-size: 1rem; font-family: 'Courier New', monospace; line-height: 1.2; margin-top: 10px;">
                        RAM_FREE: 640KB / 640KB <br>
                        CACHE_FLUSH: ALL_BUFFERS_CLEARED <br>
                        STATUS: READY.
                    </div>
                </div>
                
                <p style="
                    color: #557760; 
                    font-size: 1.4rem; 
                    margin-top: 50px;
                    text-shadow: 0 0 2px rgba(85,119,96,0.3);
                    animation: blinkEffect 1.2s infinite;
                ">
                    [ Pressione ENTER para restaurar o sistema ]
                </p>
            `;


            this.screenMenu.appendChild(containerLimpeza);
        }
        
        if (!document.getElementById('clear-blink-style')) {
            const style = document.createElement('style');
            style.id = 'clear-blink-style';
            style.innerHTML = `
                @keyframes blinkEffect {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
    },

    mostrarCreditosEquipe() {
        const creditosAntigos = document.getElementById('credits-scroll-container');
        if (creditosAntigos) creditosAntigos.remove();

        if (this.screenMenu) {
            this.screenMenu.classList.remove('hidden');
            
            Array.from(this.screenMenu.children).forEach(filho => {
                if (filho.id !== 'credits-scroll-container') {
                    filho.style.display = 'none';
                }
            });

            const containerCreditos = document.createElement('div');
            containerCreditos.id = 'credits-scroll-container';
            containerCreditos.style.cssText = `
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: flex-start; 
                height: 70vh; 
                width: 100%;
                max-width: 700px;
                margin: 0 auto;
                text-align: center; 
                font-family: 'VT323', monospace;
                overflow: hidden; 
                position: relative;
                /* Nova animação própria combinando fade com uma leve cintilação de tela antiga */
                animation: crtOn 0.4s ease-in-out forwards;
                background: radial-gradient(circle, rgba(2,3,5,0) 60%, rgba(0,20,5,0.3) 100%);
            `;

            containerCreditos.innerHTML = `
                <div style="
                    position: absolute;
                    width: 100%;
                    animation: movieScroll 14s linear infinite;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                ">
                    <!-- Título com efeito glow neon de fósforo amarelo -->
                    <h2 style="font-family: 'Press Start 2P', cursive; font-size: 1.3rem; color: #ffcc00; margin-bottom: 25px; text-shadow: 0 0 4px #ffcc00, 0 0 12px rgba(255,204,0,0.6);">
                        [ CRÉDITOS DO SISTEMA ]
                    </h2>
                    
                    <p style="color: #33ff77; font-size: 2rem; margin: 0 0 5px 0; text-shadow: 0 0 6px rgba(51,255,119,0.5);"><strong>CyberQuest v2.0</strong></p>
                    <p style="color: #6d8575; font-size: 1.3rem; margin: 0 0 45px 0; letter-spacing: 1px;">&lt; Simulador Interativo de Programação &gt;</p>
                    
                    <!-- Lista de integrantes estilizada como blocos de código/logs sem emojis modernos -->
                    <div style="text-align: left; display: inline-block; font-size: 1.6rem; line-height: 2.2; margin-bottom: 50px; font-family: 'VT323', monospace;">
                        <p style="color: #cceedd; margin: 10px 0; text-shadow: 0 0 3px rgba(200,240,220,0.3);">
                            <span style="color: #88a390;">[SYS]</span> <strong style="color: #00ff66; text-shadow: 0 0 4px #00ff66;">Francisco Ariel:</strong> Lógica & Arquitetura
                        </p>
                        <p style="color: #cceedd; margin: 10px 0; text-shadow: 0 0 3px rgba(200,240,220,0.3);">
                            <span style="color: #88a390;">[GFX]</span> <strong style="color: #00ff66; text-shadow: 0 0 4px #00ff66;">Alana:</strong> Design & Elementos Visuais
                        </p>
                        <p style="color: #cceedd; margin: 10px 0; text-shadow: 0 0 3px rgba(200,240,220,0.3);">
                            <span style="color: #88a390;">[MTX]</span> <strong style="color: #00ff66; text-shadow: 0 0 4px #00ff66;">Jusara:</strong> Conteúdo & Enigmas
                        </p>
                    </div>

                    <p style="color: #00ff66; font-size: 1.5rem; margin: 30px 0; font-family: 'Press Start 2P', cursive; text-shadow: 0 0 5px #00ff66;">
                        OBRIGADO POR JOGAR!
                    </p>
                    
                    <p style="color: #44614e; font-size: 1.3rem; margin-top: 20px; animation: textMutedBlink 1.5s infinite;">
                        [ Pressione ENTER ou digite 'voltar' ]
                    </p>
                </div>
            `;

            this.screenMenu.appendChild(containerCreditos);
        }
        
        if (!document.getElementById('credits-scroll-style')) {
            const style = document.createElement('style');
            style.id = 'credits-scroll-style';
            style.innerHTML = `
                @keyframes movieScroll {
                    0% { top: 100%; }
                    75% { top: 5%; opacity: 1; }      /* Sobe e estabiliza perto do topo */
                    90% { top: 5%; opacity: 1; }      /* Fica parado por um tempo para leitura final */
                    100% { top: -20%; opacity: 0; }   /* Dá um fade-out suave sumindo para cima */
                }
                /* Simula a tela de fósforo ligando com uma leve variação de brilho inicial */
                @keyframes crtOn {
                    from { opacity: 0; transform: scale(0.99); filter: brightness(1.5); }
                    to { opacity: 1; transform: scale(1); filter: brightness(1); }
                }
                @keyframes textMutedBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `;
            document.head.appendChild(style);
        }
    },

    limparEfeitosVisuais() {
        const matrixContainer = document.getElementById('matrix-rain-container');
        if (matrixContainer) matrixContainer.remove();

        const rosaStyle = document.getElementById('rosa-barbie-style');
        if (rosaStyle) rosaStyle.remove();

        const batOverlay = document.getElementById('bat-signal-overlay');
        if (batOverlay) batOverlay.remove();

        const fortuneOverlay = document.getElementById('fortune-cookie-overlay');
        if (fortuneOverlay) fortuneOverlay.remove();

        const zeldaOverlay = document.getElementById('zelda-overlay');
        if (zeldaOverlay) zeldaOverlay.remove();

       const pacmanOverlay = document.getElementById('pacman-terminal-overlay');
        if (pacmanOverlay) pacmanOverlay.remove();
        if (this.intervaloPacmanGlobal) {
            clearInterval(this.intervaloPacmanGlobal);
            this.intervaloPacmanGlobal = null;
        }
        this.pacmanRodando = false;

        document.body.style.backgroundColor = "";
        document.body.style.color = "";
        document.body.style.transform = "none";
        document.body.style.filter = "none";
    },

    mostrarMascote() {
        const mascoteContainer = document.getElementById('container-mascote');
        if (mascoteContainer) mascoteContainer.classList.remove('hidden');
    },

    esconderMascote() {
        const mascoteContainer = document.getElementById('container-mascote');
        if (mascoteContainer) mascoteContainer.classList.add('hidden');
    },

    atualizarExpressaoMascote(estado, avatar = 'masculino') {
        const divMascote = document.getElementById('img-mascote');
        if (!divMascote) return;

        this.avatarAtual = avatar;

        const genero = (avatar === 'feminino') ? 'f' : 'm';

        divMascote.className = `hacker-avatar ${genero}-${estado}`;
    },

   mostrarBalaoPensamento(texto, avatar = 'masculino') {
        this.mostrarMascote();
        this.atualizarExpressaoMascote('dica', avatar);
        
        const container = document.getElementById('container-mascote');
        const balao = document.getElementById('balao-pensamento');
        const textoDica = document.getElementById('texto-dica-mascote');
        
        if (textoDica) {
            const textoLimpo = texto.replace(/<br>.*XP.*/gi, '').replace(/\[.*PENALIDADE.*\]/gi, '').trim();
            
            const jaViuEssaDica = (this.ultimaDicaExibida === textoLimpo);
            
            this.ultimaDicaExibida = textoLimpo;
            
            const htmlPenalidade = !jaViuEssaDica 
                ? `<span style="color: #ffcc00; font-size: 1.25rem; display: block; margin-top: 12px; font-family: 'VT323', monospace;">[ PENALIDADE: -15 XP por solicitar a dica! ]</span>` 
                : '';
            
            textoDica.innerHTML = `
                <strong>[ DICA ]</strong>
                <p style="margin-bottom: 12px;">${textoLimpo}</p>
                ${htmlPenalidade}
            `;
        }
        
        if (container) container.classList.remove('hidden');
        if (balao) balao.classList.remove('hidden');
    },

    esconderBalaoPensamento(avatar = 'masculino') {
        this.atualizarExpressaoMascote('normal', avatar);
        const container = document.getElementById('container-mascote');
        const balao = document.getElementById('balao-pensamento');
        
        if (container) container.classList.add('hidden');
        if (balao) balao.classList.add('hidden');
    },
}

class SoundFX {
    constructor() {
        this.ctx = null;
        this.mutado = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.mutado = !this.mutado;
        return this.mutado;
    }

    tecla() {
        if (this.mutado) return;
        this.init();
        const agora = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, agora);
        osc.frequency.exponentialRampToValueAtTime(300, agora + 0.018);
        
        gain.gain.setValueAtTime(0.12, agora);
        gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.018);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(agora);
        osc.stop(agora + 0.018);
    }

    enter() {
        if (this.mutado) return;
        this.init();
        const agora = this.ctx.currentTime;
        [440, 660].forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, agora + (index * 0.05));
            
            gain.gain.setValueAtTime(0.15, agora + (index * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, agora + (index * 0.05) + 0.08);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(agora + (index * 0.05));
            osc.stop(agora + (index * 0.05) + 0.08);
        });
    }

    acerto() {
        if (this.mutado) return;
        this.init();
        const agora = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, agora + (index * 0.07));
            gain.gain.setValueAtTime(0.15, agora + (index * 0.07));
            gain.gain.exponentialRampToValueAtTime(0.001, agora + (index * 0.07) + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(agora + (index * 0.07));
            osc.stop(agora + (index * 0.07) + 0.18);
        });
    }

    erro() {
        if (this.mutado) return;
        this.init();
        const agora = this.ctx.currentTime;
        [220, 165].forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth'; // Dá um toque retro arcade sem ser estridente neste tom
            osc.frequency.setValueAtTime(freq, agora + (index * 0.08));
            osc.frequency.exponentialRampToValueAtTime(freq - 30, agora + (index * 0.08) + 0.08);
            
            gain.gain.setValueAtTime(0.12, agora + (index * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.001, agora + (index * 0.08) + 0.08);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(agora + (index * 0.08));
            osc.stop(agora + (index * 0.08) + 0.08);
        });
    }

    dica() {
        if (this.mutado) return;
        this.init();
        const agora = this.ctx.currentTime;
        [440, 554.37, 659.25].forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, agora + (index * 0.08));
            gain.gain.setValueAtTime(0.15, agora + (index * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.001, agora + (index * 0.08) + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(agora + (index * 0.08));
            osc.stop(agora + (index * 0.08) + 0.22);
        });
    }
}

export const SFX = new SoundFX();

document.addEventListener('click', () => {
    if (UI.nicknameModal && !UI.nicknameModal.classList.contains('hidden')) {
        UI.focarNicknameInput();
    } else {
        UI.focarTerminalInput();
    }
});


export default UI;