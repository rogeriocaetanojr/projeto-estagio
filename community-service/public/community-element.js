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
        replyContent: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f9;
            color: #1e293b;
            min-height: 100vh;
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
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
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 0.95em;
            font-family: inherit;
            font-weight: 600;
            color: #1e293b;
            background-color: #ffffff;
            outline: none;
            transition: all 0.2s ease-in-out;
        }

        .creator-textarea {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            font-size: 0.95em;
            resize: none;
            height: 80px;
            font-family: inherit;
            color: #1e293b;
            background-color: #ffffff;
            outline: none;
            transition: all 0.2s ease-in-out;
        }

        .creator-title-input:focus,
        .creator-textarea:focus {
            border-color: #00aeef;
            box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.15);
        }

        .creator-title-input:disabled,
        .creator-textarea:disabled {
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
            transition: all 0.2s ease-in-out;
        }

        .publish-btn.active {
            background-color: #0d3168;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        .publish-btn.active:hover:not(:disabled) {
            background-color: #00aeef;
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
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s ease-in-out;
            user-select: none;
        }

        .post-action-btn:hover {
            color: #00aeef;
            background-color: #f1f5f9;
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
        this.creatingPost = false;
        this.activeCommentBox = null; // ID do post que tem a caixa de comentário aberta
        this.editingPostId = null;
        this.editingPostTitle = '';
        this.editingPostContent = '';
        this.editingCommentId = null;
        this.editingCommentContent = '';
        this.activeReplyBox = null;
        this.replyContent = '';
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
                    authorId
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Falha ao criar publicação.');
            }

            // Limpa o formulário
            titleInput.value = '';
            contentTextarea.value = '';

            // Atualiza os posts dinamicamente
            await this.fetchPosts();
        } catch (err) {
            console.error('Erro ao criar postagem:', err);
            alert(`Erro ao publicar: ${err.message}`);
        } finally {
            this.creatingPost = false;
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
        if (this.activeCommentBox === postId) {
            this.activeCommentBox = null;
        } else {
            this.activeCommentBox = postId;
        }
        this.requestUpdate();
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
            this.activeCommentBox = null;
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

    toggleReplyBox(commentId) {
        if (this.activeReplyBox === commentId) {
            this.activeReplyBox = null;
            this.replyContent = '';
        } else {
            this.activeReplyBox = commentId;
            this.replyContent = '';
        }
    }

    async handleAddReply(e, postId, parentId) {
        e.preventDefault();
        const user = this.currentUser;
        if (!user) {
            alert('Faça login para responder.');
            return;
        }

        const input = this.shadowRoot.querySelector(`#reply-input-${parentId}`);
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
                        <div class="creator-actions">
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
                            const authorInitials = this._getInitials(authorEmail);
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
                                <div class="card post-card" key="${post.id}">
                                    <div class="post-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="display: flex; gap: 12px; align-items: center;">
                                            <div class="post-author-avatar ${isStudent ? 'student-av' : ''}">${authorInitials}</div>
                                            <div class="post-meta">
                                                <h4 class="post-author-name">
                                                    ${authorEmail.split('@')[0]}
                                                    <span class="post-author-badge">${authorRoleLabel}</span>
                                                </h4>
                                                <div class="post-time">${dateStr}</div>
                                            </div>
                                        </div>
                                        ${post.authorId === (this.currentUser?.id || this.currentUser?.userId) ? html`
                                            <div class="post-actions-menu" style="display: flex; gap: 8px;">
                                                <button @click="${() => this.startEditPost(post)}" style="background: none; border: none; cursor: pointer; font-size: 1.1em; color: #64748b;" title="Editar Publicação">✏️</button>
                                                <button @click="${() => this.handleDeletePost(post.id)}" style="background: none; border: none; cursor: pointer; font-size: 1.1em; color: #ef4444;" title="Excluir Publicação">🗑️</button>
                                            </div>
                                        ` : ''}
                                    </div>

                                    ${this.editingPostId === post.id ? html`
                                        <div class="edit-post-form" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                                            <input type="text" .value="${this.editingPostTitle}" @input="${(e) => this.editingPostTitle = e.target.value}" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600;" placeholder="Título..." />
                                            <textarea @input="${(e) => this.editingPostContent = e.target.value}" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 85px; font-family: inherit;" placeholder="Conteúdo...">${this.editingPostContent}</textarea>
                                            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px;">
                                                <button @click="${() => this.cancelEditPost()}" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: white; cursor: pointer; font-size: 0.9em;">Cancelar</button>
                                                <button @click="${() => this.handleSavePost(post.id)}" style="padding: 6px 12px; border: none; border-radius: 6px; background: #00aeef; color: white; cursor: pointer; font-weight: 600; font-size: 0.9em;">Salvar</button>
                                            </div>
                                        </div>
                                    ` : html`
                                        <h3 class="post-title" style="margin-top: 12px; margin-bottom: 8px; color: #0d3168;">${post.title}</h3>
                                        <p class="post-content" style="color: #334155; line-height: 1.5; white-space: pre-wrap;">${post.content}</p>
                                    `}

                                    <div class="post-actions">
                                        <div class="post-action-btn ${post.likes?.some(l => l.userId === (this.currentUser?.id || this.currentUser?.userId)) ? 'liked' : ''}" @click="${() => this.toggleLike(post.id)}">
                                            <span>👍</span> ${post.likes?.length || 0} Curtidas
                                        </div>
                                        <div class="post-action-btn" @click="${() => this.toggleCommentBox(post.id)}">
                                            <span>💬</span> ${post.comments?.length || 0} Comentários
                                        </div>
                                    </div>
                                    
                                    ${post.comments && post.comments.length > 0 ? html`
                                        <div class="comments-list" style="margin-top: 15px; border-left: 3px solid #e2e8f0; padding-left: 16px; margin-left: 16px;">
                                            ${(() => {
                                                 const rootComments = post.comments.filter(c => !c.parentId);
                                                 return rootComments.map(comment => {
                                                     const authorName = comment.author?.email ? comment.author.email.split('@')[0] : 'Usuário';
                                                     const isCommentAuthor = comment.authorId === (this.currentUser?.id || this.currentUser?.userId);
                                                     const replies = post.comments.filter(c => c.parentId === comment.id);

                                                     return html`
                                                         <!-- Comentário Principal (Root) -->
                                                         <div style="font-size: 0.85em; margin-bottom: 8px; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 6px;">
                                                             <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                                                                 <div style="flex: 1;">
                                                                     <strong style="color: #0d3168; display: block; margin-bottom: 2px;">${authorName}</strong>
                                                                     ${this.editingCommentId === comment.id ? html`
                                                                         <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
                                                                             <input type="text" .value="${this.editingCommentContent}" @input="${(e) => this.editingCommentContent = e.target.value}" style="padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; width: 100%; box-sizing: border-box;" />
                                                                             <div style="display: flex; gap: 4px; justify-content: flex-end;">
                                                                                 <button @click="${() => this.cancelEditComment()}" style="padding: 3px 8px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Cancelar</button>
                                                                                 <button @click="${() => this.handleSaveComment(post.id, comment.id)}" style="padding: 3px 8px; border: none; background: #00aeef; color: white; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Salvar</button>
                                                                             </div>
                                                                         </div>
                                                                     ` : html`
                                                                         <span style="color: #334155; white-space: pre-wrap;">${comment.content}</span>
                                                                     `}
                                                                 </div>
                                                                 <div style="display: flex; gap: 4px; flex-shrink: 0; align-items: center;">
                                                                     <button @click="${() => this.toggleReplyBox(comment.id)}" style="background: none; border: none; cursor: pointer; font-size: 1.1em; color: #00aeef; padding: 2px;" title="Responder">💬</button>
                                                                     ${isCommentAuthor && this.editingCommentId !== comment.id ? html`
                                                                         <button @click="${() => this.startEditComment(comment)}" style="background: none; border: none; cursor: pointer; font-size: 1em; color: #64748b; padding: 2px;" title="Editar Comentário">✏️</button>
                                                                         <button @click="${() => this.handleDeleteComment(post.id, comment.id)}" style="background: none; border: none; cursor: pointer; font-size: 1em; color: #ef4444; padding: 2px;" title="Excluir Comentário">🗑️</button>
                                                                     ` : ''}
                                                                 </div>
                                                             </div>

                                                             <!-- Caixa de Resposta (Reply Form) -->
                                                             ${this.activeReplyBox === comment.id ? html`
                                                                 <form @submit="${(e) => this.handleAddReply(e, post.id, comment.id)}" style="display: flex; gap: 8px; margin-top: 6px;">
                                                                     <input type="text" id="reply-input-${comment.id}" placeholder="Escreva uma resposta..." style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.95em;" required />
                                                                     <button type="submit" style="background: #00aeef; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Responder</button>
                                                                 </form>
                                                             ` : ''}
                                                         </div>

                                                         <!-- Respostas Indentadas (Replies) -->
                                                         ${replies.length > 0 ? html`
                                                             <div class="replies-list" style="margin-left: 24px; border-left: 2px dashed #cbd5e1; padding-left: 12px; margin-bottom: 12px;">
                                                                 ${replies.map(reply => {
                                                                     const replyAuthorName = reply.author?.email ? reply.author.email.split('@')[0] : 'Usuário';
                                                                     const isReplyAuthor = reply.authorId === (this.currentUser?.id || this.currentUser?.userId);

                                                                     return html`
                                                                         <div style="font-size: 0.85em; margin-bottom: 6px; padding: 8px; background: #f8fafc; border-radius: 8px; display: flex; justify-content: space-between; align-items: flex-start; border: 1px solid #f1f5f9; gap: 8px;">
                                                                             <div style="flex: 1;">
                                                                                 <strong style="color: #0d3168; display: block; margin-bottom: 2px;">${replyAuthorName} <span style="font-weight: normal; color: #64748b; font-size: 0.9em;">(resposta)</span></strong>
                                                                                 ${this.editingCommentId === reply.id ? html`
                                                                                     <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
                                                                                         <input type="text" .value="${this.editingCommentContent}" @input="${(e) => this.editingCommentContent = e.target.value}" style="padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; width: 100%; box-sizing: border-box;" />
                                                                                         <div style="display: flex; gap: 4px; justify-content: flex-end;">
                                                                                             <button @click="${() => this.cancelEditComment()}" style="padding: 3px 8px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Cancelar</button>
                                                                                             <button @click="${() => this.handleSaveComment(post.id, reply.id)}" style="padding: 3px 8px; border: none; background: #00aeef; color: white; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Salvar</button>
                                                                                         </div>
                                                                                     </div>
                                                                                 ` : html`
                                                                                     <span style="color: #334155; white-space: pre-wrap;">${reply.content}</span>
                                                                                 `}
                                                                             </div>
                                                                             ${isReplyAuthor && this.editingCommentId !== reply.id ? html`
                                                                                 <div style="display: flex; gap: 4px; flex-shrink: 0;">
                                                                                     <button @click="${() => this.startEditComment(reply)}" style="background: none; border: none; cursor: pointer; font-size: 1em; color: #64748b; padding: 2px;" title="Editar Resposta">✏️</button>
                                                                                     <button @click="${() => this.handleDeleteComment(post.id, reply.id)}" style="background: none; border: none; cursor: pointer; font-size: 1em; color: #ef4444; padding: 2px;" title="Excluir Resposta">🗑️</button>
                                                                                 </div>
                                                                             ` : ''}
                                                                         </div>
                                                                     `;
                                                                 })}
                                                             </div>
                                                         ` : ''}
                                                     `;
                                                 });
                                             })()}
                                        </div>
                                     ` : ''}

                                    ${this.activeCommentBox === post.id ? html`
                                        <form class="comment-form" @submit="${(e) => this.handleAddComment(e, post.id)}" style="display: flex; gap: 8px; margin-top: 10px;">
                                            <input type="text" id="comment-input-${post.id}" placeholder="Escreva um comentário..." style="flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;" required />
                                            <button type="submit" style="background: #00aeef; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Enviar</button>
                                        </form>
                                    ` : ''}
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
