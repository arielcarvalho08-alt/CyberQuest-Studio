/**
 * Interface do Terminal - CyberQuest (Sprint 1)
 */

const screens = {
    menu: document.getElementById('screen-menu'),
    game: document.getElementById('screen-game'),
    conclusion: document.getElementById('screen-conclusion')
};

function alternarTela(nomeTela) {
    Object.keys(screens).forEach(key => {
        if (screens[key]) {
            screens[key].classList.add('hidden');
        }
    });
    if (screens[nomeTela]) {
        screens[nomeTela].classList.remove('hidden');
    }
}

function exibirFeedback(texto, tipo = 'error') {
    const feedbackBox = document.getElementById('feedback-message');
    if (!feedbackBox) return;

    feedbackBox.textContent = texto;
    feedbackBox.className = `feedback-message ${tipo}`;
    feedbackBox.classList.remove('hidden');

    setTimeout(() => {
        feedbackBox.classList.add('hidden');
    }, 3200);
}

function atualizarTopBar(faseAtual, totalFases) {
    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.remove('hidden');

    const phaseDisplay = document.getElementById('phase-display');
    if (phaseDisplay) phaseDisplay.textContent = `${faseAtual}/${totalFases}`;
}