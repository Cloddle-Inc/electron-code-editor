const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { create } = require('domain');
const { basename } = require('path');

const {app, BrowserWindow,ipcMain, dialog, Menu, remote} = electron;

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        webPreferences:{
            enableRemoteModule: true,
            nodeIntegration: true, 
            contextIsolation: false,
            show: false
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file:",
            slashes: true
        })
    );

    // Fullscreen Options 
    mainWindow.maximize();
    mainWindow.show();
    
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu);

    // New Window
    openNewFileM();
    function openNewFileM() {
        ipcMain.on('key:openNewFile', (event, arg) =>{

            dialog.showOpenDialog({properties: ['openFile'] }).then(function (response) {
                if (!response.canceled) {
                    createEditorWindow();
    
                    var fileFullPath = response.filePaths[0];
                    
                    console.log(response)
                    fs.readFile(fileFullPath, 'utf8' , (err, data) => {
                        if (err) {
                          console.error(err)
                          
                        } else {         
                            var fileName = basename(fileFullPath);
                            sendContent(data, fileName);
                            saveFile(fileFullPath);
                        }
                      });
                    
                      
                } else {
                  console.log("no file selected");
                }
            });
    
        });
    }
    
    function saveFile(fileFullPath) {
        ipcMain.on('key:saveFile', (event, arg) =>{
            fs.writeFile(fileFullPath, arg, function(err) {
                if (err) throw err;
                return true;
            }); 
        })
    }


function sendContent(data, fileName) {
    ipcMain.on('key:getFileContent', (event, arg) => {
        var fileData = {
            "fileContent" : data,
            "fileName" : fileName
        }
        event.reply('returnKey:getFileContent', fileData)
    })
}


    
});

    // MENUS
const mainMenuTemplate = [
    {
        label : "File",
        submenu : [
            {
                label : "Open New File",
                click() {
                    
                }
            },
            {
                label : "Save",
                click() {
                    
                }
            },
            {
                label : "Quit",
                accelerato : process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                role : "quit"
            }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: "Help Area" // Goes to website**
            }
        ]
    }
]

// Macintosh Compatibility Issue Solve
if(process.platform == "darwin") {
    mainMenuTemplate.unshift({
        label : app.getName(),
        role : "TODO"
    })
};




if(process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push(
        {
            label : "Dev Tools",
            submenu: [
                {
                    label : "Geliştirici Penceresini Aç",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                     label : "Yenile",
                     role: "reload"
                }
            ]
        }
    )
} 


function createEditorWindow(){
    addWindow = new BrowserWindow({  
        webPreferences:{
            nodeIntegration: true, 
            contextIsolation: false,
            enableRemoteModule: true,
            show: false
        },
        width: 800,
        height: 800,
        title: "Editor"
    });

    
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/editor.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.maximize();
    addWindow.show();


    addWindow.on('close', () => {
        addWindow = null;
    })
}