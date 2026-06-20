import { LitElement, html, css } from 'lit';

export class ProfileApplication extends LitElement {
  static properties = {
    profileData: { type: Object },
    loading: { type: Boolean },
    error: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      max-width: 500px;
      margin: 40px auto;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .profile-header {
      background: linear-gradient(135deg, #0d3168 0%, #00aeef 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
      position: relative;
    }

    .profile-avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: white;
      color: #0d3168;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.2em;
      font-weight: bold;
      margin: 0 auto 15px auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    .profile-header h2 {
      margin: 0 0 5px 0;
      font-size: 1.5em;
      font-weight: 600;
      word-break: break-all;
    }

    .profile-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.25);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .profile-body {
      padding: 30px;
    }

    .info-group {
      margin-bottom: 20px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 15px;
    }

    .info-group:last-child {
      border-bottom: none;
      margin-bottom: 30px;
    }

    .info-label {
      font-size: 0.85em;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .info-value {
      font-size: 1.1em;
      color: #1e293b;
      font-weight: 500;
    }

    .back-btn {
      width: 100%;
      padding: 12px;
      background-color: transparent;
      border: 2px solid #0d3168;
      color: #0d3168;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      outline: none;
    }

    .back-btn:hover {
      background-color: #0d3168;
      color: white;
    }

    .loading-state, .error-state {
      text-align: center;
      padding: 60px;
      color: #64748b;
      font-size: 1.1em;
      font-weight: 500;
    }

    .error-state {
      color: #ef4444;
      max-width: 400px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #fee2e2;
    }
  `;

  constructor() {
    super();
    this.profileData = null;
    this.loading = true;
    this.error = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchProfile();
  }

  async fetchProfile() {
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('portal_token');

    if (!token) {
      this.error = 'Usuário não autenticado no portal.';
      this.loading = false;
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os dados de perfil do servidor.');
      }

      this.profileData = await response.json();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  // Extrai iniciais a partir do e-mail
  _getInitials(email) {
    if (!email) return 'US';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  _goBack() {
    window.dispatchEvent(new CustomEvent('close-profile', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (this.loading) {
      return html`<div class="loading-state">Carregando dados de perfil...</div>`;
    }

    if (this.error) {
      return html`
        <div class="error-state">
          <p>${this.error}</p>
          <button class="back-btn" @click=${this._goBack}>Voltar ao Portal</button>
        </div>
      `;
    }

    const u = this.profileData;
    const isStudent = !!u.student;
    const profileTypeLabel = isStudent ? 'Estudante' : 'Professor';

    return html`
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">${this._getInitials(u.email)}</div>
          <h2>${u.email}</h2>
          <span class="profile-badge">${profileTypeLabel}</span>
        </div>

        <div class="profile-body">
          <div class="info-group">
            <div class="info-label">E-mail Institucional</div>
            <div class="info-value">${u.email}</div>
          </div>

          ${isStudent
            ? html`
                <div class="info-group">
                  <div class="info-label">Registro Acadêmico (RA)</div>
                  <div class="info-value">${u.student.ra}</div>
                </div>
                <div class="info-group">
                  <div class="info-label">Período Letivo</div>
                  <div class="info-value">${u.student.periodo}º Período</div>
                </div>
              `
            : html`
                <div class="info-group">
                  <div class="info-label">Matrícula Funcional</div>
                  <div class="info-value">${u.professor.matricula}</div>
                </div>
                <div class="info-group">
                  <div class="info-label">Titulação Acadêmica</div>
                  <div class="info-value">${u.professor.titulacao}</div>
                </div>
              `}

          <button class="back-btn" @click=${this._goBack}>Voltar ao Portal</button>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-application', ProfileApplication);
