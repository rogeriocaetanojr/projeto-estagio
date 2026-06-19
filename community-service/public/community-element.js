import { LitElement, html, css } from 'lit';

class CommunityApplication extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            background-color: #f3e5f5;
            border: 1px solid #e1bee7;
            border-radius: 8px;
            font-family: sans-serif;
        }
        h2 {
            color: #4a148c;
            margin-top: 0;
        }
        p {
            color: #7b1fa2;
        }
        .user-card {
            background: white;
            padding: 12px;
            margin-top: 10px;
            border-radius: 6px;
            border-left: 4px solid #4a148c;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .badge {
            display: inline-block;
            background: #e1bee7;
            color: #4a148c;
            font-size: 0.8em;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 5px;
        }
    `;

    static properties = {
        users: { type: Array }
    };

    constructor() {
        super();
        this.users = [
            { id: 1, email: 'rogerio.caetano@unisenai.edu.br', status: 'Online' },
            { id: 2, email: 'natalia.cunha@dev.com', status: 'Offline' }
        ];
    }

    render() {
        return html`
            <div>
                <h2>Community Micro-Frontend</h2>
                <p>Membros da comunidade integrados ao ecossistema:</p>
                
                ${this.users.map(user => html`
                    <div class="user-card">
                        <strong>Usuário ID: ${user.id}</strong>
                        <div>E-mail: ${user.email}</div>
                        <span class="badge">${user.status}</span>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('community-application', CommunityApplication);
