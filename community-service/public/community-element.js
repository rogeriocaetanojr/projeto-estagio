import { LitElement, html, css } from 'lit';

class CommunityApplication extends LitElement {
    static properties = {
        posts: { type: Array },
        loading: { type: Boolean },
        error: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f9;
            color: #1e293b;
            min-height: 100vh;
        }

        .container {
            display: grid;
            grid-template-columns: 280px 1fr 300px;
            gap: 24px;
            max-width: 1300px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        /* CARD DE PERFIL (SIDEBAR) */
        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .profile-card {
            text-align: center;
            padding: 24px;
        }

        .profile-bg {
            height: 60px;
            background: linear-gradient(135deg, #0d3168 0%, #00aeef 100%);
            margin: -24px -24px 16px -24px;
        }

        .profile-avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background-color: #00aeef;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8em;
            font-weight: bold;
            margin: -50px auto 12px auto;
            border: 4px solid #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .profile-name {
            font-size: 1.1em;
            font-weight: 700;
            color: #0d3168;
            margin: 0 0 4px 0;
            word-break: break-all;
        }

        .profile-role {
            font-size: 0.85em;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            background-color: #f1f5f9;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
        }

        /* FEED (COLUNA CENTRAL) */
        .feed {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .creator-card {
            padding: 20px;
        }

        .creator-header {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .creator-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #0d3168;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .creator-textarea {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            font-size: 0.95em;
            resize: none;
            height: 60px;
            font-family: inherit;
            background-color: #f8fafc;
            color: #94a3b8;
            cursor: not-allowed;
        }

        .creator-actions {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid #f1f5f9;
            padding-top: 12px;
        }

        .publish-btn {
            background-color: #cbd5e1;
            color: #ffffff;
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.9em;
            cursor: not-allowed;
        }

        /* CARD DE POST */
        .post-card {
            padding: 20px;
        }

        .post-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
        }

        .post-author-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: #0d3168;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1em;
        }

        .post-author-avatar.student-av {
            background-color: #00aeef;
        }

        .post-meta {
            flex: 1;
        }

        .post-author-name {
            font-weight: 700;
            color: #0d3168;
            margin: 0;
            font-size: 0.95em;
        }

        .post-author-badge {
            font-size: 0.75em;
            font-weight: 600;
            color: #64748b;
            background-color: #f1f5f9;
            padding: 2px 8px;
            border-radius: 12px;
            margin-left: 6px;
            vertical-align: middle;
            text-transform: uppercase;
        }

        .post-time {
            font-size: 0.75em;
            color: #64748b;
            margin-top: 2px;
        }

        .post-title {
            font-size: 1.15em;
            font-weight: 700;
            color: #0d3168;
            margin: 0 0 10px 0;
            line-height: 1.3;
        }

        .post-content {
            font-size: 0.95em;
            color: #334155;
            line-height: 1.6;
            margin: 0 0 16px 0;
        }

        .post-actions {
            display: flex;
            gap: 16px;
            border-top: 1px solid #f1f5f9;
            padding-top: 12px;
            color: #64748b;
            font-size: 0.85em;
            font-weight: 600;
        }

        .post-action-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .post-action-btn:hover {
            color: #00aeef;
        }

