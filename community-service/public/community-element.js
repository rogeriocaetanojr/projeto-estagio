class CommunityApplication extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
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
            </style>
            <div>
                <h2>Community Micro-Frontend</h2>
                <p>Este é o esqueleto do Community Service sendo renderizado via Web Component.</p>
            </div>
        `;
    }
}

customElements.define('community-application', CommunityApplication);
