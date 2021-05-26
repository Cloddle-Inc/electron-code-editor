const { ipcRenderer, ipcMain} = require("electron");

ipcRenderer.send("key:getFileContent", "");

ipcRenderer.on('returnKey:getFileContent', (event, arg) => {
    var editor = CodeMirror.fromTextArea(textEditor, {
    theme: "ayu-dark",
    mode: "javascript",
    lineNumbers: true,
    lineWrapping : true,
    matchBrackets : true ,
    autoCloseBrackets : true ,
    autoCloseTags : true ,
    styleActiveLine : true 
  }).setValue(arg)

  let saveFile = document.querySelector("#saveFile");
  let fileNow = document.querySelector("#textEditor").value
  
  saveFile.addEventListener("click", function(){
      console.log(fileNow.value)
      ipcRenderer.send("key:saveFile", fileNow);
  });
})
  
