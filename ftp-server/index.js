// Quick start, create an active ftp server.
const FtpSrv = require('ftp-srv');
const { networkInterfaces } = require('os');
const { Netmask } = require('netmask');
const path = require('path');
const fs = require('fs');
const { readdir, stat } = require('fs').promises;
const axios = require('axios');

const resolverFunction = (address) => {
    // const networks = {
    //     '$GATEWAY_IP/32': `${public_ip}`, 
    //     '10.0.0.0/8'    : `${lan_ip}`
    // } 
    const networks = getNetworks();
    for (const network in networks) {
        if (new Netmask(network).contains(address)) {
            return networks[network];
        }
    }
    return "127.0.0.1";
}
const rootLocal = path.join(__dirname, 'ftp-dir')
const port = 21;
const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    pasv_url: resolverFunction,
    anonymous: true,
});
const nets = networkInterfaces();

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
    // console.log('trying to logon: ', rootLocal)
    if (username === 'anonymous' && password === '@anonymous') {

        connection.on('STOR', uploadHandler);

        resolve({ root: "/", cwd: rootLocal });
    }
    return reject(new Error(`Invalid username: ${username} or password:${password}`, 401));
});

ftpServer.on('client-error', ({ connection, context, error }) => {
    console.log('client-err:', error)
});

ftpServer.on('server-error', ({ error }) => {
    console.log('serv-err:', error)
});

ftpServer.listen().then(() => {
    console.log('Ftp server is starting...')
});

const uploadHandler = (error, filePath) => {
    if (error) {
        return console.log(error)
    }

    let relPath = filePath.replace(rootLocal, "")
    let fileName = filePath.replace(/^.*[\\\/]/, '')
    let fileDir = path.join(rootLocal, relPath.replace(fileName, ""))
    fileDir = fileDir.slice(0, -1)

    let device = relPath.replace(fileName, "").replace("/snap/", "").replace("/", "")

    console.log(`${device || "FNV"} uploadd "${fileName}"`)

    // TODO: notify db
    // - start detection process
    // 
    storeImage(fileName, relPath);
    //check for cleanup
    cleanup(fileDir);
}

const storeImage = async (fileName, path) => {
    console.log(`requestiong evaluation of: ${path}`)
    let postObj = { fileName, path }
    const url = `http://10.0.0.106:3030/v1/detection/`;
    try {
        const response = await axios.post(url, postObj);
        console.log('Added detection to core', response.data.id);
    } catch (error) {
        console.error(`Error! Cannot add detection to core: ${error.message}`);
    }

}

const cleanup = (dir) => {
    const directoryPath = dir ? dir : rootLocal;

    (async () => {
        try {

            const rsize = await dirSize(rootLocal);
            console.log(`root: ${rootLocal} -- Size: ${formatBytes(rsize)}`);

            const size = await dirSize(directoryPath);
            const GB = Math.pow(1024, 3)
            const limit = GB * 10  // 1GB
            console.log(`Dir: ${directoryPath} -- Size: ${formatBytes(size)}/${formatBytes(limit)}`);

            if (size > limit) {
                //clean up files
                console.log(`Hit Size Limit. Directory (${directoryPath}) Size: ${formatBytes(size)}`)
                // await removeLastAdded(directoryPath)

                const url = `http://10.0.0.106:3030/v1/detection/cleanup`;
                try {
                    const response = await axios.post(url);
                    console.log('cleanup detection to core', response.status);
                } catch (error) {
                    console.error(`Error! Cannot add detection to core: ${error.message}`);
                }
            }
        } catch (err) {
            console.log('error: ', err)
        }

    })();
}

const removeLastAdded = async (dir) => {
    const files = await readdir(dir, { withFileTypes: true });
    let paths = await files.map(async file => {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) return

        if (file.isFile()) {
            // check date
            let time = await fs.statSync(`${dir}/${file.name}`).mtime.getTime()
            return { name: filePath, time }
        }
    }).sort((a, b) => b.time - a.time) // or desc => b.time - a.time
    paths = await Promise.all(paths)
    // console.log(`first:${paths[0].name}  last: ${paths[paths.length-1].name}`)
    paths = paths.map(file => file.name);

    let fileToRemove = paths[0] // get first item or last modified

    console.log('')

    fs.unlink(fileToRemove, (err) => {
        if (err) {
            console.error('file to remove error: ', err)
            return
        }
        console.log(`Removed: ${fileToRemove} because of directory limit`)
        //file removed
    })
}

// HELPERS

const dirSize = async dir => {
    const files = await readdir(dir, { withFileTypes: true });

    const paths = files.map(async file => {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) return await dirSize(filePath);

        if (file.isFile()) {
            const { size } = await stat(filePath);

            return size;
        }

        return 0;
    });

    return (await Promise.all(paths)).flat(Infinity).reduce((i, size) => i + size, 0);
}

function getNetworks() {
    let networks = {};
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                networks[net.address + "/24"] = net.address
            }
        }
    }
    return networks;
}



const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


// fs.readdir(directoryPath, function (err, files) {
    //     //handling error
    //     if (err) {
    //         return console.log('Unable to scan directory: ' + err);
    //     }
    //     //listing all files using forEach
    //     files.forEach(function (file) {
    //         // Do whatever you want to do with the file
    //         // console.log(file);
    //         (async () => {
    //             try{
    //                 const size = await dirSize(path.join(directoryPath, file));
    //                 console.log(`File: ${file} -- Size: ${formatBytes(size)}`);
    //                 const limit = 50000000 // 50MB
    //                 if (size > limit) {
    //                     //clean up files
    //                     console.log(`WARNING: directory (${file}) has large size: ${formatBytes(size)}`)
    //                 }
    //             }catch(err){
    //                 console.log('error: ',err)
    //             }

    //         })();
    //     });
    // });