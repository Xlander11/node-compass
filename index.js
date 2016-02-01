/**
 * Created by Alexandre on 2/1/2016.
 */

const childProcess = require("child_process"),
    fs = require("fs"),
    exec = childProcess.exec;


function compass(configPath){
    var hasConfig = false;

    try{
        var config = fs.statSync(configPath);

        if(config.isFile()){
            hasConfig = true;
        }else{
            throw "The path given is not a compass configuration file";
        }
    }catch(e){
        console.log(e);
    }

    if(hasConfig) {
        return {
            compile: () => {
                console.time("Compile");
                exec("compass compile", (error, stdout, stderr) => {
                    console.log(`${stdout}`);
                    console.timeEnd("Compile");

                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            },
            watch: () => {
                exec("compass watch", (error, stdout, stderr) => {
                    console.log(`${stdout}`);

                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            }
        }
    }else {
        return false;
    }
}

module.exports = compass;