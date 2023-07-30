import { Task, addTaskToInbox, renderTasks, createTaskElement, removeTask, filterTodayTasks, filterCurrentWeekTasks } from './task.js';
import { myProjects, newProjects, activeProject, tasks } from '../index.js'; // Adjust the path based on the folder structure

export class Project {
    constructor(name) {
      this.name = name;
      this.tasks = [];
    }
  
    addTask(task) {
      this.tasks.push(task);
    }
  
    getTasks() {
      return this.tasks;
    }
  
    removeTask(taskName) {
      this.tasks = this.tasks.filter(task => task.getName() !== taskName);
    }
  }

  function showProjectTasks(project) {
    renderProjectPage(project);
  }

// Event listener to open the project form modal when the "Add Project" button is clicked
const addProjectButton = document.querySelector(".addProject");
const addProjectModal = document.getElementById("addProjectModal");
const closeProjectModalButton = document.getElementById("closeProjectModal");
const addProjectForm = document.getElementById("addProjectForm");


function saveNewProjectsToLocalStorage() {
  const projectsData = newProjects.map(project => {
    return {
      name: project.name,
      tasks: project.getTasks()
    };
  });

  localStorage.setItem('newProjects', JSON.stringify(projectsData));
}

// Call this function whenever you add or remove projects
function updateNewProjectsLocalStorage() {
  saveNewProjectsToLocalStorage();
}


// Function to load newProjects data from local storage
function loadNewProjectsFromLocalStorage() {
  const data = localStorage.getItem('newProjects');
  const projectsData = JSON.parse(data);

  if (Array.isArray(projectsData)) {
    // Convert plain objects back to Project instances
    newProjects = projectsData.map(projectData => {
      const project = new Project(projectData.name);
      project.tasks = projectData.tasks.map(taskData => new Task(taskData.name, taskData.description, taskData.dueDate));
      return project;
    });
  } else {
    newProjects = [];
  }
}


// Load newProjects data from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadNewProjectsFromLocalStorage();
  renderProjectTabs();
  if (activeProject) {
    showProjectTasks(activeProject);
  } else {
    renderTasks();
  }
});

window.addEventListener('beforeunload', function() {
  saveNewProjectsToLocalStorage();
});


//FUNCTION TO SHOW PROJECTS IN THE SIDE BAR TAB
export function renderProjectTabs() {
const newProjectsContainer = document.querySelector(".newProjects");
newProjectsContainer.innerHTML = "";

newProjects.forEach(project => {
    const projectTab = document.createElement("div");
    projectTab.classList.add("project-tab");
    newProjectsContainer.appendChild(projectTab);

    // Create a span to display the project name
    const projectNameSpan = document.createElement("span");
    projectNameSpan.textContent = project.name;
    projectTab.appendChild(projectNameSpan);

    // Create the remove button
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&#10006;"; // Use '✖' symbol for the remove button
    removeBtn.classList.add("remove-project-btn");
    removeBtn.style.display = "none"; // Hide the remove button initially
    projectTab.appendChild(removeBtn);

    projectTab.addEventListener("mouseover", () => {
    removeBtn.style.display = "inline-block";
    });

    projectTab.addEventListener("mouseout", () => {
    removeBtn.style.display = "none";
    });

    projectTab.addEventListener("click", () => {
    activeProject = project;
    showProjectTasks(project);
    });

    removeBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent clicking on the remove button from triggering the project tab click
    removeProject(project);
    });
});
}
  
//REMOVE PROJECT FROM TAB
export function removeProject(project) {
  newProjects = newProjects.filter(p => p !== project);
  if (activeProject === project) {
    activeProject = null;
  }
  renderProjectTabs();
  if (activeProject) {
    renderProjectPage(activeProject);
  } else {
    renderTasks();
  }

  updateNewProjectsLocalStorage(); // Save the updated newProjects data to local storage
}

//ADD TASK TO PROJECT
export function addTaskToProject(newTask, project) {
  project.addTask(newTask);
  updateNewProjectsLocalStorage(); // Save the updated newProjects data to local storage
  renderProjectPage(project);
}

//DISPLAYING PROJECT PAGE
export function renderProjectPage(project) {
  document.getElementById("project-name").innerText = project.name;
  tasks.innerHTML = "";

  // Render the tasks for the selected project with the project reference
  project.getTasks().forEach(task => {
    const taskElement = createTaskElement(task, project); // Pass the project reference
    tasks.appendChild(taskElement);
  });
}

// Event listener to open the project form modal when the "Add Project" button is clicked
addProjectButton.addEventListener("click", function() {
  addProjectModal.classList.add("visible"); // Show the modal
});

// Event listener to close the project form modal when the close button is clicked
closeProjectModalButton.addEventListener("click", function() {
  addProjectModal.classList.remove("visible"); // Hide the modal
  addProjectForm.reset(); // Clear the form after closing
});

addProjectForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const projectName = document.getElementById("newProjectName").value;    
    const newProject = new Project(projectName);
    newProjects.push(newProject);
    renderProjectTabs();
    addProjectModal.classList.remove("visible"); // Hide the modal after form submission
    addProjectForm.reset(); // Clear the form after submitting 


    updateNewProjectsLocalStorage(); // Save the updated newProjects data to local storage
});

