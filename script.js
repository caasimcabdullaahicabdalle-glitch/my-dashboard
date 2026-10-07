const defaultProjects = [
  {
    id: 1,
    name: "Personal Website",
    description: "Website-ka portfolio-ga iyo xogtayda shaqsiyeed.",
    category: "Website",
    status: "Completed",
    image: ""
  },
  {
    id: 2,
    name: "Python Calculator",
    description: "Calculator aan ku sameeyay Python si aan u barto programming.",
    category: "Python",
    status: "In Progress",
    image: ""
  },
  {
    id: 3,
    name: "Dashboard UI",
    description: "Dashboard casri ah oo leh filters iyo maamulka xogta.",
    category: "Design",
    status: "Idea",
    image: ""
  }
];

const defaultSkills = [
  { id: 1, name: "Python", level: 75 },
  { id: 2, name: "HTML", level: 90 },
  { id: 3, name: "CSS", level: 80 },
  { id: 4, name: "JavaScript", level: 65 }
];

const defaultProfile = {
  name: "Cumar",
  about: "Waxaan baranayaa programming iyo website development.",
  email: "",
  phone: "",
  website: ""
};

let projects =
  JSON.parse(localStorage.getItem("cumar_projects")) ||
  defaultProjects;

let skills =
  JSON.parse(localStorage.getItem("cumar_skills")) ||
  defaultSkills;

let profile =
  JSON.parse(localStorage.getItem("cumar_profile")) ||
  defaultProfile;

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function save() {
  localStorage.setItem("cumar_projects", JSON.stringify(projects));
  localStorage.setItem("cumar_skills", JSON.stringify(skills));
  localStorage.setItem("cumar_profile", JSON.stringify(profile));

  renderAll();
}

function toast(message) {
  const t = $("#toast");

  t.textContent = message;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

function section(name) {
  $$(".section").forEach(x => {
    x.classList.remove("active");
  });

  $(#${name}).classList.add("active");

  $$(".nav-btn[data-section]").forEach(x => {
    x.classList.toggle(
      "active",
      x.dataset.section === name
    );
  });

  $("#pageTitle").textContent =
    name[0].toUpperCase() + name.slice(1);

  if (innerWidth < 701) {
    $("#sidebar").classList.remove("open");
  }
}

$$(".nav-btn[data-section]").forEach(button => {
  button.onclick = () => {
    section(button.dataset.section);
  };
});

$$("[data-section-jump]").forEach(button => {
  button.onclick = () => {
    section(button.dataset.sectionJump);
  };
});

$("#menuBtn").onclick = () => {
  $("#sidebar").classList.toggle("open");
};

$("#themeBtn").onclick = () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "cumar_dark",
    document.body.classList.contains("dark")
  );
};

if (localStorage.getItem("cumar_dark") === "true") {
  document.body.classList.add("dark");
}

function projectImage(project) {
  if (!project.image) {
    return "";
  }

  return `style="background-image:url('${project.image.replaceAll(
    "'",
    ""
  )}')"`;
}

function renderProjects() {
  const search =
    (
      $("#projectSearch")?.value ||
      $("#globalSearch")?.value ||
      ""
    ).toLowerCase();

  const category =
    $("#categoryFilter")?.value || "all";

  const status =
    $("#statusFilter")?.value || "all";

  const list = projects.filter(project => {
    const text =
      project.name +
      project.description +
      project.category;

    return (
      text.toLowerCase().includes(search) &&
      (category === "all" ||
        project.category === category) &&
      (status === "all" ||
        project.status === status)
    );
  });

  $("#projectsGrid").innerHTML =
    list.map(project => `
      <article class="project-card">

        <div
          class="project-img"
          ${projectImage(project)}
        >
          🖥️
        </div>

        <div class="project-body">

          <h3>${esc(project.name)}</h3>

          <p>
            ${esc(project.description)}
          </p>

          <div class="tags">

            <span class="tag">
              ${esc(project.category)}
            </span>

            <span
              class="status ${
                project.status === "In Progress"
                  ? "progress"
                  : project.status === "Idea"
                  ? "idea"
                  : ""
              }"
            >
              ${esc(project.status)}
            </span>

          </div>

          <div class="card-actions">

            <button
              class="icon-btn"
              onclick="editProject(${project.id})"
            >
              ✏️ Edit
            </button>

            <button
              class="icon-btn"
              onclick="deleteProject(${project.id})"
            >
              🗑️ Delete
            </button>

          </div>

        </div>

      </article>
    `).join("") ||
    `
      <div class="panel">
        <h3>No projects found</h3>
        <p>Ku dar project cusub.</p>
      </div>
    `;
}

