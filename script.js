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
                const description = project.description;
                const needsReadMore = description.split(" ").length > 20; // Arbitrary threshold for "long" text
                const projectCard = `
                    <div class="col-md-4">
                        <div class="project-card">
                            <img src="${project.image}" alt="${project.title}">
                            <div class="card-body">
                                <h5>${project.title}</h5>
                                <p class="description" data-full-text="${description}">${description}</p>
                                ${needsReadMore ? '<a href="#" class="read-more">Read More</a>' : ''}
                                <a href="${project.link}" target="_blank" class="btn">View Project</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += projectCard;
            });

            // Add Read More Functionality
            document.querySelectorAll(".read-more").forEach(link => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const description = link.previousElementSibling;
                    const fullText = description.getAttribute("data-full-text");
                    if (description.classList.contains("expanded")) {
                        description.textContent = fullText;
                        description.classList.remove("expanded");
                        link.textContent = "Read More";
                    } else {
                        description.textContent = fullText;
                        description.classList.add("expanded");
                        link.textContent = "Read Less";
                    }
                });
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
