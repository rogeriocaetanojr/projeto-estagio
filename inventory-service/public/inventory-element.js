import { LitElement, html, css } from 'lit';

class InventoryApplication extends LitElement {
    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px 20px;
            background-color: transparent;
            box-sizing: border-box;
            width: 100%;
        }

        .inventory-container {
            background: var(--card-bg, white);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8));
            padding: 35px 30px;
            max-width: 800px;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .inventory-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid var(--border-color, #f1f5f9);
            padding-bottom: 16px;
            margin-bottom: 20px;
            gap: 12px;
            flex-wrap: wrap;
        }

        .inventory-title {
            color: var(--title-color, #0d3168);
            font-size: 1.3em;
            font-weight: 700;
            margin: 0;
        }

        .integration-badge {
            display: inline-block;
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fde68a;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        :host-context(.dark-theme) .integration-badge {
            background: rgba(180, 83, 9, 0.2);
            color: #fde68a;
            border-color: rgba(180, 83, 9, 0.5);
        }

        .item-card {
            padding: 16px 0;
            border-bottom: 1px solid var(--border-color, #f1f5f9);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .item-card:last-child {
            border-bottom: none;
        }

        .quantity {
            font-weight: 600;
            color: var(--title-color, #0d3168);
            background: var(--item-hover, #f1f5f9);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.88em;
            border: 1px solid var(--border-color, #e2e8f0);
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
            <div class="inventory-container">
                <div class="inventory-header">
                    <h2 class="inventory-title">Módulo de Inventário — Controle de Ativos</h2>
                    <span class="integration-badge">Em Integração</span>
                </div>
                
                <div class="items-list">
                    ${this.items.map(item => html`
                        <div class="item-card">
                            <div>
                                <strong style="color: var(--text-main, #1e293b); font-size: 0.98em;">${item.name}</strong>
                                <br/>
                                <small style="color: var(--text-muted, #64748b); font-size: 0.8em; font-weight: 500;">ID: ${item.id}</small>
                            </div>
                            <span class="quantity">${item.qty} un</span>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }
}

customElements.define('inventory-application', InventoryApplication);
