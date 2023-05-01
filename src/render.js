const buildTask = (task) => {
  const taskElement = document.createElement('li');
  taskElement.className = 'list-group-item d-flex justify-content-between align-items-start border mb-1';
  taskElement.className = task.completed ? `${taskElement.className} text-decoration-line-through` : `${taskElement.className}`;
  taskElement.setAttribute('type', 'button');
  taskElement.setAttribute('data-id', task.id);
  const taskContent = document.createElement('p');
  taskContent.className = 'mb-0';
  const div = document.createElement('div');
  div.innerHTML = task.content.trim();
  taskContent.textContent = div.textContent;
  taskContent.setAttribute('data-id', task.id);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.className = 'btn-close close';
  button.setAttribute('data-id', task.id);
  button.setAttribute('aria-label', 'Close');
  taskElement.appendChild(taskContent);
  taskElement.appendChild(button);
  return taskElement;
};

const renderTasks = (tasks, elements) => {
  if (tasks.length) {
    const fragment = document.createDocumentFragment();
    tasks.reverse().forEach((task) => fragment.appendChild(buildTask(task)));
    elements.tasks.innerHTML = '';
    elements.tasks.appendChild(fragment);
    return;
  }
  elements.tasks.innerHTML = '';
};

const renderCounts = (state, elements) => {
  elements.tasksCount.textContent = (state.taskCount === 1 || state.taskCount === 0) ? `You have ${state.taskCount} task` : `You have ${state.taskCount} tasks`;
  elements.completedTasks.textContent = (state.completedTask === 1 || state.completedTask === 0) ? `You completed ${state.completedTask} task` : `You completed ${state.completedTask} tasks`;
};

const render = (state, tasks, elements) => {
  if (state.status === 'failed') {
    switch (state.error) {
      case 'unvalid':
        elements.feedback.textContent = 'Your task must be shorter than 80 characters';
        elements.inputURL.classList.add('is-invalid');
        break;
      case null:
        return;
      default:
        throw new Error('error in state.error - unavaillable error');
    }
  } else {
    elements.feedback.textContent = '';
    elements.inputURL.classList.remove('is-invalid');
  }
  renderCounts(state, elements);
  renderTasks(tasks, elements);
};

export default render;
