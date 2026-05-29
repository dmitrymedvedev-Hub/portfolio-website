const apiBaseUrl = window.PORTFOLIO_API_BASE_URL || 'http://localhost:5000/api';

const projectsGrid = document.getElementById('projects-grid');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const yearElement = document.getElementById('year');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

const fallbackProjects = [
    {
        title: 'E-Commerce Platform',
        description: 'A responsive shop experience with a clean checkout flow and admin-ready structure.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
        demoLink: '#',
        sourceLink: '#',
    },
    {
        title: 'Portfolio Dashboard',
        description: 'A dashboard concept for managing projects, messages, and profile content in one place.',
        imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900',
        demoLink: '#',
        sourceLink: '#',
    },
    {
        title: 'Booking Website',
        description: 'A simple booking flow with a strong visual hierarchy and clear call-to-action support.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=900',
        demoLink: '#',
        sourceLink: '#',
    },
];

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function safeExternalUrl(value) {
    const candidate = String(value || '').trim();

    if (!candidate) {
        return '#';
    }

    if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
        return candidate;
    }

    return '#';
}

function renderProjects(projects) {
    if (!projectsGrid) {
        return;
    }

    if (!projects.length) {
        projectsGrid.innerHTML = `
            <div class="content-card md:col-span-2 lg:col-span-3 text-center text-slate-600">
                No projects have been added yet.
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = projects.map((project) => {
        const p = project || {};
        const image = escapeHtml(p.imageUrl || p.image_url || fallbackProjects[0].imageUrl);
        const title = escapeHtml(p.title || 'Untitled Project');
        const desc = escapeHtml(p.description || p.desc || 'Project description not provided yet.');
        const demo = escapeHtml(safeExternalUrl(p.demoLink || p.demo_link || '#'));
        const source = escapeHtml(safeExternalUrl(p.sourceLink || p.source_link || '#'));

        // encode full project data so project.html can render details
        const dataParam = encodeURIComponent(JSON.stringify({ title: p.title, description: p.description, demoLink: p.demoLink || p.demo_link, sourceLink: p.sourceLink || p.source_link, imageUrl: p.imageUrl || p.image_url }));

        return `
        <article class="project-card">
            <div class="h-52 overflow-hidden bg-slate-100">
                <img src="${image}"
                    alt="${title}"
                    class="project-image h-full w-full object-cover">
            </div>
            <div class="project-body">
                <h3 class="text-xl font-extrabold tracking-tight">${title}</h3>
                <p class="mt-2 text-sm leading-7 text-slate-600">${desc}</p>
                <div class="project-links">
                    <a class="project-link" href="${demo}" target="_blank" rel="noreferrer">
                        <i data-lucide="external-link"></i> Demo
                    </a>
                    <a class="project-link secondary" href="${source}" target="_blank" rel="noreferrer">
                        <i data-lucide="github"></i> Source
                    </a>
                    <a class="project-link" href="project.html?data=${dataParam}" title="View details">
                        <i data-lucide="eye"></i> Details
                    </a>
                </div>
            </div>
        </article>
    `;
    }).join('');

    lucide.createIcons();
}

async function loadProjects() {
    if (!projectsGrid) {
        return;
    }

    projectsGrid.innerHTML = `
        <div class="content-card md:col-span-2 lg:col-span-3 text-center text-slate-500">
            Loading projects from the backend...
        </div>
    `;

    try {
        const response = await fetch(`${apiBaseUrl}/portfolio/projects`);

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error('Failed to load projects: ' + (text || response.statusText));
        }

        const payload = await response.json();
        renderProjects(payload.data || []);
    } catch (error) {
        projectsGrid.innerHTML = `
            <div class="content-card md:col-span-2 lg:col-span-3 text-center text-rose-600">
                Unable to load projects from backend — showing demo projects instead.
            </div>
        `;
        console.error('Projects load error:', error);
        // show fallback after a brief delay for better UX
        setTimeout(() => renderProjects(fallbackProjects), 350);
    }
}

function setupNavigation() {
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.add('hidden');
        });
    });
}

function setupContactForm() {
    if (!contactForm || !formStatus) {
        return;
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'text-sm font-medium text-slate-500';

        try {
            const response = await fetch(`${apiBaseUrl}/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            contactForm.reset();
            formStatus.textContent = data.message || 'Message sent successfully.';
            formStatus.className = 'text-sm font-medium text-emerald-600';
        } catch (error) {
            formStatus.textContent = error.message || 'Unable to send message right now.';
            formStatus.className = 'text-sm font-medium text-rose-600';
        }
    });
}

function initializePage() {
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    setupNavigation();
    setupContactForm();
    loadProjects();
    lucide.createIcons();
}

initializePage();