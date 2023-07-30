import { Project, showProjectTasks, renderProjectTabs, removeProject, addTaskToProject, renderProjectPage } from './project.js';
import { myProjects, newProjects, activeProject, tasks, saveToLocalStorage } from '../index.js'; // Adjust the path based on the folder structure


export class Task {
    constructor(name, description = "", dueDate = null) {
      this.name = name
      this.dueDate = dueDate
      this.description = description
    }
  
    setName(name) {
      this.name = name
    }
  
    getName() {
      return this.name
    }
  
    setDescription(description) {
      this.description = description
    }
  
    getDescription() {
      return this.description
    }
  
    setDate(dueDate) {
      this.dueDate = dueDate
    }
  
    getDate() {
      return this.dueDate
    }
  
    getDateFormatted() {
        if (!this.dueDate || this.dueDate === "No date") {
          return "No date";
        }
      
        const parts = this.dueDate.split("-");
        if (parts.length !== 3) {
          return "Invalid date format";
        }
      
        const year = parts[0];
        const month = parts[1].padStart(2, "0");
        const day = parts[2].padStart(2, "0");
      
        return `${year}/${month}/${day}`;
      }
    
}

export const addTaskButton = document.querySelector(".addTask");
export const addTaskModal = document.getElementById("addTaskModal");
export const closeModalButton = document.getElementById("closeModal");
export const addTaskForm = document.getElementById("addTaskForm");


function loadMyProjectsFromLocalStorage() {
  const data = localStorage.getItem('myProjects');
  const tasksData = JSON.parse(data);

  if (Array.isArray(tasksData)) {
    myProjects = tasksData.map(taskData => new Task(taskData.name, taskData.description, taskData.dueDate));
  } else {
    myProjects = [];
  }
}


// Function to save Inbox tasks to local storage
function saveMyProjectsToLocalStorage() {
  const myProjectsData = myProjects.map(task => {
    return {
      name: task.getName(),
      description: task.getDescription(),
      dueDate: task.getDate()
    };
  });

  localStorage.setItem('myProjects', JSON.stringify(myProjectsData));
}

function updateMyProjectsLocalStorage() {
  saveMyProjectsToLocalStorage();
}

// Load myProjects data from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadMyProjectsFromLocalStorage();
  renderTasks();
});

// Save myProjects data to local storage before the page is unloaded (refreshed)
window.addEventListener('beforeunload', function() {
  updateMyProjectsLocalStorage();
});

export function addTaskToInbox(newTask) {
  myProjects.push(newTask);
  updateMyProjectsLocalStorage() // Save the updated myProjects data to local storage
  renderTasks();
}

// Function to display all tasks (Inbox)
export function renderTasks() {
    // Step 1: Set the project name to "Inbox"
    document.getElementById("project-name").innerText = "Inbox";
  
    // Step 2: Clear the task container first
    tasks.innerHTML = "";
  
    // Step 3: Create and append HTML elements for each task
    myProjects.forEach(task => {
      const taskElement = createTaskElement(task, myProjects);
      tasks.appendChild(taskElement);
    });
  }
  

// Helper function to create a task element
export function createTaskElement(task, project) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task", "task-card");
    taskElement.innerHTML = `
      <h2>${task.getName()}</h2>
      <p>Description: ${task.getDescription()}</p>
      <p>Due Date: ${task.getDateFormatted()}</p>
      <button class="remove-btn"></button>
    `;
  
    // Add event listener for the "Remove" button
    const removeBtn = taskElement.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => removeTask(task, project)); // Pass the task and project reference
  
    return taskElement;
  }
  

  //REMOVE TASK IN PROJECT
export function removeTask(task, project) {
  if (project === myProjects) {
    // Remove the task from the "Inbox"
    myProjects = myProjects.filter(t => t !== task);
  } else {
    // Remove the task from the project
    project.removeTask(task.getName());
  }

  // Re-render the tasks based on the current activeProject
  if (activeProject) {
    renderProjectPage(activeProject);
  } else {
    renderTasks();
  }
  updateMyProjectsLocalStorage();
}

// Function to display tasks due today
export function filterTodayTasks() {
  // Step 1: Set the project name to "Today"
  document.getElementById("project-name").innerText = "Today";

  // Step 2: Clear the task container first
  tasks.innerHTML = "";

  // Step 3: Get the current date in the format "YYYY-MM-DD"
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // Step 4: Filter tasks to show only the ones due today
  myProjects.forEach(task => {
    if (task.getDate() === formattedDate) {
      const taskElement = createTaskElement(task);
      tasks.appendChild(taskElement);
    }
  });
}

export function filterCurrentWeekTasks() {
    // Step 1: Set the project name to "This Week"
    document.getElementById("project-name").innerText = "This Week";

    // Step 2: Clear the task container first
    tasks.innerHTML = "";

    // Step 3: Get the start and end dates of the current week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start on Sunday
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // End on Saturday

    // Step 4: Filter tasks to show only the ones within the current week
    myProjects.forEach(task => {
        const taskDate = new Date(task.getDate());
        if (taskDate >= startOfWeek && taskDate <= endOfWeek) {
            const taskElement = createTaskElement(task);
            tasks.appendChild(taskElement);
        }
    });
}


const thisWeekButton = document.querySelector(".this-week");
thisWeekButton.addEventListener("click", function() {
    filterCurrentWeekTasks();
    activeProject = null; // Set activeProject to null when "Today" button is clicked
  });
  
// Event listener to handle "Today" button click
const todayButton = document.querySelector(".Today");
todayButton.addEventListener("click", function() {
  filterTodayTasks();
  activeProject = null; // Set activeProject to null when "Today" button is clicked
});

const inboxButton = document.querySelector(".inbox");
inboxButton.addEventListener("click", function() {
  renderTasks();
  activeProject = null; // Set activeProject to null when "Inbox" button is clicked
});

document.addEventListener("DOMContentLoaded", function() {
    renderTasks();
  });

// Event listener to open the modal when the "Add Task" button is clicked
addTaskButton.addEventListener("click", function() {
    addTaskModal.classList.add("visible"); // Show the modal
    addTaskModal.style.display = "block"; // Show the modal
});

// Event listener to close the modal when the close button is clicked
closeModalButton.addEventListener("click", function() {
  addTaskModal.style.display = "none"; // Hide the modal
});

// Event listener to close the modal when clicking outside the modal content
window.addEventListener("click", function(event) {
  if (event.target === addTaskModal) {
    addTaskModal.classList.remove("visible"); // Hide the modal
    addTaskModal.style.display = "none"; // Hide the modal
  }
});

// Event listener to handle form submission
addTaskForm.addEventListener("submit", function(event) {
event.preventDefault();
const name = document.getElementById("taskName").value;
const description = document.getElementById("taskDescription").value;
const dueDate = document.getElementById("taskDueDate").value;
const task = new Task(name, description, dueDate);
  if (activeProject) {
      activeProject.addTask(task); // Add the task to the active project
      renderProjectPage(activeProject);
  } else {
      addTaskToInbox(task); // Add the task to the inbox
  }

  if (!activeProject) {
      updateMyProjectsLocalStorage()
      renderTasks();
  }
  addTaskModal.style.display = "none"; // Hide the modal after form submission
  // Clear the form after submitting
  addTaskForm.reset();
});