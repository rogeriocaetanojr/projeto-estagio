import { LitElement, html, css } from 'lit';

class EducationApplication extends LitElement {
    static properties = {
        score: { type: Number },
        gameStatus: { type: String }, // 'idle', 'playing', 'finished'
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px 20px;
            background-color: #f4f6f9;
            box-sizing: border-box;
            width: 100%;
            min-height: 100vh;
        }

        .game-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(226, 232, 240, 0.8);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .game-header {
            background-color: #0d3168;
            color: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .game-title {
            margin: 0;
            font-size: 1.5em;
            font-weight: 700;
        }

        .game-score-board {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 1.2em;
            font-weight: bold;
        }

        .game-area {
            padding: 50px 30px;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 24px;
        }

        .game-message {
            color: #64748b;
            font-size: 1.1em;
            max-width: 500px;
            line-height: 1.5;
            margin: 0;
        }

        .btn-start {
            background-color: #00aeef;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .btn-start:hover {
            background-color: #0096ce;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 174, 239, 0.3);
        }

        .btn-start:active {
            transform: translateY(0);
        }
    `;

    constructor() {
        super();
        this.score = 0;
        this.gameStatus = 'idle';
    }

    startGame() {
        this.score = 0;
        this.gameStatus = 'playing';
        // Lógica de fases virá nos próximos commits
    }

    render() {
        return html`
            <div class="game-container">
                <header class="game-header">
                    <h2 class="game-title">Circuitos Lógicos</h2>
                    <div class="game-score-board">
                        Placar: ${this.score}
                    </div>
                </header>

                <main class="game-area">
                    ${this.gameStatus === 'idle' ? html`
                        <h3 style="color: #0d3168; margin: 0; font-size: 1.3em;">Bem-vindo ao Modo Interativo</h3>
                        <p class="game-message">
                            Teste seus conhecimentos em Tabela-Verdade e Portas Lógicas. 
                            Preencha as saídas corretamente para acumular pontos.
                        </p>
                        <button class="btn-start" @click="${this.startGame}">
                            Iniciar Jogo
                        </button>
                    ` : html`
                        <h3 style="color: #0d3168; margin: 0; font-size: 1.3em;">Fase 1: Preparando...</h3>
                        <p class="game-message">
                            (A interface do jogo será injetada aqui)
                        </p>
                    `}
                </main>
            </div>
        `;
    }
}

customElements.define('education-application', EducationApplication);
