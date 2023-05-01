import localforage from 'localforage';
import onChange from 'on-change';
import render from './render.js';

const maxSignOfNotes = 4;

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

const initialize = async () => {
  const tasks = await dbGetElements();
  if (tasks.length) {
    const completedTask = tasks.filter((task) => task.completed).length;
    return { taskCount: tasks.length, completedTask };
  }
  return { taskCount: 0, completedTask: 0 };
};

export default async () => {
  const initialUiState = await initialize();
  const elements = {
    taskForm: document.querySelector('form.task-form'),
    tasks: document.querySelector('#tasks'),
  };

  const watchedState = onChange(initialUiState, async () => {
    const notes = await dbGetElements();
    render(watchedState, notes, elements);
  });

  const tasks = await dbGetElements();
  render(watchedState, tasks, elements);

  elements.taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = await addId();
    const formData = new FormData(e.target);
    const content = formData.get('task');
    const newTask = {
      content,
      completed: false,
      id,
    };
    await dbSetItem(addDbId(id), newTask);
    watchedState.status = 'addedNote';
    elements.taskForm.elements.task.value = '';
  });
};