        /* WIDGETS (COLUNA DIREITA) */
        .widgets {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .widget-card {
            padding: 20px;
        }

        .widget-title {
            font-size: 1em;
            font-weight: 700;
            color: #0d3168;
            margin: 0 0 16px 0;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .widget-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .widget-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            border-left: 3px solid #00aeef;
            padding-left: 10px;
        }

        .widget-item-title {
            font-size: 0.9em;
            font-weight: 700;
            color: #1e293b;
        }

        .widget-item-desc {
            font-size: 0.8em;
            color: #64748b;
        }

        /* ESTADOS DE CARREGAMENTO E ERRO */
        .loading-posts {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #64748b;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #00aeef;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 12px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-posts {
            background-color: #fef2f2;
            border: 1px solid #fee2e2;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            color: #991b1b;
        }

        .retry-btn {
            background-color: #0d3168;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 8px;
            transition: background-color 0.2s ease;
        }

        .retry-btn:hover {
            background-color: #00aeef;
        }

        .no-posts {
            padding: 30px;
            text-align: center;
            color: #64748b;
            font-style: italic;
        }

        /* RESPONSIVIDADE */
        @media (max-width: 1024px) {
            .container {
                grid-template-columns: 1fr;
                padding: 16px;
            }

            .sidebar {
                order: 2;
            }

            .feed {
                order: 1;
            }

            .widgets {
                order: 3;
            }
        }
    `;

    constructor() {
        super();
        this.posts = [];
        this.loading = false;
        this.error = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchPosts();
    }

    async fetchPosts() {
        this.loading = true;
        this.error = '';
        const token = localStorage.getItem('portal_token');

        try {
            const response = await fetch('http://localhost:3002/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar as publicações da comunidade.');
            }

            this.posts = await response.json();
        } catch (err) {
            console.error('Erro ao buscar posts da comunidade:', err);
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    get currentUser() {
        try {
            const userRaw = localStorage.getItem('portal_user');
            return userRaw ? JSON.parse(userRaw) : null;
        } catch (e) {
            return null;
        }
    }

    _getInitials(email) {
        if (!email) return 'US';
        const parts = email.split('@')[0].split('.');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    }

    render() {
        const user = this.currentUser;
        const email = user ? user.email : 'Visitante';
        const initials = user ? this._getInitials(user.email) : 'US';
        const role = user ? (user.profileType === 'professor' || user.profileType === 'PROFESSOR' ? 'Professor' : 'Estudante') : 'Visitante';

        return html`
            <div class="container">
                <!-- Coluna Esquerda (Sidebar): Perfil -->
                <aside class="sidebar">
                    <div class="card profile-card">
                        <div class="profile-bg"></div>
                        <div class="profile-avatar">${initials}</div>
                        <h3 class="profile-name" title="${email}">${email}</h3>
                        <span class="profile-role">${role}</span>
                    </div>
                </aside>

                <!-- Coluna Central: Feed -->
                <main class="feed">
                    <!-- Criador de Post (Estático/Desabilitado) -->
                    <div class="card creator-card">
                        <div class="creator-header">
                            <div class="creator-avatar">${initials}</div>
                            <textarea 
                                class="creator-textarea" 
                                placeholder="No que você está pensando, ${user ? email.split('@')[0].split('.')[0] : 'colega'}?" 
                                disabled
                            ></textarea>
                        </div>
                        <div class="creator-actions">
                            <button class="publish-btn" disabled>Publicar</button>
                        </div>
                    </div>

                    <!-- Lista de Publicações Dinâmicas -->
                    ${this.loading
                        ? html`
                            <div class="loading-posts">
                                <div class="spinner"></div>
                                <p>Carregando publicações...</p>
                            </div>
                          `
                        : this.error
                        ? html`
                            <div class="card error-posts">
                                <p>⚠️ ${this.error}</p>
                                <button class="retry-btn" @click="${this.fetchPosts}">Tentar Novamente</button>
                            </div>
                          `
                        : this.posts.length === 0
                        ? html`
                            <div class="card no-posts">
                                <p>Ainda não há nenhuma publicação na comunidade. Seja o primeiro a postar!</p>
                            </div>
                          `
                        : this.posts.map(post => {
                            const authorEmail = post.author ? post.author.email : 'Autor Desconhecido';
                            const authorInitials = this._getInitials(authorEmail);
                            const isStudent = post.author ? (post.author.profileType === 'STUDENT' || post.author.profileType === 'student') : true;
                            const authorRoleLabel = isStudent ? 'Estudante' : 'Professor';
                            
                            // Formatação simples de data
                            const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Agora';

                            return html`
                                <div class="card post-card" key="${post.id}">
                                    <div class="post-header">
                                        <div class="post-author-avatar ${isStudent ? 'student-av' : ''}">${authorInitials}</div>
                                        <div class="post-meta">
                                            <h4 class="post-author-name">
                                                ${authorEmail.split('@')[0]}
                                                <span class="post-author-badge">${authorRoleLabel}</span>
                                            </h4>
                                            <div class="post-time">${dateStr}</div>
                                        </div>
                                    </div>
                                    <h3 class="post-title">${post.title}</h3>
                                    <p class="post-content">${post.content}</p>
                                    <div class="post-actions">
                                        <div class="post-action-btn">
                                            <span>👍</span> Curtir
                                        </div>
                                        <div class="post-action-btn">
                                            <span>💬</span> Comentar
                                        </div>
                                    </div>
                                </div>
                            `;
                        })
                    }
                </main>

                <!-- Coluna Direita: Widgets -->
                <aside class="widgets">
                    <!-- Bloco 1: Avisos da Instituição -->
                    <div class="card widget-card">
                        <h3 class="widget-title">Avisos da Instituição</h3>
                        <div class="widget-list">
                            <div class="widget-item">
                                <span class="widget-item-title">Renovação de Matrícula 2026/2</span>
                                <span class="widget-item-desc">Prazo limite prorrogado até 30/06 via portal financeiro.</span>
                            </div>
                            <div class="widget-item">
                                <span class="widget-item-title">Semana de Tecnologia UniSenai</span>
                                <span class="widget-item-desc">Inscrições abertas para workshops e palestras gratuitas.</span>
                            </div>
                        </div>
                    </div>

                    <!-- Bloco 2: Próximos Eventos -->
                    <div class="card widget-card">
                        <h3 class="widget-title">Próximos Eventos</h3>
                        <div class="widget-list">
                            <div class="widget-item">
                                <span class="widget-item-title">Hackathon Interno UniSenai</span>
                                <span class="widget-item-desc">De 25 a 27 de Junho. Inscreva seu time no Moodle.</span>
                            </div>
                            <div class="widget-item">
                                <span class="widget-item-title">Palestra: Arquitetura de Software</span>
                                <span class="widget-item-desc">Amanhã, às 19h00 no Auditório Principal e via Teams.</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        `;
    }
}

customElements.define('community-application', CommunityApplication);
