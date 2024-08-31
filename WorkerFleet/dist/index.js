"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkerFactory = require('./WorkerFactory');
// Initialize the WorkerFactory with the path to your worker script and the number of workers you want
const workerFactory = new WorkerFactory('/Users/pushkarlanjewar/Documents/Projects/coding-judge-sysDes/WorkerFleet/dist/workerScript.js', 2);
// Handle messages coming from workers
workerFactory.onWorkerMessage((worker, message) => {
    console.log(`Main: Received message from Worker ${worker.threadId}:`, message);
    // You can further process the message here, send it back to the client, etc.
});
// Optionally, handle worker errors
workerFactory.onWorkerError((worker, error) => {
    console.error(`Main: Worker ${worker.threadId} encountered an error:`, error);
});
// Optionally, handle worker exits
workerFactory.onWorkerExit((worker, code) => {
    console.log(`Main: Worker ${worker.threadId} exited with code ${code}`);
});
console.log('Main: WorkerFactory initialized and waiting for worker messages...');
