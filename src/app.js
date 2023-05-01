import localforage from 'localforage';
import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';

const maxSignOfNotes = 4;
const maxTaskLength = 80;

const dbGetItem = (key) => localforage.getItem(key)
  .catch((error) => {
    throw new Error(error);
  });

const dbSetItem = (key, value) => localforage.setItem(key, value)
  .catch((error) => {
    throw new Error(error);
  });

const dbGetKeys = async () => localforage.keys()
  .catch((error) => {
    throw new Error(error);
  });

const dbRemoveItem = (key) => localforage.removeItem(key)
  .catch((error) => {
    throw new Error(error);
  });

const dbGetElements = async () => {
  try {
    const keys = await dbGetKeys();
    const notes = keys.map(async (key) => {
      const note = await dbGetItem(key);
      return note;
    });
    return (await Promise.all(notes));
  } catch (error) {
    throw new Error(error);
  }
};

const addId = async () => {
  const keys = await dbGetKeys();
  if (keys.length) {
    return (Number(keys[keys.length - 1]) + 1);
  }
  return 0;
};

const addDbId = (id) => {
  let stringId = id.toString();
  while (stringId.length < maxSignOfNotes) {
    stringId = `0${stringId}`;
  }
  return stringId;
};

const switchTask = async (id) => {
  const task = await dbGetItem(addDbId(id));
  await dbRemoveItem(addDbId(id));
  const completedTask = {
    content: task.content,
    completed: !task.completed,
    id,
  };
  await dbSetItem(addDbId(id), completedTask);
};

const initialize = async () => {
  const tasks = await dbGetElements();
  if (tasks.length) {
    const completedTask = tasks.filter((task) => task.completed).length;
    return {
      taskCount: tasks.length,
      completedTask,
      status: 'init',
      error: null,
    };
  }
  return {
    taskCount: 0,
    completedTask: 0,
    status: 'init',
    error: null,
  };
};

const validate = (taskContent) => {
  const schema = yup.string('unvalid').max(maxTaskLength, 'unvalid');
  return schema.validate(taskContent);
};

export default async () => {
  const initialUiState = await initialize();
  const elements = {
    taskForm: document.querySelector('form'),
    tasks: document.querySelector('#tasks'),
    inputURL: document.querySelector('#task-input'),
    tasksCount: document.querySelector('#tasksCount'),
    completedTasks: document.querySelector('#completedTasks'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(initialUiState, async () => {
    const tasks = await dbGetElements();
    render(watchedState, tasks, elements);
  });

  const tasks = await dbGetElements();
  render(watchedState, tasks, elements);

  elements.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get('task');
    validate(content)
      .then(async () => {
        const id = await addId();
        const newTask = {
          content,
          completed: false,
          id,
        };
        await dbSetItem(addDbId(id), newTask);
        watchedState.taskCount += 1;
        watchedState.status = 'added';
        elements.taskForm.elements.task.value = '';
        elements.taskForm.elements.task.focus();
      })
      .catch((error) => {
        watchedState.status = 'failed';
        console.log(error.message);
        switch (error.message) {
          case 'unvalid':
            watchedState.error = 'unvalid';
            break;
          default:
            watchedState.error = 'unknownError';
        }
      });
  });

  elements.tasks.addEventListener('click', async (e) => {
    e.preventDefault();
    const id = Number(e.target.getAttribute('data-id'));
    const task = await dbGetItem(addDbId(id));
    if (e.target.className.includes('btn-close')) {
      await dbRemoveItem(addDbId(id));
      watchedState.status = 'deleted';
      watchedState.taskCount -= 1;
      if (task.completed) {
        watchedState.completedTask -= 1;
      }
      return;
    }
    await switchTask(id);
    watchedState.status = 'completed';
    if (!task.completed) {
      watchedState.completedTask += 1;
    } else {
      watchedState.completedTask -= 1;
    }
  });
};
