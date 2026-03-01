// Global variable to store projects
let allProjects = [];

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Load Skills Section ---
    fetch("data/skills.json")
        .then(response => response.json())
        .then(skills => {
            const container = document.getElementById("skills-container");
            if (!container) return;
            skills.forEach(skill => {
                const skillItem = `
                    <div class="col-md-3">
                        <div class="skill-item animate-zoom-in">
                            <h3>${skill.category}</h3>
                            <p>${skill.items.join(", ")}</p>
                        </div>
                    </div>
                `;
                container.innerHTML += skillItem;
            });
        })
        .catch(error => console.error("Error loading skills:", error));

    // --- 2. Load Projects Section ---
    fetch("data/projects.json")
        .then(response => response.json())
        .then(projects => {
            allProjects = projects;      // Store data globally
            renderProjects('all');       // Show all projects on initial load
        })
        .catch(error => console.error("Error loading projects:", error));

    // --- 3. Navbar Scroll Behavior ---
    const navbar = document.querySelector(".navbar");
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (navbar) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.classList.add("hidden");
            } else {
                navbar.classList.remove("hidden");
            }
        }
        lastScroll = currentScroll;
    });
});

// --- 4. Filter Logic ---
window.filterProjects = function(category, btnElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    renderProjects(category);
};

// --- 5. Render Logic ---
function renderProjects(category) {
    const container = document.getElementById("project-container");
    if (!container) return;
    
    container.innerHTML = ""; 

    const filteredProjects = category === 'all' 
        ? allProjects 
        : allProjects.filter(project => project.category === category);

    filteredProjects.forEach(project => {
        const description = project.description || "";
        const needsReadMore = description.split(" ").length > 20;

        // --- MEDIA LOGIC (IMAGE VS VIDEO) ---
        const mediaHTML = project.video 
            ? `<video autoplay loop muted playsinline class="project-media">
                <source src="${project.video}" type="video/mp4">
               </video>`
            : `<img src="${project.image}" alt="${project.title}" class="project-media">`;

        // --- BUTTON LOGIC ---
        let primaryBtn;
        if (project.category === 'ml') {
            primaryBtn = `
                <a href="${project.link}" target="_blank" class="btn btn-primary btn-sm">
                    <i class="fab fa-github"></i> Code
                </a>`;
        } else {
            // FIXED: If video exists, viewMedia will open the video. If not, it opens the image.
            const mediaTarget = project.video ? project.video : project.image;
            primaryBtn = `
                <button class="btn btn-primary btn-sm" onclick="viewMedia('${mediaTarget}')">
                    <i class="fas fa-eye"></i> View
                </button>`;
        }

        const liveBtn = project.live_url 
            ? `<button class="btn btn-outline-primary btn-sm ms-2" onclick="openProject('${project.live_url}')">
                <i class="fas fa-play"></i> Run Live
               </button>` 
            : '';

        const badgeNames = { 'ml': 'AI & ML', '3d': '3D Modeling', 'design': 'Design' };
        const badgeText = badgeNames[project.category] || 'Project';

        const projectCard = `
            <div class="col-md-4 mb-4">
                <div class="project-card animate-zoom-in">
                    <span class="category-badge">${badgeText}</span>
                    <div class="img-wrapper">
                        ${mediaHTML}
                    </div>
                    <div class="card-body">
                        <h5>${project.title}</h5>
                        <p class="description" data-full-text="${description}">${description}</p>
                        ${needsReadMore ? '<a href="#" class="read-more">Read More</a>' : ''}
                        <div class="mt-3">
                            ${primaryBtn}
                            ${liveBtn}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += projectCard;
    });

    attachReadMoreListeners();
}

// --- 6. Read More Helper ---
function attachReadMoreListeners() {
    document.querySelectorAll(".read-more").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const description = link.previousElementSibling;
            const fullText = description.getAttribute("data-full-text");
            
            if (description.classList.contains("expanded")) {
                description.textContent = fullText.split(" ").slice(0, 20).join(" ") + "...";
                description.classList.remove("expanded");
                link.textContent = "Read More";
            } else {
                description.textContent = fullText;
                description.classList.add("expanded");
                link.textContent = "Read Less";
            }
        });
    });
}

// --- 7. View Media Helper (Renamed from viewImage) ---
window.viewMedia = function(mediaPath) {
    window.open(mediaPath, '_blank');
};

// --- 8. Overlay Logic ---
window.openProject = function(url) {
    const overlay = document.getElementById('projectOverlay');
    const frame = document.getElementById('projectFrame');
    const spinner = document.getElementById('loading-spinner');

    if(overlay && frame) {
        overlay.style.display = 'block';
        if(spinner) spinner.style.display = 'block';
        frame.style.display = 'none';
        frame.src = url;
        document.body.style.overflow = 'hidden';
        
        frame.onload = () => {
            if(spinner) spinner.style.display = 'none';
            frame.style.display = 'block';
        };
    }
};

window.closeProject = function() {
    const overlay = document.getElementById('projectOverlay');
    const frame = document.getElementById('projectFrame');
    if(overlay && frame) {
        overlay.style.display = 'none';
        frame.src = ""; 
        document.body.style.overflow = 'auto';
    }
};

// --- 9. Smooth Scroll ---
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if(section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
};
