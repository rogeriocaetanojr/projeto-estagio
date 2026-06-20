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
