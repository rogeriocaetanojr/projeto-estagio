import { LitElement, html, css } from 'lit';

class AuthApplication extends LitElement {
  static styles = css`
    :host {
      --primary-dark: #0d3168;
      --primary-light: #00aeef;
      --bg: #f4f7f6;
      --text: #1f2a3d;
      --muted: #6b7280;
      --border: #e5e7eb;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: block;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      background-color: var(--bg);
      color: var(--text);
    }
    * { box-sizing: border-box; }

    .container {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .brand-panel {
      flex: 1;
      background: linear-gradient(160deg, var(--primary-dark), var(--primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .form-panel {
      flex: 1;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
    @media (max-width: 900px) {
      .container {
        flex-direction: column;
      }
      .brand-panel {
        flex: none;
        min-height: 200px;
      }
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="brand-panel">Painel da Marca (em construção)</div>
        <div class="form-panel">Login (em construção)</div>
      </div>
    `;
  }
}

customElements.define('auth-application', AuthApplication);
