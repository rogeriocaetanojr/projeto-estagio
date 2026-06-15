class EducationApplication extends HTMLElement {
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
                    background-color: #e3f8fa;
                    border: 1px solid #b4e4e9;
                    border-radius: 8px;
                    font-family: sans-serif;
                }
                h2 {
                    color: #0b5c66;
                    margin-top: 0;
                }
                p {
                    color: #178390;
                }
            </style>
            <div>
                <h2>Education Micro-Frontend</h2>
                <p>Este é o esqueleto do Education Service sendo renderizado via Web Component.</p>
            </div>
        `;
    }
}

customElements.define('education-application', EducationApplication);
