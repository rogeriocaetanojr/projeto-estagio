import { LitElement, html, css } from 'lit';

class CommunityApplication extends LitElement {
    // Definição dos estilos com a tag css do Lit (mantém o Shadow DOM encapsulado)
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            background-color: #f0f4f8;
            border: 1px solid #d9e2ec;
            border-radius: 8px;
            font-family: sans-serif;
        }
        h2 {
            color: #102a43;
            margin-top: 0;
        }
        p {
            color: #334e68;
        }
    `;

    // Método render retorna o template HTML reativo
    render() {
        return html`
            <div>
                <h2>Community Micro-Frontend</h2>
                <p>Este é o esqueleto do Community Service sendo renderizado via LitElement.</p>
            </div>
        `;
    }
}

// Registro do Custom Element
customElements.define('community-application', CommunityApplication);
