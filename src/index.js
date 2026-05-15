import * as service from './services/taskService.js';
import { ValidationError } from './utils/validators.js';
import { colorStatus, colorPriority } from './utils/colors.js';

function printTasks(list) {
  for (const t of list) {
    const s = colorStatus(t.status);
    const p = colorPriority(t.priority);
    console.log(`- [${t.id}] ${t.title} (${s}, ${p}) created:${t.createdAt}`);
  }
}

async function main() {
  try {
    console.log('Creating tasks...');
    const a = service.createTask({ title: 'Buy milk', description: '2 liters', priority: 'high' });
    const b = service.createTask({ title: 'Write report', priority: 'medium' });
    const c = service.createTask({ title: 'Pay bills', priority: 'low', status: 'todo' });

    console.log('\nAll tasks (default sort by createdAt desc):');
    printTasks(service.listTasks());

    console.log('\nFilter: priority=high');
    printTasks(service.listTasks({ filter: { priority: 'high' } }));

    console.log('\nSort by priority asc:');
    printTasks(service.listTasks({ sort: 'priority', order: 'asc' }));

    console.log('\nUpdating a task status...');
    service.updateTask(a.id, { status: 'in-progress' });
    console.log('After update:');
    printTasks(service.listTasks());

    console.log('\nDeleting a task...');
    service.deleteTask(b.id);
    console.log('After delete:');
    printTasks(service.listTasks());

    console.log('\nDemonstrating error handling: attempt to delete non-existent id');
    try {
      service.deleteTask('no-such-id');
    } catch (err) {
      console.error('Expected error:', err.message);
    }

    console.log('\nDone.');
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error('Validation error:', err.message);
      process.exitCode = 2;
    } else if (err.name === 'NotFoundError') {
      console.error(err.message);
      process.exitCode = 1;
    } else {
      console.error('Internal error:', err.message);
      console.error(err.stack);
      process.exitCode = 3;
    }
  }
}

main();
