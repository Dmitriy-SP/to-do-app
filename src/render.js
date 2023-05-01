const buildTask = (task) => {
  const taskElement = document.createElement('li');
  taskElement.className = 'list-group-item d-flex justify-content-between align-items-start border mb-1';
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

const blocked = (elements, tinymce) => {
  tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
  elements.notes.childNodes.forEach((note) => note.setAttribute('disabled', true));
};

const unlocked = (elements, tinymce) => {
  tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
  elements.notes.childNodes.forEach((note) => note.removeAttribute('disabled'));
};

const render = (state, tasks, elements) => {
  renderTasks(tasks, elements);
  /*
  switch (state.status) {
    case 'init':
    case 'addedNote':
    case 'deleteCurrentNote':
    case 'focusOnNewNote':
    case 'changedNote':
      renderNote(state.activeNoteId, notes, tinymce);
      renderNotes(state.activeNoteId, notes, elements);
      break;
    case 'deleteNote':
      renderNotes(state.activeNoteId, notes, elements);
      break;
    case 'deleting':
      blocked(elements, tinymce);
      break;
    case 'deleted':
      unlocked(elements, tinymce);
      break;
    default:
  }
  */
};

export default render;
