import { LitElement, html, css } from 'lit';

class InventoryApplication extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            background-color: #fff3e0;
            border: 1px solid #ffe0b2;
            border-radius: 8px;
            font-family: sans-serif;
        }
        h2 {
            color: #e65100;
            margin-top: 0;
        }
        p {
            color: #f57c00;
        }
        .item-card {
            background: white;
            padding: 12px;
            margin-top: 10px;
            border-radius: 6px;
            border-left: 4px solid #e65100;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .quantity {
            font-weight: bold;
            color: #e65100;
            background: #ffe0b2;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 0.9em;
        }
    `;

    static properties = {
        items: { type: Array }
    };

    constructor() {
        super();
        this.items = [
            { id: 101, name: 'Notebook Pro 15"', qty: 5 },
            { id: 102, name: 'Monitor UltraWide 29"', qty: 12 },
            { id: 103, name: 'Teclado Mecânico RGB', qty: 8 }
        ];
    }

    render() {
        return html`
            <div>
                <h2>Inventory Micro-Frontend</h2>
                <p>Controle de insumos e ativos locais do sistema:</p>
                
                ${this.items.map(item => html`
                    <div class="item-card">
                        <div>
                            <strong>${item.name}</strong>
                            <br/>
                            <small style="color: #777;">ID: ${item.id}</small>
                        </div>
                        <span class="quantity">${item.qty} un</span>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('inventory-application', InventoryApplication);
