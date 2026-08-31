/**
 * Interface do Terminal - CyberQuest
 */

const screens = {
    menu: document.getElementById('screen-menu'),
    game: document.getElementById('screen-game'),
    conclusion: document.getElementById('screen-conclusion')
};

function alternarTela(nomeTela) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.add('hidden');
    });
    if (screens[nomeTela]) {
        screens[nomeTela].classList.remove('hidden');
    }
};

function exibirFeedback(texto, tipo = 'error') {
    const feedbackBox = document.getElementById('feedback-message');
    feedbackBox.textContent = texto;
    feedbackBox.className = `feedback-message0 ${tipo}`;
    fedbackBox.classList.remove('hidden');

    setTimeout(() => {
        feedbackBox.classList.add('hidden');
    }, 3200);
}

function atualizarTopBar(faseAtual, totalFases) {
    document.getElementById('top-bar').classList.remove('hidden');
    document.getElementById('phase-display').textContent = `${faseAtual}/${totalFases}`;
}



