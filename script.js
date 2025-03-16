document.addEventListener("DOMContentLoaded", () => {
    // Load Skills
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

    // Load Projects
    fetch("data/projects.json")
        .then(response => response.json())
        .then(projects => {
            const container = document.getElementById("project-container");
            projects.forEach(project => {
                const projectCard = `
                    <div class="col-md-4">
                        <div class="project-card">
                            <img src="${project.image}" alt="${project.title}">
                            <div class="card-body">
                                <h5>${project.title}</h5>
                                <p>${project.description}</p>
                                <a href="${project.link}" target="_blank">View Project</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += projectCard;
            });
        })
        .catch(error => console.error("Error loading projects:", error));

    // Navbar Scroll Behavior
    const navbar = document.querySelector(".navbar");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
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

// Smooth Scroll Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
}