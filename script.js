document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Load Skills Section ---
    fetch("data/skills.json")
        .then(response => response.json())
        .then(skills => {
            const container = document.getElementById("skills-container");
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
       // Global variable to store all projects so we don't have to fetch them multiple times
let allProjects = []; 

document.addEventListener("DOMContentLoaded", () => {
    // ... (Keep your existing Step 1: Skills Fetch code here) ...

    // --- 2. Load Projects Section (NEW) ---
    fetch("data/projects.json")
        .then(response => response.json())
        .then(projects => {
            allProjects = projects;      // Store data globally
            renderProjects('all');       // Show all projects on initial load
        })
        .catch(error => console.error("Error loading projects:", error));

    // ... (Keep your existing Step 3: Navbar Scroll Behavior here) ...
});

// --- Filter Logic ---
window.filterProjects = function(category, btnElement) {
    // 1. Remove 'active' class from all buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 2. Add 'active' class to the clicked button
    btnElement.classList.add('active');

    // 3. Render the newly filtered list
    renderProjects(category);
}

// --- Render Logic ---
function renderProjects(category) {
    const container = document.getElementById("project-container");
    container.innerHTML = ""; // Clear the container first

    // Filter the array based on the category passed in
    const filteredProjects = category === 'all' 
        ? allProjects 
        : allProjects.filter(project => project.category === category);

    // Build the HTML for each filtered card
    filteredProjects.forEach(project => {
        const description = project.description;
        const needsReadMore = description.split(" ").length > 20;

        // Only show 'Run Live' if a live_url exists
        const liveBtn = project.live_url 
            ? `<button class="btn btn-outline-primary btn-sm ms-2" onclick="openProject('${project.live_url}')">
                <i class="fas fa-play"></i> Run Live
               </button>` 
            : '';

        // Map the JSON category to a nice display name for the badge
        const badgeNames = { 'ml': 'AI & ML', '3d': '3D Modeling', 'design': 'Design' };
        const badgeText = badgeNames[project.category] || 'Project';

        const projectCard = `
            <div class="col-md-4">
                <div class="project-card">
                    <span class="category-badge">${badgeText}</span>
                    <div class="img-wrapper">
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    
                    <div class="card-body">
                        <h5>${project.title}</h5>
                        <p class="description" data-full-text="${description}">${description}</p>
                        ${needsReadMore ? '<a href="#" class="read-more">Read More</a>' : ''}
                        <div class="mt-3">
                            <a href="${project.link}" target="_blank" class="btn btn-primary btn-sm">
                                <i class="fab fa-github"></i> Code
                            </a>
                            ${liveBtn}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += projectCard;
    });

    // Re-attach the Read More listeners because we just generated new HTML
    attachReadMoreListeners();
}

    // --- 3. Navbar Scroll Behavior ---
    const navbar = document.querySelector(".navbar");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        
        // Hide/Show Navbar
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
        }
        lastScroll = currentScroll;

        // Active Link Highlight
        const navLinks = document.querySelectorAll(".nav-link");
        const sections = document.querySelectorAll("section");
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (currentScroll >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === current) {
                link.classList.add("active");
            }
        });
    });
});

// --- 4. Read More Logic Helper ---
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

// --- 5. Global Functions for Live Overlay ---
function openProject(url) {
    const overlay = document.getElementById('projectOverlay');
    const frame = document.getElementById('projectFrame');
    const spinner = document.getElementById('loading-spinner');

    // Show overlay and spinner
    overlay.style.display = 'block';
    spinner.style.display = 'block';
    frame.style.display = 'none'; // Hide iframe until it loads

    // Set source
    frame.src = url;

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeProject() {
    const overlay = document.getElementById('projectOverlay');
    const frame = document.getElementById('projectFrame');

    overlay.style.display = 'none';
    frame.src = ""; // Kill the process
    
    // Restore scrolling
    document.body.style.overflow = 'auto';
}

// --- 6. Smooth Scroll Helper ---
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if(section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

