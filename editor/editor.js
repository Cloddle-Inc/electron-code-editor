const { ipcRenderer} = require("electron");

ipcRenderer.send("key:getFileContent", "");

ipcRenderer.on('returnKey:getFileContent', (event, arg) => {
    var editor = CodeMirror.fromTextArea(document.getElementById('textEditor'), {
    theme: "ayu-dark",
    lineNumbers: true,
    lineWrapping : true,
    matchBrackets : true ,
    autoCloseBrackets : true ,
    autoCloseTags : true ,
    styleActiveLine : true 
  })
  
  editor.setValue(arg.fileContent);

  var fileExtName = arg.fileExt;
  let codeArea = document.getElementById('textArea');
  let tabContent = document.getElementById('tabContent');
  let savedText = document.getElementById('tabContent')


  matchExt();

  tabContent.innerHTML = arg.fileName // File name to tab.

  function saveAnim() {
    savedText.innerHTML = arg.fileName  + '&nbsp; <i style="font-size:11px;">*saved*</i>';
    setTimeout(function() {
      savedText.innerHTML = arg.fileName;
    }, 200); 
  }

  $(window).keypress(function(event) {
    if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
      saveAnim();
      ipcRenderer.send("key:saveFile", editor.getValue());
      event.preventDefault();
      return false;
  });

  function matchExt() {
    switch(fileExtName) {
      case ".js":
        editor.setOption("mode", "javascript");
        break;
      
      case ".html":
        editor.setOption("mode", "htmlmixed");
        break;

      case ".css":
        editor.setOption("mode", "css");
        break;

      default:
        editor.setOption("mode", "htmlmixed");
    }
  }

})
  
