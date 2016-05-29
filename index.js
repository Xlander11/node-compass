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
            compile: (cb) => {
                exec("compass compile", (error, stdout, stderr) => {
                    if (error !== null) {
                       if(cb && typeof cb == "function"){
                           cb(error);
                       }else{
                           console.log(error.toString("utf-8"));
                       }
                    }else{
                        if(cb && typeof cb == "function"){
                            cb(stdout);
                        }else{
                            console.log(stdout.toString("utf-8"));
                        }
                    }
                });
            },
            watch: (success, error) => {
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
                    if(success && typeof success == "function"){
                        success(data);
                    }else{
                        console.log(data.toString("utf-8"));
                    }
                });

                compassSpawn.stderr.on("data", (data) => {
                    if(error && typeof error == "function"){
                        error(data);
                    }else{
                        console.log(data.toString("utf-8"));
                    }
                });
            }
        }
    }else {
        return false;
    }
}

module.exports = compass;