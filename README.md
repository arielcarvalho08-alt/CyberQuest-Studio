# ⚡ CyberQuest Studio

> Um jogo de enigmas focado em Python com interface interativa em estilo terminal, projetado para transformar o aprendizado de programação em uma experiência imersiva e gamificada.

---

## 🎮 Sobre o Projeto

O **CyberQuest Studio** é uma plataforma de desafios onde o jogador assume o papel de um hacker. Através de um terminal de comandos simulado diretamente no navegador, é necessário resolver problemas de lógica, engenharia reversa e reconstrução de código para ganhar pontos de experiência (XP), subir de patente e conquistar medalhas.

### 🕹️ Modos de Jogo
* **Modo Campanha (Normal):** Evolução linear dividida em módulos (Iniciante, Júnior, etc.) com 45 enigmas eletrônicos no total.
* **Modo Contra o Tempo (Arcade):** Desafios rápidos com cronômetro regressivo e mecânica de multiplicadores por Combo.

---

## 🚀 Funcionalidades Principais

* **Interface Hacking Style:** Console interativo via comandos de terminal (ex: digite `1` para jogar, `dica` para ajuda).
* **Mecânicas de Gamificação:**
  * Painel de Controle (Dashboard) de estatísticas em tempo real.
  * Sistema de Tiers Dinâmicos (de *Script Kiddie* a *Senior Hacker*).
  * Recompensas por Combo de acertos seguidos e perda de XP ao solicitar pistas.
* **Tipos de Enigmas:**
  * **Engenharia Reversa:** Dedução de operadores lógicos com tabelas de Entrada (x) e Saída Esperada.
  * **Reconstrução:** Ordenação de linhas de código Python embaralhadas.
  * **Análise Clássica:** Interpretação e correção de scripts.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído puramente com tecnologias web nativas para garantir máxima performance e portabilidade:

* **HTML5:** Estruturação das telas de menu, jogo e modais.
* **CSS3:** Estilização responsiva em tema *Dark / Matrix*, efeitos de brilho neon e animações de feedback crítico.
* **JavaScript (ES6+):** Arquitetura orientada a objetos gerenciando o estado global do jogo, manipulação assíncrona do DOM (`UI.js`) e persistência de dados local.
* **LocalStorage API:** Salvamento automático de nickname, histórico de progresso e recordes globais do jogador.

---

## 📦 Como Executar o Projeto Localmente

1. **Clone este repositório:**
   ```bash
   git clone https://github.com
   ```

2. **Navegue até a pasta:**
   ```bash
   cd CyberQuest-Studio
   ```

3. **Abra o projeto:**
   * Execute o arquivo `index.html` diretamente no seu navegador, ou
   * Utilize a extensão **Live Server** no VS Code para rodar um servidor de testes local.

---

## 🤝 Contribuição

Gostou do projeto e quer adicionar novos enigmas ou melhorias na interface?
1. Faça um **Fork** do projeto.
2. Crie uma nova branch com sua alteração: `git checkout -b feature/novo-enigma`.
3. Salve suas alterações: `git commit -m 'Feat: Adicionando enigma de loops'`.
4. Envie para o repositório: `git push origin feature/novo-enigma`.
5. Abra um **Pull Request**.

---
<p align="center">Desenvolvido por CyberQuest Studio 💻</p>
