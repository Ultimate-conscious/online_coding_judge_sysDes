import { createClient } from "redis";
import { parentPort } from "worker_threads";

const client = createClient();


async function processSubmission(submission: string){
    try{    
        const sub = JSON.parse(submission);

        console.log(`Processing submission ${sub.id}`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        //console.log(`Submission ${sub.id} processed successfully`);

        parentPort?.postMessage(`Submission ${sub.id} processed successfully`);
    }
    catch(err){
        console.log("An error occured while processing submission");
    }
    
}

async function main(){
    try{
        await client.connect();
        console.log('Worker connected to redis');

        while(true){
            try{
                const submission = await client.brPop("submissions",0);

                await processSubmission(submission?.element || '');
            }catch(err){
                console.log("An error occured while processing submission");
            }
    
        }
    }catch(err){
        console.log("An error occured in the worker");
    }
}

main();