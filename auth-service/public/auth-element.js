import { LitElement, html, css } from 'lit';

class AuthApplication extends LitElement {
  static properties = {
    profileType: { type: String }, // 'STUDENT' | 'PROFESSOR'
    email: { type: String },
    password: { type: String },
    loading: { type: Boolean },
    error: { type: String },
  };

  constructor() {
    super();
    this.profileType = 'STUDENT';
    this.email = '';
    this.password = '';
    this.loading = false;
    this.error = '';
  }

  handleInput(e) {
    this[e.target.name] = e.target.value;
  }

  setRole(role) {
    this.profileType = role;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.error = '';

    // validação simples no front
    if (!this.email || !this.password) {
      this.error = 'Preencha e-mail e senha.';
      return;
    }

    this.loading = true;
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      if (!response.ok) {
        // tenta ler a mensagem do back; senão usa uma genérica
        let msg = 'E-mail ou senha inválidos.';
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            msg = Array.isArray(errData.message) ? errData.message[0] : errData.message;
          }
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await response.json();
      const token = data.access_token;
      const user = data.user;

      // persiste localmente (o shell também persiste ao receber o evento, mas garantimos aqui)
      localStorage.setItem('portal_token', token);
      if (user) localStorage.setItem('portal_user', JSON.stringify(user));

      console.log('Login realizado com sucesso:', user);

      // dispara o evento que o shell escuta
      this.dispatchEvent(new CustomEvent('auth-success', {
        detail: { token, user },
        bubbles: true,
        composed: true,
      }));
    } catch (err) {
      this.error = err.message || 'Ocorreu um erro inesperado. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }

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
      background-color: var(--primary-dark);
      color: white;
      display: flex;
      align-items: center;
      padding: 3rem;
    }
    .brand-inner {
      max-width: 520px;
    }
    .brand-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
      margin-bottom: 3.5rem;
    }
    .brand-logo {
      width: 190px;
      height: auto;
    }
    .brand-content h1 {
      font-size: 2.6rem;
      line-height: 1.2;
      margin: 0 0 1.5rem 0;
    }
    .brand-content h1 span {
      color: var(--primary-light);
    }
    .brand-content p {
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0 0 2.5rem 0;
      opacity: 0.92;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .feature-list li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1rem;
    }
    .feature-list li::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: var(--primary-light);
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .form-panel {
      flex: 1;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .form-container {
      width: 100%;
      max-width: 380px;
    }
    .form-container h2 {
      font-size: 2.2rem;
      margin: 0 0 0.5rem 0;
      color: var(--text);
    }
    .subtitle {
      color: var(--muted);
      margin: 0 0 2rem 0;
      font-size: 1.05rem;
    }
    .role-toggle {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .role-btn {
      flex: 1;
      padding: 0.85rem;
      border: 1px solid var(--border);
      background: white;
      color: var(--muted);
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.05rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .role-btn.active {
      background-color: rgba(0, 174, 239, 0.1);
      border-color: var(--primary-light);
      color: var(--primary-dark);
      font-weight: 700;
    }
    .input-group {
      margin-bottom: 1.25rem;
    }
    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      color: var(--text);
    }
    .input-group input {
      width: 100%;
      padding: 0.85rem 1.1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 1.05rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .input-group input:focus {
      outline: none;
      border-color: var(--primary-light);
    }
    .submit-btn {
      width: 100%;
      padding: 0.95rem;
      background-color: var(--primary-dark);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 1rem;
    }
    .submit-btn:hover {
      background-color: var(--primary-light);
    }
    .submit-btn:disabled {
      background-color: var(--muted);
      cursor: not-allowed;
      opacity: 0.7;
    }
    .error-msg {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.75rem;
      text-align: center;
    }
    .switch-mode {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.95rem;
      color: var(--muted);
    }
    .switch-mode a {
      color: var(--primary-light);
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }
    .switch-mode a:hover {
      text-decoration: underline;
    }

    @media (max-width: 900px) {
      .container {
        flex-direction: column;
      }
      .brand-panel {
        flex: none;
        min-height: 200px;
        padding: 2rem;
      }
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="brand-panel">
          <div class="brand-inner">
            <div class="brand-header">
              <svg class="brand-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 69.033">
                <g fill="#ffffff" data-name="Group 11015">
                  <path d="M.669 69.034a.669.669 0 1 1 0-1.338c9.365 0 15.876-2.347 19.905-7.175 3.349-4.013 4.978-9.805 4.978-17.709v-.135c0-8.23 1.73-14.3 5.289-18.566 4.3-5.151 11.147-7.655 20.932-7.655a.669.669 0 1 1 0 1.338c-9.364 0-15.875 2.346-19.905 7.174-3.349 4.013-4.978 9.806-4.978 17.709v.135c0 8.23-1.73 14.3-5.289 18.566C17.3 66.53 10.455 69.034.669 69.034" data-name="Path 1"/>
                  <path d="M18.06 43.483a.669.669 0 0 1-.669-.669v-.135c0-10.22 2.35-18 7.184-23.8 5.946-7.123 14.842-10.586 27.2-10.586a.669.669 0 1 1 0 1.338c-11.934 0-20.494 3.306-26.171 10.106-4.627 5.546-6.875 13.046-6.875 22.94v.135a.669.669 0 0 1-.669.669" data-name="Path 2"/>
                  <path d="M17.903 58.961a.669.669 0 0 1-.513-1.1c2.7-3.236 4.014-8.159 4.014-15.051v-.135c0-9.242 2.045-16.184 6.252-21.224 5.137-6.154 13.025-9.145 24.116-9.145a.669.669 0 1 1 0 1.338c-10.67 0-18.223 2.834-23.089 8.664-4 4.79-5.941 11.452-5.941 20.367v.135c0 7.218-1.415 12.422-4.326 15.908a.666.666 0 0 1-.514.241" data-name="Path 3"/>
                  <path d="M15.685 29.299a.669.669 0 0 1-.643-.853 32.669 32.669 0 0 1 6.35-12.221C28.175 8.099 38.113 4.149 51.774 4.149a.669.669 0 1 1 0 1.338c-13.24 0-22.842 3.793-29.355 11.6a31.369 31.369 0 0 0-6.09 11.733.67.67 0 0 1-.643.485" data-name="Path 4"/>
                  <path d="M18.72 14.664a.669.669 0 0 1-.513-1.1C25.83 4.438 36.806 0 51.773 0a.669.669 0 0 1 0 1.338c-14.543 0-25.189 4.28-32.543 13.085a.666.666 0 0 1-.514.241" data-name="Path 5"/>
                </g>
                <g fill="#ffffff" data-name="Group 11016">
                  <path d="m89.381 51.975 3.436-4.1a10.8 10.8 0 0 0 6.733 2.254c1.182 0 1.65-.3 1.65-.824v-.055c0-.55-.605-.853-2.666-1.265-4.315-.879-8.108-2.116-8.108-6.184v-.055c0-3.655 2.886-6.486 8.163-6.486 3.738 0 6.459.88 8.685 2.639l-3.137 4.347a10.149 10.149 0 0 0-5.771-1.9c-.962 0-1.4.33-1.4.8v.055c0 .522.495.879 2.556 1.237 4.92.88 8.217 2.364 8.217 6.211v.055c0 4.04-3.325 6.514-8.493 6.514a14.67 14.67 0 0 1-9.867-3.243" data-name="Path 6"/>
                  <path d="M109.224 35.623h16.408V40.9h-10.087v1.951h9.4v4.645h-9.4v2.088h10.224v5.281h-16.545Z" data-name="Path 7"/>
                  <path d="M127.83 35.623h6.019l6.843 8.493v-8.493h6.376v19.242h-5.717l-7.146-8.877v8.877h-6.376Z" data-name="Path 8"/>
                  <path d="M156.221 35.485h6.376l8.108 19.376h-6.981l-1.016-2.583h-6.734l-.989 2.583h-6.871Zm4.892 12.23-1.759-4.672-1.759 4.672Z" data-name="Path 9"/>
                  <path d="M171.748 35.623h6.431v19.239h-6.431z" data-name="Rectangle 1"/>
                </g>
                <g fill="#0bbbef" data-name="Group 11017">
                  <path d="M43.984 46.393V35.627h3.51v10.624c0 3.738 1.883 5.678 5.051 5.678 3.11 0 5.022-1.855 5.022-5.536V35.627h3.51v10.6c0 5.964-3.367 8.96-8.589 8.96-5.165 0-8.5-3-8.5-8.788" data-name="Path 10"/>
                  <path d="M64.615 39.801h3.481v2.311a5.461 5.461 0 0 1 4.708-2.625c3.424 0 5.365 2.254 5.365 5.764v9.616h-3.454v-8.56c0-2.368-1.17-3.681-3.224-3.681-2.026 0-3.4 1.369-3.4 3.738v8.5h-3.476Z" data-name="Path 11"/>
                  <path d="M81.536 33.78h3.709v3.71h-3.709Zm.114 6.021h3.481v15.066H81.65Z" data-name="Path 12"/>
                  <path d="M182.382 39.809h6.474c3.786 0 6.238 1.936 6.238 5.27v.043c0 3.57-2.732 5.441-6.453 5.441h-2.086v4.3h-4.173Zm6.173 7.485c1.463 0 2.388-.774 2.388-1.979v-.043c0-1.2-.925-1.957-2.409-1.957h-1.979v3.978Z" data-name="Path 13"/>
                  <path d="M196.148 39.809h7.119a6.633 6.633 0 0 1 4.9 1.613 4.77 4.77 0 0 1 1.334 3.506v.043a4.742 4.742 0 0 1-3.1 4.645l3.592 5.248h-4.8l-3.033-4.56h-1.85v4.56h-4.173Zm6.948 7.227c1.4 0 2.237-.688 2.237-1.785v-.043c0-1.2-.882-1.806-2.258-1.806h-2.753v3.635Z" data-name="Path 14"/>
                </g>
              </svg>
            </div>
            <div class="brand-content">
              <h1>Portal da <span>Comunidade</span> de Engenharia de Software</h1>
              <p>Conecte-se com colegas e professores, treine sua lógica e compartilhe conhecimento. Tudo em um só lugar.</p>
              <ul class="feature-list">
                <li>Feed colaborativo da comunidade</li>
                <li>Jogo de lógica e portas lógicas</li>
                <li>Gestão de insumos e laboratórios</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="form-panel">
          <div class="form-container">
            <h2>Bem-vindo de volta</h2>
            <p class="subtitle">Entre com suas credenciais para acessar o portal</p>
            <form @submit=${this.handleSubmit}>
              <div class="role-toggle">
                <button type="button" class="role-btn ${this.profileType === 'STUDENT' ? 'active' : ''}" @click=${() => this.setRole('STUDENT')}>Aluno</button>
                <button type="button" class="role-btn ${this.profileType === 'PROFESSOR' ? 'active' : ''}" @click=${() => this.setRole('PROFESSOR')}>Professor</button>
              </div>
              <div class="input-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="aluno@unisenai.edu.br" .value=${this.email} @input=${this.handleInput}>
              </div>
              <div class="input-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" .value=${this.password} @input=${this.handleInput}>
              </div>
              <button type="submit" class="submit-btn" ?disabled=${this.loading}>
                ${this.loading ? 'Entrando...' : 'Entrar no Portal'}
              </button>
              ${this.error ? html`<div class="error-msg">${this.error}</div>` : ''}
            </form>
            <div class="switch-mode">Não tem conta? <a>Cadastre-se</a></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('auth-application', AuthApplication);
