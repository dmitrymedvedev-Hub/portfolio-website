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
            const desc = escapeHtml(p.description || p.desc || '');
            const hasDemo = Boolean(p.demoLink || p.demo_link);
            const hasSource = Boolean(p.sourceLink || p.source_link);

            // encode full project data so other pages can render details
            const dataParam = encodeURIComponent(JSON.stringify({ title: p.title, description: p.description, demoLink: p.demoLink || p.demo_link, sourceLink: p.sourceLink || p.source_link, imageUrl: p.imageUrl || p.image_url }));

            const demoPage = `demo.html?data=${dataParam}`;
            const sourcePage = `source.html?data=${dataParam}`;
            const detailsPage = `project.html?data=${dataParam}`;

            return `
            <article class="project-tile reveal">
                <div class="project-media">
                    <img src="${image}" alt="${title}">
                    <div class="project-media-badge">${hasDemo ? 'Live demo ready' : 'Preview only'}</div>
                </div>
                <div class="project-card-body">
                    <div class="project-card-topline">
                        <span class="project-card-kicker">Featured Project</span>
                        <span class="project-card-dot"></span>
                    </div>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <div class="project-meta-row">
                        <span class="project-meta-chip"><i data-lucide="sparkles"></i> Modern UI</span>
                        <span class="project-meta-chip"><i data-lucide="shield-check"></i> Responsive</span>
                    </div>
                    <div class="project-actions">
                        <a class="project-action-button project-action-primary" href="${detailsPage}"><i data-lucide="arrow-right"></i> Read more</a>
                        <a class="project-action-button" href="${demoPage}" ${hasDemo ? '' : 'aria-disabled="true" tabindex="-1"'}><i data-lucide="external-link"></i> Demo</a>
                        <a class="project-action-button" href="${sourcePage}" ${hasSource ? '' : 'aria-disabled="true" tabindex="-1"'}><i data-lucide="github"></i> Source</a>
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
        const menuIcon = '<i data-lucide="menu"></i>';
        const closeIcon = '<i data-lucide="x"></i>';
        const openMenu = () => {
            mobileMenu.classList.remove('hidden', 'is-closing');
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            mobileMenuButton.innerHTML = closeIcon;
            document.body.classList.add('menu-open');
            lucide.createIcons();
        };

        const closeMenu = () => {
            if (!mobileMenu.classList.contains('is-open')) {
                return;
            }

            mobileMenu.classList.remove('is-open');
            mobileMenu.classList.add('is-closing');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuButton.innerHTML = menuIcon;
            document.body.classList.remove('menu-open');
            lucide.createIcons();

            window.setTimeout(() => {
                if (!mobileMenu.classList.contains('is-open')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('is-closing');
                }
            }, 220);
        };

        mobileMenuButton.classList.add('nav-toggle-button');
        mobileMenuButton.innerHTML = menuIcon;

        mobileMenuButton.addEventListener('click', () => {
            if (mobileMenu.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) {
                closeMenu();
            }
        });

        const sidebarClose = mobileMenu.querySelector('.sidebar-close');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeMenu);
        }

        mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });
    }

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