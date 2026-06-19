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
        .course-card {
            background: white;
            padding: 12px;
            margin-top: 10px;
            border-radius: 6px;
            border-left: 4px solid #0b5c66;
        }
        .lesson-item {
            font-size: 0.9em;
            color: #555;
            margin-left: 10px;
        }
    `;

    static properties = {
        courses: { type: Array }
    };

    constructor() {
        super();
        this.courses = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchCourses();
    }

    async fetchCourses() {
        try {
            const response = await fetch('http://localhost:3003/courses');
            this.courses = await response.json();
        } catch (error) {
            console.error('Erro ao buscar cursos do back-end:', error);
        }
    }

    render() {
        return html`
            <div>
                <h2>Education Micro-Frontend</h2>
                <p>Dados consumidos dinamicamente via API do NestJS + Prisma ORM:</p>
                
                ${this.courses.length === 0 
                    ? html`<p>Nenhum curso encontrado no banco de dados.</p>` 
                    : this.courses.map(course => html`
                        <div class="course-card">
                            <strong>${course.title}</strong>
                            <p>${course.description || 'Sem descrição.'}</p>
                            
                            ${course.lessons && course.lessons.length > 0 ? html`
                                <div>
                                    ${course.lessons.map(lesson => html`
                                        <div class="lesson-item">• ${lesson.title}</div>
                                    `)}
                                </div>
                            ` : ''}
                        </div>
                    `)
                }
            </div>
        `;
    }
}

customElements.define('education-application', EducationApplication);