function renderSkills() {

  $("#skillsGrid").innerHTML =
    skills.map(skill => `
      <article class="skill-card">

        <h3>
          ${esc(skill.name)}
        </h3>

        <div class="level">
          ${skill.level}%
        </div>

        <div class="bar">
          <span
            style="width:${skill.level}%"
          ></span>
        </div>

        <div class="card-actions">

          <button
            class="icon-btn"
            onclick="editSkill(${skill.id})"
          >
            ✏️ Edit
          </button>

          <button
            class="icon-btn"
            onclick="deleteSkill(${skill.id})"
          >
            🗑️ Delete
          </button>

        </div>

      </article>
    `).join("");

  $("#dashboardSkills").innerHTML =
    skills.slice(0, 5).map(skill => `
      <div class="skill-row">

        <div class="skill-top">

          <span>
            ${esc(skill.name)}
          </span>

          <strong>
            ${skill.level}%
          </strong>

        </div>

        <div class="bar">
          <span
            style="width:${skill.level}%"
          ></span>
        </div>

      </div>
    `).join("");
}

function renderDashboard() {

  $("#projectCount").textContent =
    projects.length;

  $("#skillCount").textContent =
    skills.length;

  $("#completedCount").textContent =
    projects.filter(
      project => project.status === "Completed"
    ).length;

  const progress = projects.length
    ? Math.round(
        projects.reduce(
          (total, project) =>
            total +
            (
              project.status === "Completed"
                ? 100
                : project.status === "In Progress"
                ? 50
                : 10
            ),
          0
        ) / projects.length
      )
    : 0;

  $("#progressCount").textContent =
    progress + "%";

  $("#recentProjects").innerHTML =
    projects
      .slice(-4)
      .reverse()
      .map(project => `
        <div class="mini">

          <div class="mini-img">
            🖥️
          </div>

          <div>

            <strong>
              ${esc(project.name)}
            </strong>

            <small>
              ${esc(project.category)}
              ·
              ${esc(project.status)}
            </small>

          </div>

        </div>
      `)
      .join("");
}

function renderProfile() {

  $("#profileName").value =
    profile.name;

  $("#profileAbout").value =
    profile.about;

  $("#profileEmail").value =
    profile.email;

  $("#profilePhone").value =
    profile.phone;

  $("#profileWebsite").value =
    profile.website;
}

function renderAll() {
  renderProjects();
  renderSkills();
  renderDashboard();
  renderProfile();
}

function esc(value) {
  return String(value).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character])
  );
}

function openModal(id) {
  $(id).classList.add("open");
}

function closeModal(id) {
  $(id).classList.remove("open");
}

$$("[data-close]").forEach(button => {
  button.onclick = () => {
    closeModal(
      "#" + button.dataset.close
    );
  };
});

$("#addProjectBtn").onclick = () => {

  $("#projectForm").reset();

  $("#projectId").value = "";

  $("#projectModalTitle").textContent =
    "Add Project";

  openModal("#projectModal");
};

