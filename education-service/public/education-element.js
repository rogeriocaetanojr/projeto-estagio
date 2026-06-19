import { LitElement, html, css } from 'lit';

class EducationApplication extends LitElement {
    static styles = css`
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
    `;

    render() {
        return html`
            <div>
                <h2>Education Micro-Frontend</h2>
                <p>Este é o esqueleto do Education Service sendo renderizado via LitElement.</p>
            </div>
        `;
    }
}

customElements.define('education-application', EducationApplication);
