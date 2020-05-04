const electron = require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
// app.commandLine.appendSwitch('--no-sandbox')

//listen for the app to be ready
app.on('ready',function(){

    //create a new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
    });

    //load html into window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file:',
        slashes:true
    }))

    //quit app when closed
    mainWindow.on('closed',function(){
        app.quit();
    })

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //insert menu
    Menu.setApplicationMenu(mainMenu);


});

function createAddWindow(){
    //create a new window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width:400,
        height:200,
        title:'Add Shoping Items'
    });

    //load html into window
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,'add.html'),
        protocol:'file:',
        slashes:true
    }))

   //garbage collection handle
   addWindow.on('close',function(){
       addWindow=null;
   })

}
//catch item:add

ipcMain.on('item:add',function(e,item){
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})

//create menu template
const mainMenuTemplate=[{
    label:'File',
    submenu:[
        {
            label:'Course Path',
            click(){
                createAddWindow();
            }
        },
        {
            label:'Quit',
            accelerator: process.platform =='darwin' ? 'Command+Q' : 'Ctrl+Q',              //darwin if for mac .
            click(){
                app.quit();
            }
        }
    ]
}];

//if mac add an empty object to menu 
if(process.platform=="darwin"){
    mainMenuTemplate.unshift({});       //unshift will add a object at the begining of the array
}


//add developer tool if not in production

if(process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTool',
                accelerator: process.platform =='darwin' ? 'Command+I' : 'Ctrl+I',    
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    });
}