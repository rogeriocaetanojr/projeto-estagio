import { LitElement, html, css } from 'lit';

class InventoryApplication extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            background-color: #fce8e6;
            border: 1px solid #f8c8c4;
            border-radius: 8px;
            font-family: sans-serif;
        }
        h2 {
            color: #90261f;
            margin-top: 0;
        }
        p {
            color: #b73e35;
        }
    `;

    render() {
        return html`
            <div>
                <h2>Inventory Micro-Frontend</h2>
                <p>Este é o esqueleto do Inventory Service sendo renderizado via LitElement.</p>
            </div>
        `;
    }
}

customElements.define('inventory-application', InventoryApplication);
