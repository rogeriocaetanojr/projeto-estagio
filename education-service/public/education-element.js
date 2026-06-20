import { LitElement, html, css } from 'lit';

class EducationApplication extends LitElement {
    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px 20px;
            background-color: #f4f6f9;
            box-sizing: border-box;
            width: 100%;
        }

        .education-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 400px;
        }

        .placeholder-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(226, 232, 240, 0.8);
            padding: 50px 30px;
            max-width: 550px;
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            box-sizing: border-box;
        }

        .wait-icon-container {
            position: relative;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .wait-icon {
            width: 52px;
            height: 52px;
            fill: #00aeef;
            animation: spin 4s linear infinite;
            z-index: 2;
        }

        .pulse-ring {
            position: absolute;
            width: 68px;
            height: 68px;
            border: 2px solid #00aeef;
            border-radius: 50%;
            animation: pulse 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            opacity: 0;
            box-sizing: border-box;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
            0% {
                transform: scale(0.7);
                opacity: 0;
            }
            50% {
                opacity: 0.4;
            }
            100% {
                transform: scale(1.2);
                opacity: 0;
            }
        }

        .placeholder-title {
            color: #0d3168;
            font-size: 1.45em;
            font-weight: 700;
            margin: 0;
        }

        .placeholder-message {
            color: #64748b;
            font-size: 0.98em;
            line-height: 1.6;
            margin: 0;
            max-width: 460px;
        }
    `;

    render() {
        return html`
            <div class="education-container">
                <div class="placeholder-card">
                    <div class="wait-icon-container">
                        <div class="pulse-ring"></div>
                        <svg class="wait-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                    </div>
                    <h2 class="placeholder-title">Módulo de Educação — Jogo de Lógica</h2>
                    <p class="placeholder-message">
                        Área reservada para o Modo Interativo de Ensino. O jogo de tabela-verdade será integrado neste espaço assim que o microsserviço correspondente for implantado.
                    </p>
                </div>
            </div>
        `;
    }
}

customElements.define('education-application', EducationApplication);
