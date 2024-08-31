const WorkerFactory = require('./WorkerFactory');
import  { Worker, isMainThread, threadId } from 'worker_threads';

const workerFactory = new WorkerFactory('/Users/pushkarlanjewar/Documents/Projects/coding-judge-sysDes/WorkerFleet/dist/workerScript.js', 2);

workerFactory.onWorkerMessage((worker: Worker, message: any) => {
    console.log(`Main: Received message from Worker ${worker.threadId}:`, message);
});

workerFactory.onWorkerError((worker: Worker, error: Error) => {
    console.error(`Main: Worker ${worker.threadId} encountered an error:`, error);
});

workerFactory.onWorkerExit((worker: Worker, code: number) => {
    console.log(`Main: Worker ${worker.threadId} exited with code ${code}`);
});

console.log('Main: WorkerFactory initialized and waiting for worker messages...');
