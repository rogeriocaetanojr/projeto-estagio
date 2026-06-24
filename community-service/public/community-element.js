import { LitElement, html, css } from 'lit';

class CommunityApplication extends LitElement {
    static properties = {
        posts: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
        creatingPost: { type: Boolean },
        editingPostId: { type: String },
        editingPostTitle: { type: String },
        editingPostContent: { type: String },
        editingCommentId: { type: String },
        editingCommentContent: { type: String },
        activeReplyBox: { type: String },
        replyContent: { type: String },
        communities: { type: Array },
        selectedCommunityId: { type: String },
        showCreateCommunityModal: { type: Boolean },
        newCommunityName: { type: String },
        newCommunityDescription: { type: String },
        newCommunityIsLocked: { type: Boolean },
        newCommunityPassword: { type: String },
        communityPasswordPromptId: { type: String },
        communityPasswordInput: { type: String },
        clickedPosts: { type: Array }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color, #f4f6f9);
            color: var(--text-main, #1e293b);
            min-height: 100vh;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Inputs e textareas dinâmicos baseados no tema */
        input[type="text"], textarea {
            background-color: var(--card-bg, #ffffff) !important;
            color: var(--text-main, #1e293b) !important;
            border: 1px solid var(--border-color, #cbd5e1) !important;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
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

        .container {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 24px;
            max-width: 1120px;
            margin: 0 auto;
            padding: 0 24px 24px;
            box-sizing: border-box;
        }

        .card {
            background-color: var(--card-bg, #ffffff);
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.3s ease, border-color 0.3s ease;
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
            line-height: 1;
            flex-shrink: 0;
        }

        .creator-inputs {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .creator-title-input {
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 0.95em;
            font-family: inherit;
            font-weight: 600;
            color: var(--text-main, #1e293b);
            background-color: var(--card-bg, #ffffff);
            outline: none;
            transition: all 0.2s ease-in-out, background-color 0.3s ease, color 0.3s ease;
        }

        .creator-textarea {
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 8px;
            padding: 12px;
            font-size: 0.95em;
            resize: none;
            height: 80px;
            font-family: inherit;
            color: var(--text-main, #1e293b);
            background-color: var(--card-bg, #ffffff);
            outline: none;
            transition: all 0.2s ease-in-out, background-color 0.3s ease, color 0.3s ease;
        }

        .creator-title-input:focus,
        .creator-textarea:focus {
            border-color: #00aeef;
            box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.15);
        }

        .creator-title-input:disabled,
        .creator-textarea:disabled {
            background-color: var(--bg-color, #f8fafc);
            color: var(--text-muted, #94a3b8);
            cursor: not-allowed;
        }

        .creator-actions {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid var(--border-color, #f1f5f9);
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
            transition: all 0.2s ease-in-out;
        }

        .publish-btn.active {
            background-color: var(--accent-btn-bg, #0d3168);
            color: #ffffff;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        .publish-btn.active:hover:not(:disabled) {
            background-color: var(--accent-btn-hover, #00aeef);
            transform: translateY(-1px);
        }

        .publish-btn.active:disabled {
            background-color: #cbd5e1;
            color: #ffffff;
            cursor: not-allowed;
            transform: none;
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
            line-height: 1;
            flex-shrink: 0;
        }

        .post-author-avatar.student-av {
            background-color: #0d3168;
        }

        .post-meta {
            flex: 1;
        }

        .post-author-name {
            font-weight: 700;
            color: var(--title-color, #0d3168);
            margin: 0;
            font-size: 0.95em;
            transition: color 0.3s ease;
        }

        .post-author-badge {
            font-size: 0.75em;
            font-weight: 600;
            color: var(--text-muted, #64748b);
            background-color: var(--bg-color, #f1f5f9);
            padding: 2px 8px;
            border-radius: 12px;
            margin-left: 6px;
            vertical-align: middle;
            text-transform: uppercase;
            transition: color 0.3s ease, background-color 0.3s ease;
        }

        .post-time {
            font-size: 0.75em;
            color: var(--text-muted, #64748b);
            margin-top: 2px;
        }

        .post-title {
            font-size: 1.15em;
            font-weight: 700;
            color: var(--title-color, #0d3168);
            margin: 0 0 10px 0;
            line-height: 1.3;
            transition: color 0.3s ease;
        }

        .post-content {
            font-size: 0.95em;
            color: var(--text-main, #334155);
            line-height: 1.6;
            margin: 0 0 16px 0;
            transition: color 0.3s ease;
        }

        .post-actions {
            display: flex;
            gap: 16px;
            border-top: 1px solid var(--border-color, #f1f5f9);
            padding-top: 12px;
            color: var(--text-muted, #64748b);
            font-size: 0.85em;
            font-weight: 600;
        }

        .post-action-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s ease-in-out;
            user-select: none;
        }

        .post-action-btn:hover {
            color: var(--title-color, #00aeef);
            background-color: var(--item-hover, #f1f5f9);
        }

        .post-action-btn.liked {
            color: #ef4444;
        }

        .post-action-btn.liked:hover {
            background-color: #fee2e2;
            color: #dc2626;
        }

        .comment-icon {
            filter: grayscale(100%) opacity(0.7);
            font-size: 1.1em;
        }

        .post-edit-btn, .post-delete-btn {
            font-size: 0.82em;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: none;
            background: none;
        }

        .post-edit-btn {
            color: var(--text-muted, #64748b);
        }

        .post-edit-btn:hover {
            background-color: var(--item-hover, #f1f5f9);
            color: var(--text-main, #0f172a);
        }

        .post-delete-btn {
            color: #ef4444;
        }

        .post-delete-btn:hover {
            background-color: #fee2e2;
            color: #dc2626;
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
            color: var(--title-color, #0d3168);
            margin: 0 0 16px 0;
            border-bottom: 2px solid var(--border-color, #f1f5f9);
            padding-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: color 0.3s ease, border-color 0.3s ease;
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
            border: 1px solid var(--inner-card-border, transparent);
            border-left: 3px solid var(--title-color, #00aeef);
            padding: 8px 12px;
            background-color: var(--inner-card-bg, transparent);
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .widget-item-title {
            font-size: 0.9em;
            font-weight: 700;
            color: var(--text-main, #1e293b);
            transition: color 0.3s ease;
        }

        .widget-item-desc {
            font-size: 0.8em;
            color: var(--text-muted, #64748b);
            transition: color 0.3s ease;
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
            background-color: var(--accent-btn-bg, #0d3168);
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
            background-color: var(--accent-btn-hover, #00aeef);
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

            .feed {
                order: 1;
            }

            .widgets {
                order: 2;
            }
        }

        /* Estilos de Comunidades */
        .community-item {
            padding: 10px 12px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s;
            margin-bottom: 6px;
            border: 1px solid transparent;
        }

        .community-item:hover {
            background-color: #f1f5f9;
        }

        .community-item.active {
            background-color: #e0f2fe;
            border-color: #bae6fd;
            font-weight: 600;
            color: #0369a1;
        }

        .community-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
        }

        .community-name {
            font-size: 0.95em;
            color: #0f172a;
        }

        .community-item.active .community-name {
            color: #0369a1;
        }

        .community-desc {
            font-size: 0.8em;
            color: #64748b;
        }

        .community-action-btn {
            background-color: var(--title-color, #00aeef);
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            cursor: pointer;
            font-weight: 600;
        }

        .community-action-btn:hover {
            background-color: var(--accent-btn-bg, #0d3168);
        }

        /* Modal / Form overlay */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-container {
            background: var(--card-bg, white);
            padding: 24px;
            border-radius: 12px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 16px;
            border: 1px solid var(--border-color, transparent);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            padding-bottom: 12px;
        }

        .modal-title {
            font-size: 1.2em;
            font-weight: 700;
            color: var(--title-color, #0d3168);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: var(--text-muted, #64748b);
        }

        .modal-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .form-group label {
            font-size: 0.9em;
            font-weight: 600;
            color: var(--text-main, #475569);
        }

        .form-group input, .form-group textarea {
            padding: 8px 12px;
            border: 1px solid var(--border-color, #cbd5e1);
            border-radius: 6px;
            font-size: 0.95em;
            font-family: inherit;
            background: var(--bg-color, white);
            color: var(--text-main, #1e293b);
        }

        .form-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* BARRA LATERAL ESQUERDA (NOVA) */
        .sidebar-left {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .nav-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .nav-section-title {
            font-size: 0.8em;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 6px;
            padding-left: 8px;
        }

        .sidebar-nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            color: #475569;
            transition: all 0.2s ease-in-out;
            border: 1px solid transparent;
            background: none;
            width: 100%;
            text-align: left;
            font-family: inherit;
            font-size: 0.95em;
        }

        .sidebar-nav-item:hover {
            background-color: var(--item-hover, #f1f5f9);
            color: var(--accent-btn-bg, #0d3168);
        }

        .create-comm-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: var(--accent-btn-bg, #0d3168);
            color: white;
            border: none;
            padding: 10px 14px;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.9em;
            transition: background-color 0.2s ease-in-out;
            width: 100%;
        }

        .create-comm-btn:hover {
            background-color: var(--accent-btn-hover, #00aeef);
        }

        /* HISTÓRICO DE CLIQUES (NOVO) */
        .history-card {
            padding: 20px;
        }

        .history-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .history-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid var(--inner-card-border, transparent);
            border-left: 3px solid var(--title-color, #0d3168);
            background-color: var(--inner-card-bg, #f8fafc);
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        .history-item:hover {
            background-color: var(--item-hover, #f1f5f9);
            border-left-color: var(--title-color, #00aeef);
        }

        .history-item-title {
            font-size: 0.88em;
            font-weight: 600;
            color: var(--text-main, #1e293b);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .history-item-time {
            font-size: 0.72em;
            color: var(--text-muted, #94a3b8);
        }
    `;

    constructor() {
        super();
        this.posts = [];
        this.loading = false;
        this.error = '';
        this.creatingPost = false;
        this.activeCommentBox = null;
        this.editingPostId = null;
        this.editingPostTitle = '';
        this.editingPostContent = '';
        this.editingCommentId = null;
        this.editingCommentContent = '';
        this.activeReplyBox = null;
        this.replyContent = '';
        this.communities = [];
        this.selectedCommunityId = null;
        this.showCreateCommunityModal = false;
        this.newCommunityName = '';
        this.newCommunityDescription = '';
        this.newCommunityIsLocked = false;
        this.newCommunityPassword = '';
        this.communityPasswordPromptId = null;
        this.communityPasswordInput = '';
        this.clickedPosts = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadClickedPosts();
        this.fetchPosts();
        this.fetchCommunities();

        window.addEventListener('profile-updated', (e) => {
            if (this.currentUser) {
                this.currentUser.name = e.detail.name;
                this.requestUpdate();
            }
            this.fetchPosts();
        });
    }

    async fetchCommunities() {
        const token = localStorage.getItem('portal_token');
        try {
            const response = await fetch('http://localhost:3002/communities', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                this.communities = await response.json();
                
                // Dispara evento para o shell atualizar a barra lateral
                this.dispatchEvent(new CustomEvent('communities-updated', {
                    detail: { communities: this.communities },
                    bubbles: true,
                    composed: true
                }));
            }
        } catch (err) {
            console.error('Erro ao buscar comunidades:', err);
        }
    }

    async fetchPosts() {
        this.loading = true;
        this.error = '';
        const token = localStorage.getItem('portal_token');
        const url = this.selectedCommunityId ? `http://localhost:3002/posts?communityId=${this.selectedCommunityId}` : 'http://localhost:3002/posts';

        try {
            const response = await fetch(url, {
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

    async handleCreatePost(e) {
        e.preventDefault();
        const user = this.currentUser;
        if (!user) {
            alert('Você precisa estar logado para publicar.');
            return;
        }

        const titleInput = this.shadowRoot.querySelector('#post-title');
        const contentTextarea = this.shadowRoot.querySelector('#post-content');
        
        const title = titleInput.value.trim();
        const content = contentTextarea.value.trim();

        if (!title || !content) {
            alert('Por favor, preencha o título e o conteúdo.');
            return;
        }

        this.creatingPost = true;
        const token = localStorage.getItem('portal_token');
        const authorId = user.id || user.userId;

        try {
            const response = await fetch('http://localhost:3002/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    authorId,
                    communityId: this.selectedCommunityId || null
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Falha ao criar publicação.');
            }

            const createdPost = await response.json();

            // Se houver um arquivo anexado, envia-o agora
            const fileInput = this.shadowRoot.querySelector('#post-attachment');
            const file = fileInput.files ? fileInput.files[0] : null;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(`http://localhost:3002/posts/${createdPost.id}/attachments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadResponse.ok) {
                    const uploadErr = await uploadResponse.json();
                    alert(`Post criado, mas falha no anexo: ${uploadErr.message || 'Arquivo muito grande ou inválido'}`);
                }
            }

            // Limpa o formulário
            titleInput.value = '';
            contentTextarea.value = '';
            this.clearAttachment();

            // Atualiza os posts dinamicamente
            await this.fetchPosts();
        } catch (err) {
            console.error('Erro ao criar postagem:', err);
            alert(`Erro ao publicar: ${err.message}`);
        } finally {
            this.creatingPost = false;
        }
    }

    handleAttachmentChange(e) {
        const fileInput = e.target;
        const file = fileInput.files ? fileInput.files[0] : null;
        const label = this.shadowRoot.querySelector('#attachment-label');
        const clearBtn = this.shadowRoot.querySelector('#clear-attachment-btn');
        if (file) {
            label.textContent = file.name;
            clearBtn.style.display = 'inline-block';
        } else {
            label.textContent = 'Anexo';
            clearBtn.style.display = 'none';
        }
    }

    clearAttachment() {
        const fileInput = this.shadowRoot.querySelector('#post-attachment');
        if (fileInput) {
            fileInput.value = '';
        }
        const label = this.shadowRoot.querySelector('#attachment-label');
        if (label) {
            label.textContent = 'Anexo';
        }
        const clearBtn = this.shadowRoot.querySelector('#clear-attachment-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }
    async toggleLike(postId) {
        const user = this.currentUser;
        if (!user) {
            alert('Faça login para curtir.');
            return;
        }

        const token = localStorage.getItem('portal_token');
        const userId = user.id || user.userId;

        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}/likes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) throw new Error('Falha ao curtir');
            await this.fetchPosts(); // Recarrega os posts para atualizar a contagem
        } catch (err) {
            console.error(err);
            alert('Não foi possível curtir a publicação.');
        }
    }

    toggleCommentBox(postId) {
        const input = this.shadowRoot.querySelector(`#comment-input-${postId}`);
        if (input) {
            input.focus();
        }
    }

    async handleAddComment(e, postId) {
        e.preventDefault();
        const user = this.currentUser;
        if (!user) {
            alert('Faça login para comentar.');
            return;
        }

        const input = this.shadowRoot.querySelector(`#comment-input-${postId}`);
        const content = input.value.trim();
        if (!content) return;

        const token = localStorage.getItem('portal_token');
        const authorId = user.id || user.userId;

        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authorId, content })
            });

            if (!response.ok) throw new Error('Falha ao comentar');
            
            input.value = '';
            await this.fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Não foi possível enviar o comentário.');
        }
    }

    startEditPost(post) {
        this.editingPostId = post.id;
        this.editingPostTitle = post.title;
        this.editingPostContent = post.content;
    }

    cancelEditPost() {
        this.editingPostId = null;
        this.editingPostTitle = '';
        this.editingPostContent = '';
    }

    async handleSavePost(postId) {
        if (!this.editingPostTitle.trim() || !this.editingPostContent.trim()) {
            alert('Título e conteúdo não podem ser vazios.');
            return;
        }

        const token = localStorage.getItem('portal_token');
        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.editingPostTitle,
                    content: this.editingPostContent
                })
            });

            if (!response.ok) throw new Error('Falha ao editar a publicação');

            this.cancelEditPost();
            await this.fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Não foi possível editar a publicação.');
        }
    }

    async handleDeletePost(postId) {
        if (!confirm('Deseja realmente excluir esta publicação?')) return;

        const token = localStorage.getItem('portal_token');
        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao excluir a publicação');

            // Remove do histórico de visualização local também
            this.clickedPosts = this.clickedPosts.filter(p => p.id !== postId);
            localStorage.setItem('portal_clicked_posts', JSON.stringify(this.clickedPosts));

            await this.fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Não foi possível excluir a publicação.');
        }
    }

    startEditComment(comment) {
        this.editingCommentId = comment.id;
        this.editingCommentContent = comment.content;
    }

    cancelEditComment() {
        this.editingCommentId = null;
        this.editingCommentContent = '';
    }

    async handleSaveComment(postId, commentId) {
        if (!this.editingCommentContent.trim()) {
            alert('O comentário não pode ser vazio.');
            return;
        }

        const token = localStorage.getItem('portal_token');
        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: this.editingCommentContent
                })
            });

            if (!response.ok) throw new Error('Falha ao editar o comentário');

            this.cancelEditComment();
            await this.fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Não foi possível editar o comentário.');
        }
    }

    async handleDeleteComment(postId, commentId) {
        if (!confirm('Deseja realmente excluir este comentário?')) return;

        const token = localStorage.getItem('portal_token');
        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao excluir o comentário');

            await this.fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Não foi possível excluir o comentário.');
        }
    }

    toggleReplyBox(commentId, mentionEmail = '') {
        if (this.activeReplyBox === commentId && !mentionEmail) {
            this.activeReplyBox = null;
            this.replyContent = '';
        } else {
            this.activeReplyBox = commentId;
            this.replyContent = '';
            
            setTimeout(() => {
                const input = this.shadowRoot.querySelector(`#reply-input-${commentId}`);
                if (input) {
                    if (mentionEmail) {
                        const mentionName = mentionEmail.split('@')[0];
                        input.value = `@${mentionName} `;
                    }
                    input.focus();
                }
            }, 50);
        }
    }

    async handleAddReply(e, postId, parentId, inputId = null) {
        e.preventDefault();
        const user = this.currentUser;
        if (!user) {
            alert('Faça login para responder.');
            return;
        }

        const actualInputId = inputId || parentId;
        const input = this.shadowRoot.querySelector(`#reply-input-${actualInputId}`);
        const content = input.value.trim();
        if (!content) return;

        const token = localStorage.getItem('portal_token');
        const authorId = user.id || user.userId;

        try {
            const response = await fetch(`http://localhost:3002/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authorId, content, parentId })
            });

            if (!response.ok) throw new Error('Falha ao responder comentário');

            input.value = '';
            this.activeReplyBox = null;
            await this.fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Não foi possível enviar a resposta.');
        }
    }

    selectCommunity(communityId) {
        this.selectedCommunityId = communityId;
        this.fetchPosts();
    }

    openCreateCommunityModal() {
        this.showCreateCommunityModal = true;
    }

    closeCreateCommunityModal() {
        this.showCreateCommunityModal = false;
        this.newCommunityName = '';
        this.newCommunityDescription = '';
        this.newCommunityIsLocked = false;
        this.newCommunityPassword = '';
    }

    async handleCreateCommunity(e) {
        e.preventDefault();
        const user = this.currentUser;
        if (!user) {
            alert('Você precisa estar logado para criar uma comunidade.');
            return;
        }

        const token = localStorage.getItem('portal_token');
        const ownerId = user.id || user.userId;

        try {
            const response = await fetch('http://localhost:3002/communities', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.newCommunityName,
                    description: this.newCommunityDescription || null,
                    isLocked: this.newCommunityIsLocked,
                    password: this.newCommunityIsLocked ? this.newCommunityPassword : null,
                    ownerId
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Falha ao criar comunidade.');
            }

            this.closeCreateCommunityModal();
            await this.fetchCommunities();
            alert('Comunidade criada com sucesso!');
        } catch (err) {
            console.error('Erro ao criar comunidade:', err);
            alert(err.message);
        }
    }

    async handleJoinCommunity(communityId, isLocked) {
        const user = this.currentUser;
        if (!user) {
            alert('Você precisa estar logado para entrar em uma comunidade.');
            return;
        }

        if (isLocked) {
            this.communityPasswordPromptId = communityId;
            this.communityPasswordInput = '';
            return;
        }

        await this._submitJoinRequest(communityId);
    }

    async _submitJoinRequest(communityId, password = null) {
        const user = this.currentUser;
        const token = localStorage.getItem('portal_token');
        const userId = user.id || user.userId;

        try {
            const response = await fetch(`http://localhost:3002/communities/${communityId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    password
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Falha ao entrar na comunidade.');
            }

            alert(data.message || 'Você entrou na comunidade!');
            this.communityPasswordPromptId = null;
            this.communityPasswordInput = '';
            await this.fetchCommunities();
            this.selectCommunity(communityId);
        } catch (err) {
            console.error('Erro ao entrar na comunidade:', err);
            alert(err.message);
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

    loadClickedPosts() {
        try {
            const raw = localStorage.getItem('portal_clicked_posts');
            this.clickedPosts = raw ? JSON.parse(raw) : [];
        } catch (e) {
            this.clickedPosts = [];
        }
    }

    registerPostClick(post) {
        // Evita registrar cliques múltiplos consecutivos para o mesmo post
        if (this.clickedPosts.length > 0 && this.clickedPosts[0].id === post.id) {
            return;
        }

        let posts = [];
        try {
            const raw = localStorage.getItem('portal_clicked_posts');
            posts = raw ? JSON.parse(raw) : [];
        } catch (e) {}

        // Remove do histórico existente se já houver (para puxar pro topo)
        posts = posts.filter(p => p.id !== post.id);
        
        // Adiciona ao topo
        posts.unshift({
            id: post.id,
            title: post.title,
            clickedAt: new Date().toISOString()
        });

        // Limita a 8 posts
        if (posts.length > 8) {
            posts = posts.slice(0, 8);
        }

        this.clickedPosts = posts;
        localStorage.setItem('portal_clicked_posts', JSON.stringify(posts));
    }

    scrollToPost(postId) {
        const postElement = this.shadowRoot.querySelector(`[key="${postId}"]`);
        if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Efeito visual de destaque no post scrollado
            const originalShadow = postElement.style.boxShadow;
            const originalTransition = postElement.style.transition;
            
            postElement.style.transition = 'all 0.3s ease';
            postElement.style.boxShadow = '0 0 15px rgba(0, 174, 239, 0.5)';
            
            setTimeout(() => {
                postElement.style.boxShadow = originalShadow;
                postElement.style.transition = originalTransition;
            }, 1500);
        }
    }

    dispatchSwitchTab(tabName) {
        this.dispatchEvent(new CustomEvent('portal-switch-tab', {
            detail: { tab: tabName },
            bubbles: true,
            composed: true
        }));
    }

    renderCommunitySidebarItem(c, isMemberOrOwner = true) {
        const isActive = this.selectedCommunityId === c.id;
        return html`
            <div class="community-item ${isActive ? 'active' : ''}" @click="${() => isMemberOrOwner ? this.selectCommunity(c.id) : null}">
                <div class="community-info">
                    <span class="community-name">
                        ${c.isLocked ? '🔒' : '💬'} ${c.name}
                    </span>
                    <span class="community-desc">${c.description || 'Sem descrição'}</span>
                </div>
                ${!isMemberOrOwner ? html`
                    <button class="community-action-btn" @click="${(e) => { e.stopPropagation(); this.handleJoinCommunity(c.id, c.isLocked); }}">Entrar</button>
                ` : html`
                    <span style="font-size: 0.75em; color: #10b981; font-weight: 600; padding: 2px 6px; background: #ecfdf5; border-radius: 4px; flex-shrink: 0;">Membro</span>
                `}
            </div>
        `;
    }

    render() {
        const user = this.currentUser;
        const email = user ? user.email : 'Visitante';
        const initials = user ? this._getInitials(user.email) : 'US';
        const role = user ? (user.profileType?.toLowerCase() === 'professor' ? 'Professor' : 'Estudante') : 'Visitante';

        return html`
            <div class="container">
                <!-- Coluna Central: Feed -->
                <main class="feed">
                    <!-- Criador de Post -->
                    <form class="card creator-card" @submit="${this.handleCreatePost}">
                        <div class="creator-header">
                            <div class="creator-avatar">${initials}</div>
                            <div class="creator-inputs">
                                <input 
                                    type="text" 
                                    id="post-title" 
                                    class="creator-title-input" 
                                    placeholder="Título da publicação..." 
                                    ?disabled="${!user || this.creatingPost}"
                                    required
                                />
                                <textarea 
                                    id="post-content"
                                    class="creator-textarea" 
                                    placeholder="No que você está pensando, ${user ? email.split('@')[0].split('.')[0] : 'colega'}?" 
                                    ?disabled="${!user || this.creatingPost}"
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div class="creator-actions" style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label for="post-attachment" style="cursor: pointer; background: var(--button-attachment-bg, #f1f5f9); border: 1px solid var(--button-attachment-border, #cbd5e1); padding: 6px 12px; border-radius: 6px; font-size: 0.9em; font-weight: 600; display: flex; align-items: center; gap: 6px; color: var(--button-attachment-text, #475569);" title="Adicionar anexo">
                                    <span>📎</span> <span id="attachment-label">Anexo</span>
                                </label>
                                <input 
                                    type="file" 
                                    id="post-attachment" 
                                    style="display: none;" 
                                    ?disabled="${!user || this.creatingPost}"
                                    @change="${this.handleAttachmentChange}"
                                />
                                <button type="button" id="clear-attachment-btn" style="display: none; background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1em; padding: 2px;" @click="${this.clearAttachment}" title="Remover anexo">&times;</button>
                            </div>
                            <button 
                                type="submit" 
                                class="publish-btn active" 
                                ?disabled="${!user || this.creatingPost}"
                            >
                                ${this.creatingPost ? 'Publicando...' : 'Publicar'}
                            </button>
                        </div>
                    </form>

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
                            const authorInitials = this._getInitials(authorEmail, post.author ? post.author.name : null);
                            const isStudent = post.author ? (post.author.profileType?.toLowerCase() === 'student') : true;
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
                                <div class="card post-card" key="${post.id}" @click="${() => this.registerPostClick(post)}">
                                    <div class="post-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="display: flex; gap: 12px; align-items: center;">
                                            <div class="post-author-avatar ${isStudent ? 'student-av' : ''}">${authorInitials}</div>
                                            <div class="post-meta">
                                                <h4 class="post-author-name">
                                                    ${post.author && post.author.name ? post.author.name : authorEmail.split('@')[0]}
                                                    <span class="post-author-badge">${authorRoleLabel}</span>
                                                </h4>
                                                <div class="post-time">${dateStr}</div>
                                            </div>
                                        </div>
                                        ${post.authorId === (this.currentUser?.id || this.currentUser?.userId) ? html`
                                            <div class="post-actions-menu" style="display: flex; gap: 8px;">
                                                <button @click="${() => this.startEditPost(post)}" class="post-edit-btn" title="Editar Publicação">Editar</button>
                                                <button @click="${() => this.handleDeletePost(post.id)}" class="post-delete-btn" title="Excluir Publicação">Excluir</button>
                                            </div>
                                        ` : ''}
                                    </div>

                                    ${this.editingPostId === post.id ? html`
                                        <div class="edit-post-form" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; padding: 12px; background: var(--inner-card-bg, #f8fafc); border-radius: 8px; border: 1px solid var(--inner-card-border, #e2e8f0); color: var(--inner-card-text, #475569);">
                                            <input type="text" .value="${this.editingPostTitle}" @input="${(e) => this.editingPostTitle = e.target.value}" style="padding: 8px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 6px; font-weight: 600;" placeholder="Título..." />
                                            <textarea @input="${(e) => this.editingPostContent = e.target.value}" style="padding: 8px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 6px; min-height: 85px; font-family: inherit;" placeholder="Conteúdo...">${this.editingPostContent}</textarea>
                                            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px;">
                                                <button @click="${() => this.cancelEditPost()}" style="padding: 6px 12px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 6px; background: var(--card-bg, white); color: var(--text-main, #334155); cursor: pointer; font-size: 0.9em;">Cancelar</button>
                                                <button @click="${() => this.handleSavePost(post.id)}" style="padding: 6px 12px; border: none; border-radius: 6px; background: var(--accent-btn-bg, #0d3168); color: white; cursor: pointer; font-weight: 600; font-size: 0.9em;">Salvar</button>
                                            </div>
                                        </div>
                                    ` : html`
                                        <h3 class="post-title" style="margin-top: 12px; margin-bottom: 8px; color: var(--title-color, #0d3168);">${post.title}</h3>
                                        <p class="post-content" style="color: var(--text-main, #334155); line-height: 1.5; white-space: pre-wrap;">${post.content}</p>
                                        ${post.attachments && post.attachments.length > 0 ? html`
                                            <div class="post-attachments" style="margin-top: 12px; padding: 10px; background: var(--inner-card-bg, #f8fafc); border-radius: 8px; border: 1px solid var(--inner-card-border, #e2e8f0); display: flex; flex-direction: column; gap: 8px; color: var(--inner-card-text, #475569);">
                                                <strong style="font-size: 0.85em; color: var(--inner-card-text, #475569);">Anexos:</strong>
                                                ${post.attachments.map(att => {
                                                    const isImage = att.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                    const fullUrl = att.fileUrl.startsWith('http') ? att.fileUrl : `http://localhost:3002${att.fileUrl}`;
                                                    return html`
                                                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9em;">
                                                            <span>📎</span>
                                                            ${isImage ? html`
                                                                <a href="${fullUrl}" target="_blank" style="color: var(--title-color, #00aeef); font-weight: 600; text-decoration: none; display: flex; flex-direction: column; gap: 4px;">
                                                                    <span>${att.fileName}</span>
                                                                    <img src="${fullUrl}" style="max-width: 200px; max-height: 120px; border-radius: 6px; border: 1px solid var(--border-color, #cbd5e1); margin-top: 4px;" />
                                                                </a>
                                                            ` : html`
                                                                <a href="${fullUrl}" target="_blank" style="color: var(--title-color, #00aeef); font-weight: 600; text-decoration: none;">${att.fileName}</a>
                                                            `}
                                                        </div>
                                                    `;
                                                })}
                                            </div>
                                        ` : ''}
                                    `}

                                    <div class="post-actions">
                                        <div class="post-action-btn ${post.likes?.some(l => l.userId === (this.currentUser?.id || this.currentUser?.userId)) ? 'liked' : ''}" @click="${() => this.toggleLike(post.id)}">
                                            <span>${post.likes?.some(l => l.userId === (this.currentUser?.id || this.currentUser?.userId)) ? '❤️' : '🤍'}</span> ${post.likes?.length || 0} Curtidas
                                        </div>
                                        <div class="post-action-btn" @click="${() => this.toggleCommentBox(post.id)}">
                                            <span class="comment-icon">💬</span> ${post.comments?.length || 0} Comentários
                                        </div>
                                    </div>
                                    
                                    ${post.comments && post.comments.length > 0 ? html`
                                        <div class="comments-list" style="margin-top: 15px; border-left: 3px solid var(--border-color, #e2e8f0); padding-left: 16px; margin-left: 16px;">
                                            ${(() => {
                                                 const rootComments = post.comments.filter(c => !c.parentId);
                                                 return rootComments.map(comment => {
                                                     const authorName = comment.author?.email ? comment.author.email.split('@')[0] : 'Usuário';
                                                     const isCommentAuthor = comment.authorId === (this.currentUser?.id || this.currentUser?.userId);
                                                     const replies = post.comments.filter(c => c.parentId === comment.id);

                                                     return html`
                                                         <!-- Comentário Principal (Root) -->
                                                         <div style="font-size: 0.85em; margin-bottom: 8px; padding: 10px; background: var(--bg-color, #f8fafc); border-radius: 8px; border: 1px solid var(--border-color, #f1f5f9); display: flex; flex-direction: column; gap: 6px;">
                                                             <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                                                                 <div style="flex: 1;">
                                                                     <strong style="color: var(--title-color, #0d3168); display: block; margin-bottom: 2px;">${authorName}</strong>
                                                                     ${this.editingCommentId === comment.id ? html`
                                                                         <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
                                                                             <input type="text" .value="${this.editingCommentContent}" @input="${(e) => this.editingCommentContent = e.target.value}" style="padding: 6px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 4px; width: 100%; box-sizing: border-box;" />
                                                                             <div style="display: flex; gap: 4px; justify-content: flex-end;">
                                                                                 <button @click="${() => this.cancelEditComment()}" style="padding: 3px 8px; border: 1px solid var(--border-color, #cbd5e1); background: var(--card-bg, white); color: var(--text-main, #334155); border-radius: 4px; cursor: pointer; font-size: 0.85em;">Cancelar</button>
                                                                                 <button @click="${() => this.handleSaveComment(post.id, comment.id)}" style="padding: 3px 8px; border: none; background: var(--accent-btn-bg, #0d3168); color: white; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Salvar</button>
                                                                             </div>
                                                                         </div>
                                                                     ` : html`
                                                                         <span style="color: var(--text-main, #334155); white-space: pre-wrap;">${comment.content}</span>
                                                                     `}
                                                                 </div>
                                                                 <div style="display: flex; gap: 4px; flex-shrink: 0; align-items: center;">
                                                                     <button @click="${() => this.toggleReplyBox(comment.id)}" class="post-edit-btn" style="color: var(--title-color, #0d3168);" title="Responder">Responder</button>
                                                                     ${isCommentAuthor && this.editingCommentId !== comment.id ? html`
                                                                         <button @click="${() => this.startEditComment(comment)}" class="post-edit-btn" title="Editar Comentário">Editar</button>
                                                                         <button @click="${() => this.handleDeleteComment(post.id, comment.id)}" class="post-delete-btn" title="Excluir Comentário">Excluir</button>
                                                                     ` : ''}
                                                                 </div>
                                                             </div>

                                                             <!-- Caixa de Resposta (Reply Form) -->
                                                             ${this.activeReplyBox === comment.id ? html`
                                                                 <form @submit="${(e) => this.handleAddReply(e, post.id, comment.id)}" style="display: flex; gap: 8px; margin-top: 6px;">
                                                                     <input type="text" id="reply-input-${comment.id}" placeholder="Escreva uma resposta..." style="flex: 1; padding: 6px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 4px; font-size: 0.95em;" required />
                                                                     <button type="submit" style="background: var(--accent-btn-bg, #0d3168); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Responder</button>
                                                                 </form>
                                                             ` : ''}
                                                         </div>

                                                         <!-- Respostas Indentadas (Replies) -->
                                                         ${replies.length > 0 ? html`
                                                             <div class="replies-list" style="margin-left: 24px; border-left: 2px dashed var(--border-color, #cbd5e1); padding-left: 12px; margin-bottom: 12px;">
                                                                 ${replies.map(reply => {
                                                                     const replyAuthorName = reply.author?.email ? reply.author.email.split('@')[0] : 'Usuário';
                                                                     const isReplyAuthor = reply.authorId === (this.currentUser?.id || this.currentUser?.userId);

                                                                     return html`
                                                                         <div style="font-size: 0.85em; margin-bottom: 6px; padding: 8px; background: var(--bg-color, #f8fafc); border-radius: 8px; display: flex; justify-content: space-between; align-items: flex-start; border: 1px solid var(--border-color, #f1f5f9); gap: 8px;">
                                                                             <div style="flex: 1;">
                                                                                 <strong style="color: var(--title-color, #0d3168); display: block; margin-bottom: 2px;">${replyAuthorName} <span style="font-weight: normal; color: var(--text-muted, #64748b); font-size: 0.9em;">(resposta)</span></strong>
                                                                                 ${this.editingCommentId === reply.id ? html`
                                                                                     <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
                                                                                         <input type="text" .value="${this.editingCommentContent}" @input="${(e) => this.editingCommentContent = e.target.value}" style="padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; width: 100%; box-sizing: border-box;" />
                                                                                         <div style="display: flex; gap: 4px; justify-content: flex-end;">
                                                                                             <button @click="${() => this.cancelEditComment()}" style="padding: 3px 8px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Cancelar</button>
                                                                                             <button @click="${() => this.handleSaveComment(post.id, reply.id)}" style="padding: 3px 8px; border: none; background: var(--accent-btn-bg, #0d3168); color: white; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Salvar</button>
                                                                                         </div>
                                                                                     </div>
                                                                                 ` : html`
                                                                                     <span style="color: var(--text-main, #334155); white-space: pre-wrap;">${reply.content}</span>
                                                                                 `}
                                                                             </div>
                                                                             <div style="display: flex; gap: 4px; flex-shrink: 0; align-items: center;">
                                                                                 <button @click="${() => this.toggleReplyBox(reply.id, reply.author?.email)}" class="post-edit-btn" style="color: var(--title-color, #0d3168);" title="Responder">Responder</button>
                                                                                 ${isReplyAuthor && this.editingCommentId !== reply.id ? html`
                                                                                     <button @click="${() => this.startEditComment(reply)}" class="post-edit-btn" title="Editar Resposta">Editar</button>
                                                                                     <button @click="${() => this.handleDeleteComment(post.id, reply.id)}" class="post-delete-btn" title="Excluir Resposta">Excluir</button>
                                                                                 ` : ''}
                                                                             </div>
                                                                         </div>
                                                                         <!-- Caixa de Resposta para a Resposta (Reply Form) -->
                                                                         ${this.activeReplyBox === reply.id ? html`
                                                                             <form @submit="${(e) => this.handleAddReply(e, post.id, comment.id, reply.id)}" style="display: flex; gap: 8px; margin-top: 4px; margin-bottom: 8px;">
                                                                                 <input type="text" id="reply-input-${reply.id}" placeholder="Escreva uma resposta..." style="flex: 1; padding: 6px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 4px; font-size: 0.95em;" required />
                                                                                 <button type="submit" style="background: var(--accent-btn-bg, #0d3168); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Responder</button>
                                                                             </form>
                                                                         ` : ''}
                                                                     `;
                                                                 })}
                                                             </div>
                                                         ` : ''}
                                                     `;
                                                 });
                                             })()}
                                        </div>
                                     ` : ''}

                                    <form class="comment-form" @submit="${(e) => this.handleAddComment(e, post.id)}" style="display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color, #f1f5f9);">
                                        <input type="text" id="comment-input-${post.id}" placeholder="Escreva um comentário..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-color, #cbd5e1); border-radius: 8px; font-size: 0.9em; outline: none;" required />
                                        <button type="submit" style="background: var(--accent-btn-bg, #0d3168); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.95em; font-weight: 600;">Comentar</button>
                                    </form>
                                </div>
                            `;
                        })
                    }
                </main>

                <!-- Coluna Direita: Histórico -->
                <aside class="widgets">
                    <div class="card widget-card history-card">
                        <h3 class="widget-title">Histórico de Visualização</h3>
                        <div class="history-list">
                            ${this.clickedPosts && this.clickedPosts.length > 0 ? this.clickedPosts.map(post => {
                                const clickTimeStr = post.clickedAt ? new Date(post.clickedAt).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : '';
                                return html`
                                    <div class="history-item" @click="${() => this.scrollToPost(post.id)}">
                                        <span class="history-item-title">${post.title}</span>
                                        <span class="history-item-time">Clicado às ${clickTimeStr}</span>
                                    </div>
                                `;
                            }) : html`
                                <div style="text-align: center; color: #64748b; font-size: 0.85em; padding: 10px 0; font-style: italic;">
                                    Nenhum post clicado recentemente.
                                </div>
                            `}
                        </div>
                    </div>
                </aside>
            </div>

            <!-- Modal de Criação de Comunidade -->
            ${this.showCreateCommunityModal ? html`
                <div class="modal-overlay">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 class="modal-title">Nova Comunidade</h3>
                            <button class="modal-close" @click="${() => this.closeCreateCommunityModal()}">&times;</button>
                        </div>
                        <form class="modal-form" @submit="${(e) => this.handleCreateCommunity(e)}">
                            <div class="form-group">
                                <label for="comm-name">Nome</label>
                                <input type="text" id="comm-name" .value="${this.newCommunityName}" @input="${(e) => this.newCommunityName = e.target.value}" required placeholder="Ex: Grupo de Estudo de NestJS" />
                            </div>
                            <div class="form-group">
                                <label for="comm-desc">Descrição</label>
                                <textarea id="comm-desc" .value="${this.newCommunityDescription}" @input="${(e) => this.newCommunityDescription = e.target.value}" placeholder="Descreva o propósito da comunidade..."></textarea>
                            </div>
                            <div class="form-group form-row">
                                <input type="checkbox" id="comm-locked" .checked="${this.newCommunityIsLocked}" @change="${(e) => this.newCommunityIsLocked = e.target.checked}" />
                                <label for="comm-locked">Restrita com Senha (Privada)</label>
                            </div>
                            ${this.newCommunityIsLocked ? html`
                                <div class="form-group">
                                    <label for="comm-pass">Senha de Acesso</label>
                                    <input type="password" id="comm-pass" .value="${this.newCommunityPassword}" @input="${(e) => this.newCommunityPassword = e.target.value}" required placeholder="Digite a senha de acesso" />
                                </div>
                            ` : ''}
                            <button type="submit" style="background: #00aeef; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 8px;">Criar Comunidade</button>
                        </form>
                    </div>
                </div>
            ` : ''}

            <!-- Prompt de Senha para Entrar em Comunidade Trancada -->
            ${this.communityPasswordPromptId ? html`
                <div class="modal-overlay">
                    <div class="modal-container" style="max-width: 380px;">
                        <div class="modal-header">
                            <h3 class="modal-title">Comunidade Restrita</h3>
                            <button class="modal-close" @click="${() => this.communityPasswordPromptId = null}">&times;</button>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
                            <p style="font-size: 0.9em; color: #475569; margin: 0;">Esta comunidade requer uma senha de acesso para ingressar.</p>
                            <div class="form-group">
                                <label for="prompt-pass">Senha</label>
                                <input type="password" id="prompt-pass" .value="${this.communityPasswordInput}" @input="${(e) => this.communityPasswordInput = e.target.value}" placeholder="Digite a senha" />
                            </div>
                            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                                <button @click="${() => this.communityPasswordPromptId = null}" style="padding: 8px 14px; border: 1px solid #cbd5e1; background: white; border-radius: 6px; cursor: pointer; font-size: 0.9em;">Cancelar</button>
                                <button @click="${() => this._submitJoinRequest(this.communityPasswordPromptId, this.communityPasswordInput)}" style="padding: 8px 14px; border: none; background: #00aeef; color: white; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9em;">Entrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('community-application', CommunityApplication);
