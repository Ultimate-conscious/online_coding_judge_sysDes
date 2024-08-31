"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const worker_threads_1 = require("worker_threads");
const client = (0, redis_1.createClient)();
function processSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sub = JSON.parse(submission);
            console.log(`Processing submission ${sub.id}`);
            yield new Promise(resolve => setTimeout(resolve, 1000));
            //console.log(`Submission ${sub.id} processed successfully`);
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(`Submission ${sub.id} processed successfully`);
        }
        catch (err) {
            console.log("An error occured while processing submission");
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Worker connected to redis');
            while (true) {
                try {
                    const submission = yield client.brPop("submissions", 0);
                    yield processSubmission((submission === null || submission === void 0 ? void 0 : submission.element) || '');
                }
                catch (err) {
                    console.log("An error occured while processing submission");
                }
            }
        }
        catch (err) {
            console.log("An error occured in the worker");
        }
    });
}
main();
