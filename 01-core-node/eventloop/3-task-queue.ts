type Cb = () => any;
type Task = { time: number; callback: Cb };

const queue = new Map<Task, boolean>();
const isReadyTask = (task: Task) => Date.now() >= task.time;
const createTask = (callback: Cb, delay: number) => ({ callback, time: Date.now() + delay });
const setTask = (cb: Cb, delay: number) => queue.set(createTask(cb, delay), true);

/* Обработка тасок */
function runLoop(queue: Map<Task, boolean>) {
  let nextTaskTime: number = Infinity;
  queue.forEach((_, task) => {
    if (isReadyTask(task)) {
      task.callback();
      queue.delete(task);
      return;
    }
    /* Назначаем минимальное время до следующей задачи */
    if (task.time < nextTaskTime) nextTaskTime = task.time;
  });

  if (queue.size) {
    /* Считаем delay до следующей задачи и запускаем таймер */
    const delay = nextTaskTime - Date.now();
    setTimeout(() => runLoop(queue), Math.max(delay, 0));
  }
}

/* Назначаем таски */
setTask(() => console.log('Task 1 done'), 1000);
setTask(() => console.log('Task 2 done'), 0);
setTask(() => console.log('Task 3 done'), 100);

runLoop(queue);