$("#projectForm").onsubmit = event => {

  event.preventDefault();

  const id = $("#projectId").value;

  const project = {
    id: id
      ? Number(id)
      : Date.now(),

    name:
      $("#projectName").value.trim(),

    description:
      $("#projectDescription").value.trim(),

    category:
      $("#projectCategory").value,

    status:
      $("#projectStatus").value,

    image:
      $("#projectImage").value.trim()
  };

  if (id) {

    projects = projects.map(p =>
      p.id === Number(id)
        ? project
        : p
    );

  } else {

    projects.push(project);

  }

  save();

  closeModal("#projectModal");

  toast("Project waa la keydiyay ✅");
};

window.editProject = id => {

  const project =
    projects.find(p => p.id === id);

  $("#projectId").value =
    project.id;

  $("#projectName").value =
    project.name;

  $("#projectDescription").value =
    project.description;

  $("#projectCategory").value =
    project.category;

  $("#projectStatus").value =
    project.status;

  $("#projectImage").value =
    project.image || "";

  $("#projectModalTitle").textContent =
    "Edit Project";

  openModal("#projectModal");
};

window.deleteProject = id => {

  if (
    confirm(
      "Ma hubtaa inaad tirtirayso project-kan?"
    )
  ) {

    projects =
      projects.filter(
        project => project.id !== id
      );

    save();

    toast(
      "Project waa la tirtiray 🗑️"
    );
  }
};

$("#addSkillBtn").onclick = () => {

  $("#skillForm").reset();

  $("#skillId").value = "";

  $("#skillLevel").value = 70;

  $("#levelValue").textContent = 70;

  $("#skillModalTitle").textContent =
    "Add Skill";

  openModal("#skillModal");
};

$("#skillLevel").oninput = event => {

  $("#levelValue").textContent =
    event.target.value;
};

$("#skillForm").onsubmit = event => {

  event.preventDefault();

  const id = $("#skillId").value;

  const skill = {
    id: id
      ? Number(id)
      : Date.now(),

    name:
      $("#skillName").value.trim(),

    level:
      Number($("#skillLevel").value)
  };

  if (id) {

    skills = skills.map(s =>
      s.id === Number(id)
        ? skill
        : s
    );

  } else {

    skills.push(skill);

  }

  save();

  closeModal("#skillModal");

  toast("Skill waa la keydiyay ✅");
};

window.editSkill = id => {

  const skill =
    skills.find(s => s.id === id);

  $("#skillId").value =
    skill.id;

  $("#skillName").value =
    skill.name;

  $("#skillLevel").value =
    skill.level;

  $("#levelValue").textContent =
    skill.level;

  $("#skillModalTitle").textContent =
    "Edit Skill";

  openModal("#skillModal");
};

window.deleteSkill = id => {

  if (
    confirm(
      "Ma hubtaa inaad tirtirayso skill-kan?"
    )
  ) {

    skills =
      skills.filter(
        skill => skill.id !== id
      );

    save();

    toast(
      "Skill waa la tirtiray 🗑️"
    );
  }
};

$("#saveProfileBtn").onclick = () => {

  profile = {

    name:
      $("#profileName").value.trim(),

    about:
      $("#profileAbout").value.trim(),

    email:
      $("#profileEmail").value.trim(),

    phone:
      $("#profilePhone").value.trim(),

    website:
      $("#profileWebsite").value.trim()
  };

  save();

  toast(
    "Profile waa la keydiyay ✅"
  );
};

$("#projectSearch").oninput =
  renderProjects;

$("#categoryFilter").onchange =
  renderProjects;

$("#statusFilter").onchange =
  renderProjects;

$("#globalSearch").oninput = () => {

  section("projects");

  $("#projectSearch").value =
    $("#globalSearch").value;

  renderProjects();
};

$("#resetBtn").onclick = () => {

  if (
    confirm(
      "Tani waxay soo celinaysaa xogtii demo-ga. Sii wad?"
    )
  ) {

    projects =
      JSON.parse(
        JSON.stringify(defaultProjects)
      );

    skills =
      JSON.parse(
        JSON.stringify(defaultSkills)
      );

    profile =
      JSON.parse(
        JSON.stringify(defaultProfile)
      );

    save();

    toast(
      "Demo data waa la soo celiyay"
    );
  }
};

renderAll();
