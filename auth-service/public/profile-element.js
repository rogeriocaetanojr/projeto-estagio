import { LitElement, html, css } from 'lit';

export class ProfileApplication extends LitElement {
  static properties = {
    profileData: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    postsCount: { type: Number },
    userPosts: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 0;
      box-sizing: border-box;
      --primary-dark: #0d3168;
      --primary-light: #00aeef;
    }

    .profile-container {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
      width: 100%;
      margin: 0;
    }

    @media (max-width: 850px) {
      .profile-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(226, 232, 240, 0.8);
      overflow: hidden;
      box-sizing: border-box;
    }

    /* COLUNA DIREITA: PERFIL E DETALHES */
    .profile-right-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* CARD DE PERFIL (SUPERIOR - HORIZONTAL) */
    .profile-info-card {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 16px 20px;
    }

    .profile-avatar-wrapper {
      flex-shrink: 0;
    }

    .profile-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0d3168 0%, #00aeef 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8em;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(13, 49, 104, 0.15);
    }

    .profile-meta-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }

    .profile-name-display {
      font-size: 1.2em;
      font-weight: 700;
      color: #0d3168;
      margin: 0;
    }

    .profile-email-display {
      font-size: 0.88em;
      color: #64748b;
      margin: 0 0 4px 0;
      word-break: break-all;
    }

    .profile-badge {
      display: inline-block;
      background: #f1f5f9;
      color: #0d3168;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.72em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border: 1px solid #e2e8f0;
    }

    /* CARD DE DADOS ACADÊMICOS (INFERIOR) */
    .profile-details-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .details-title {
      font-size: 1.1em;
      font-weight: 700;
      color: #0d3168;
      margin: 0;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
    }

    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-group {
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .info-group:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 0.7em;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .info-value {
      font-size: 1em;
      color: #1e293b;
      font-weight: 600;
    }

    /* CARD DE HISTÓRICO DE POSTS (COLUNA ESQUERDA) */
    .profile-posts-card {
      padding: 24px 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: white;
    }

    .posts-title {
      font-size: 1.25em;
      font-weight: 700;
      color: #0d3168;
      margin: 0;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 12px;
    }

    .posts-list {
      display: flex;
      flex-direction: column;
    }

    .post-item {
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .post-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .post-item:first-child {
      padding-top: 0;
    }

    .post-meta {
      font-size: 0.85em;
      color: #94a3b8;
      margin-bottom: 6px;
      font-weight: 500;
    }

    .post-content {
      font-size: 0.95em;
      color: #334155;
      line-height: 1.5;
      word-break: break-word;
    }

    .no-posts-msg {
      font-size: 0.95em;
      color: #64748b;
      font-style: italic;
      padding: 20px 0;
      margin: 0;
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
    this.postsCount = 0;
    this.userPosts = [];
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
      // 1. Busca dados do usuário logado
      const response = await fetch('http://localhost:3001/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os dados de perfil do servidor.');
      }

      this.profileData = await response.json();

      // 2. Busca e filtra posts criados por este usuário na comunidade
      try {
        const postsResponse = await fetch('http://localhost:3002/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (postsResponse.ok) {
          const posts = await postsResponse.json();
          this.userPosts = posts
            .filter(post => post.authorId === this.profileData.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          this.postsCount = this.userPosts.length;
        }
      } catch (postErr) {
        console.warn('Erro ao obter contagem de posts do usuário:', postErr);
        this.userPosts = [];
        this.postsCount = 0;
      }

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

  // Formata o e-mail em um nome de exibição amigável
  _formatDisplayName(email) {
    if (!email) return 'Usuário';
    const namePart = email.split('@')[0];
    const cleanName = namePart.replace(/[0-9]/g, '');
    const parts = cleanName.split('.');
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }

  // Formata tempo relativo em português
  _formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'agora mesmo';
    } else if (diffMins < 60) {
      return `há ${diffMins} min${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'ontem';
    } else if (diffDays < 7) {
      return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
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
          <button class="back-btn" style="margin: 20px auto; width: auto;" @click=${this._goBack}>
            Voltar
          </button>
        </div>
      `;
    }

    const u = this.profileData;
    const isStudent = !!u.student;
    const profileTypeLabel = isStudent ? 'Estudante' : 'Professor';
    const initials = this._getInitials(u.email);
    const displayName = this._formatDisplayName(u.email);

    return html`
      <div class="profile-container">
        <!-- Coluna da Esquerda: Histórico de Posts -->
        <div class="card profile-posts-card">
          <h3 class="posts-title">Minhas postagens</h3>
          
          <div class="posts-list">
            ${this.userPosts.length === 0
              ? html`<p class="no-posts-msg">Você ainda não publicou nenhuma postagem.</p>`
              : this.userPosts.map(post => html`
                  <div class="post-item">
                    <div class="post-meta">
                      ${this._formatRelativeTime(post.createdAt)} • ${post.category || 'Geral'}
                    </div>
                    <div class="post-content">${post.content}</div>
                  </div>
                `)}
          </div>
        </div>

        <!-- Coluna da Direita: Dados do Perfil -->
        <div class="profile-right-column">
          <!-- Card Superior: Informações do Estudante (Horizontal) -->
          <div class="card profile-info-card">
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar">${initials}</div>
            </div>
            <div class="profile-meta-content">
              <h2 class="profile-name-display">${displayName}</h2>
              <p class="profile-email-display">${u.email}</p>
              <span class="profile-badge">${profileTypeLabel}</span>
            </div>
          </div>

          <!-- Card Inferior: Detalhes Acadêmicos -->
          <div class="card profile-details-card">
            <h3 class="details-title">Detalhes Acadêmicos</h3>
            
            <div class="details-grid" style="margin-top: 14px;">
              <div class="info-group">
                <div class="info-label">E-mail de Login</div>
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

              <!-- Campo de Estatísticas formatado igual aos demais -->
              <div class="info-group">
                <div class="info-label">Posts publicados</div>
                <div class="info-value">${this.postsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-application', ProfileApplication);
