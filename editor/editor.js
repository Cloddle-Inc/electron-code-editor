const { ipcRenderer, ipcMain} = require("electron");
const delay = require('delay');

ipcRenderer.send("key:getFileContent", "");

ipcRenderer.on('returnKey:getFileContent', (event, arg) => {
    var editor = CodeMirror.fromTextArea(document.getElementById('textEditor'), {
    theme: "ayu-dark",
    mode: "javascript",
    lineNumbers: true,
    lineWrapping : true,
    matchBrackets : true ,
    autoCloseBrackets : true ,
    autoCloseTags : true ,
    styleActiveLine : true 
  })
  
  editor.setValue(arg.fileContent);
  let codeArea = document.getElementById('textArea')
  let tabContent = document.getElementById('tabContent')
  let savedIcon = document.getElementById('savedIcon');

  tabContent.innerHTML = arg.fileName // File name to tab.

  savedIcon.style.display = "none" 

  function saveAnim() {
    savedIcon.style.display = ""
    setTimeout(function() {
      savedIcon.style.display = "none"
    }, 200);
  }

  $(window).keypress(function(event) {
    
    if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
       saveAnim()
      ipcRenderer.send("key:saveFile", editor.getValue());
      event.preventDefault();
      return false;
  });
})
  
