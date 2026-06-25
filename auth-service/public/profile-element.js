import { LitElement, html, css } from 'lit';

export class ProfileApplication extends LitElement {
  static properties = {
    profileData: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    postsCount: { type: Number },
    userPosts: { type: Array },
    isEditing: { type: Boolean },
    editName: { type: String },
    saving: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 0;
      box-sizing: border-box;
      background-color: var(--bg-color, #f4f6f9);
      color: var(--text-main, #1e293b);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Scrollbars customizadas */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
      transition: background 0.2s ease-in-out;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .profile-container {
      display: grid;
      grid-template-columns: 350px 1fr 350px;
      gap: 24px;
      width: 100%;
      margin: 0;
    }

    @media (max-width: 1100px) {
      .profile-container {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .card {
      background: var(--card-bg, white);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8));
      overflow: hidden;
      box-sizing: border-box;
      color: var(--text-main, #1e293b);
      transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    }

    /* COLUNA ESQUERDA: PERFIL E DETALHES */
    .profile-left-column {
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
      line-height: 1;
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
      color: var(--title-color, #0d3168);
      margin: 0;
    }

    .profile-email-display {
      font-size: 0.88em;
      color: var(--text-muted, #64748b);
      margin: 0 0 4px 0;
      word-break: break-all;
    }

    .portal-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72em;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: var(--border-color, #e2e8f0);
      color: var(--text-muted, #64748b);
      transition: background-color 0.3s ease, color 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border: none;
      box-sizing: border-box;
      vertical-align: middle;
    }

    :host-context(.dark-theme) .portal-badge {
      background-color: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
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
      color: var(--title-color, #0d3168);
      margin: 0;
      border-bottom: 2px solid var(--border-color, #f1f5f9);
      padding-bottom: 8px;
    }

    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-group {
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color, #f1f5f9);
    }

    .info-group:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 0.7em;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .info-value {
      font-size: 1em;
      color: var(--text-main, #1e293b);
      font-weight: 600;
    }

    /* CARD DE HISTÓRICO DE POSTS (COLUNA DO MEIO) */
    .profile-posts-card {
      padding: 24px 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: var(--card-bg, white);
    }

    .posts-title {
      font-size: 1.25em;
      font-weight: 700;
      color: var(--title-color, #0d3168);
      margin: 0;
      border-bottom: 2px solid var(--border-color, #f1f5f9);
      padding-bottom: 12px;
    }

    .posts-list {
      display: flex;
      flex-direction: column;
    }

    .post-item {
      padding: 16px 0;
      border-bottom: 1px solid var(--border-color, #f1f5f9);
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
      color: var(--text-muted, #94a3b8);
      margin-bottom: 6px;
      font-weight: 500;
    }

    .post-content {
      font-size: 0.95em;
      color: var(--text-main, #334155);
      line-height: 1.5;
      word-break: break-word;
    }

    .empty-posts-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 20px;
      margin-top: 8px;
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      fill: #cbd5e1;
      margin-bottom: 16px;
    }

    .empty-message {
      font-size: 1.05em;
      font-weight: 700;
      color: var(--title-color, #0d3168);
      margin: 0 0 6px 0;
    }

    .empty-submessage {
      font-size: 0.85em;
      color: var(--text-muted, #64748b);
      margin: 0;
      max-width: 320px;
      line-height: 1.5;
    }

    /* CARD DE PROGRESSO DE ENSINO (COLUNA DIREITA) */
    .profile-progress-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--card-bg, white);
      min-height: 300px;
    }

    .progress-title {
      font-size: 1.1em;
      font-weight: 700;
      color: var(--title-color, #0d3168);
      margin: 0;
      border-bottom: 2px solid var(--border-color, #f1f5f9);
      padding-bottom: 8px;
    }

    .progress-content {
      flex: 1;
    }

    .loading-state {
      text-align: center;
      padding: 60px;
      color: var(--text-muted, #64748b);
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
      text-align: center;
      padding: 60px;
    }

    .name-display-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .edit-trigger-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: #00aeef;
      font-size: 0.8em;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .edit-trigger-btn:hover {
      background-color: var(--inner-card-bg, #f1f5f9);
      color: #0d3168;
    }

    .edit-icon-svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }

    .edit-name-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      margin-bottom: 6px;
    }

    .edit-name-input {
      padding: 6px 10px;
      border: 1px solid var(--inner-card-border, #cbd5e1);
      border-radius: 6px;
      font-size: 0.95em;
      color: var(--text-main, #1e293b);
      background-color: var(--card-bg, white);
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }

    .edit-name-input:focus {
      border-color: #00aeef;
      box-shadow: 0 0 0 2px rgba(0, 174, 239, 0.15);
    }

    .edit-actions {
      display: flex;
      gap: 8px;
    }

    .edit-btn-save, .edit-btn-cancel {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8em;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-btn-save {
      background-color: #00aeef;
      color: white;
      border: 1px solid #00aeef;
    }

    .edit-btn-save:hover:not(:disabled) {
      background-color: #008cc0;
      border-color: #008cc0;
    }

    .edit-btn-cancel {
      background-color: transparent;
      color: var(--text-muted, #64748b);
      border: 1px solid var(--inner-card-border, #cbd5e1);
    }

    .edit-btn-cancel:hover:not(:disabled) {
      background-color: var(--inner-card-bg, #f1f5f9);
      color: var(--text-main, #1e293b);
    }

    .edit-btn-save:disabled, .edit-btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

  `;

  constructor() {
    super();
    this.profileData = null;
    this.loading = true;
    this.error = '';
    this.postsCount = 0;
    this.userPosts = [];
    this.isEditing = false;
    this.editName = '';
    this.saving = false;
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

  // Extrai iniciais a partir do e-mail ou nome
  _getInitials(email, name) {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (!email) return 'US';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  _startEdit(currentName) {
    this.editName = currentName;
    this.isEditing = true;
  }

  _cancelEdit() {
    this.isEditing = false;
  }

  async _saveProfile() {
    const trimmedName = this.editName.trim();
    if (!trimmedName) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'O nome não pode estar vazio.', type: 'error' } }));
      return;
    }

    this.saving = true;
    const token = localStorage.getItem('portal_token');

    try {
      const response = await fetch('http://localhost:3001/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: trimmedName })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erro ao salvar o perfil.');
      }

      const updatedUser = await response.json();

      try {
        const portalUser = localStorage.getItem('portal_user');
        if (portalUser) {
          const parsed = JSON.parse(portalUser);
          parsed.name = updatedUser.name;
          localStorage.setItem('portal_user', JSON.stringify(parsed));
        }
      } catch (err) {
        console.warn('Erro ao atualizar localStorage portal_user:', err);
      }

      this.profileData = {
        ...this.profileData,
        name: updatedUser.name
      };

      this.isEditing = false;
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Perfil atualizado com sucesso!', type: 'success' } }));

      window.dispatchEvent(new CustomEvent('profile-updated', {
        detail: { name: updatedUser.name },
        bubbles: true,
        composed: true
      }));

    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: err.message, type: 'error' } }));
    } finally {
      this.saving = false;
    }
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
    const displayName = u.name || this._formatDisplayName(u.email);
    const initials = this._getInitials(u.email, u.name);
    const isStudent = !!u.student || u.profileType?.toLowerCase() === 'student';
    const profileTypeLabel = isStudent ? 'Estudante' : 'Professor';

    return html`
      <div class="profile-container">
        <!-- Coluna da Esquerda: Dados do Perfil -->
        <div class="profile-left-column">
          <!-- Card Superior: Informações do Estudante (Horizontal) -->
          <div class="card profile-info-card">
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar">${initials}</div>
            </div>
            <div class="profile-meta-content" style="width: 100%;">
              ${this.isEditing
                ? html`
                    <div class="edit-name-container">
                      <input
                        type="text"
                        class="edit-name-input"
                        .value=${this.editName}
                        @input=${(e) => this.editName = e.target.value}
                        ?disabled=${this.saving}
                      />
                      <div class="edit-actions">
                        <button class="edit-btn-save" @click=${this._saveProfile} ?disabled=${this.saving}>
                          ${this.saving ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button class="edit-btn-cancel" @click=${this._cancelEdit} ?disabled=${this.saving}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  `
                : html`
                    <div class="name-display-container">
                      <h2 class="profile-name-display">${displayName}</h2>
                      <button class="edit-trigger-btn" @click=${() => this._startEdit(displayName)}>
                        <svg viewBox="0 0 24 24" class="edit-icon-svg" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        Editar
                      </button>
                    </div>
                  `}
              <p class="profile-email-display">${u.email}</p>
              <span class="portal-badge">${profileTypeLabel}</span>
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

        <!-- Coluna do Meio: Histórico de Posts -->
        <div class="card profile-posts-card">
          <h3 class="posts-title">Minhas postagens</h3>
          
          <div class="posts-list">
            ${this.userPosts.length === 0
              ? html`
                  <div class="empty-posts-state">
                    <svg viewBox="0 0 24 24" class="empty-icon" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM4 16V4h16v12H5.17L4 17.17V16zm5-7h6v2H9V9zm0 3h6v2H9v-2z" />
                    </svg>
                    <h4 class="empty-message">Você ainda não fez nenhuma publicação.</h4>
                    <p class="empty-submessage">Vá até a Comunidade e compartilhe algo com seus colegas!</p>
                  </div>
                `
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

        <!-- Coluna da Direita: Progresso de Ensino -->
        <div class="card profile-progress-card">
          <h3 class="progress-title">Progresso de ensino</h3>
          <div class="progress-content">
            <!-- Em branco por enquanto -->
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-application', ProfileApplication);
