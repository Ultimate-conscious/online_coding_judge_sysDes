"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const events_1 = __importDefault(require("events"));
class WorkerFactory extends events_1.default {
    constructor(workerScriptPath, poolSize) {
        super();
        this.workerScriptPath = workerScriptPath;
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
        const worker = new worker_threads_1.Worker(this.workerScriptPath);
        worker.on('message', (message) => this.emit('workerMessage', worker, message));
        worker.on('error', (error) => this.emit('workerError', worker, error));
        worker.on('exit', (code) => {
            this.emit('workerExit', worker, code);
            this.replaceWorker(worker);
        });
        this.workers.push(worker);
    }
    replaceWorker(worker) {
        const index = this.workers.indexOf(worker);
        if (index !== -1) {
            this.workers.splice(index, 1);
            this.createWorker();
        }
    }
    onWorkerMessage(callback) {
        this.on('workerMessage', callback);
    }
    onWorkerError(callback) {
        this.on('workerError', callback);
    }
    onWorkerExit(callback) {
        this.on('workerExit', callback);
    }
}
module.exports = WorkerFactory;
