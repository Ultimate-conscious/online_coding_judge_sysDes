import { Worker } from 'worker_threads' 
import EventEmitter from 'events'

class WorkerFactory extends EventEmitter {

    private workerScriptPath: string;
    private poolSize: number;
    private workers: Worker[];


    constructor(workerScriptPath:string, poolSize:number) {
        super();
        this.workerScriptPath= workerScriptPath;
        this.poolSize = poolSize;
        this.workers = [];

        this.initPool();
    }

    initPool() {
        for (let i = 0; i < this.poolSize; i++) {
            this.createWorker();
        }
    }

    createWorker() {
        const worker = new Worker(this.workerScriptPath);
        worker.on('message', (message) => this.emit('workerMessage', worker, message));
        worker.on('error', (error) => this.emit('workerError', worker, error));
        worker.on('exit', (code) => {
            this.emit('workerExit', worker, code);
            this.replaceWorker(worker);
        });
        this.workers.push(worker);
    }

    replaceWorker(worker: Worker) {
        const index = this.workers.indexOf(worker);
        if (index !== -1) {
            this.workers.splice(index, 1);
            this.createWorker();
        }
    }

    onWorkerMessage(callback: (worker: Worker, message: any) => void) {
        this.on('workerMessage', callback);
    }

    onWorkerError(callback: (worker: Worker, error: Error) => void) {
        this.on('workerError', callback);
    }

    onWorkerExit(callback: (worker: Worker, code: number) => void) {
        this.on('workerExit', callback);
    }
}

module.exports = WorkerFactory;
