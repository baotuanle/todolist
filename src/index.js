import { Project, showProjectTasks, renderProjectTabs, removeProject, addTaskToProject, renderProjectPage } from './modules/project.js';
import { Task, addTaskToInbox, renderTasks, createTaskElement, removeTask, filterTodayTasks, filterCurrentWeekTasks } from './modules/task.js';

export const tasks = document.querySelector(".task-container");
let myProjects = [];
let newProjects = [];
let activeProject = null; // Initialize activeProject as null since no project is selected initially

export { myProjects, newProjects, activeProject };



//button for projects tab to make cool effect
const collapseBtn = document.getElementById("collapse-btn");
const content = document.querySelector(".content");


let isCollapsed = true;

collapseBtn.addEventListener("click", function() {
    if (isCollapsed) {
        // Expand the content
        content.style.maxHeight = content.scrollHeight + "px";
        isCollapsed = false;
    } else {
        // Collapse the content
        content.style.maxHeight = 0;
        isCollapsed = true;
    }
});
