/**
 * Created by Alexandre on 2/1/2016.
 */

const childProcess = require("child_process"),
    fs = require("fs"),
    exec = childProcess.exec,
    spawn = childProcess.spawn;


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
        console.error(e);
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
                var file, args, command = ["compass", "watch"], options = {};

                if(process.platform === "win32"){
                    file = "cmd";
                    args = ["/s", "/c"].concat(command);
                    options.windowsVerbatimArguments = true;
                }else{
                    file = "compass";
                    args = ["watch"];
                }

                var compassSpawn = spawn(file, args, options);

                compassSpawn.stdout.on("data", (data) => {
                    console.log(`${data}`);
                });

                compassSpawn.stderr.on("data", (data) => {
                    console.log(`${data}`);
                });

                compassSpawn.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                });
            }
        }
    }else {
        return false;
    }
}
