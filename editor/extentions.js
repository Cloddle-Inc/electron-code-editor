module.exports = function(fileExtName) {
    switch(fileExtName) {
        case ".js":
            return "javascript"
            break;
        
        case ".html":
            return "htmlmixed"
            break;
        
        case ".css":
            return "css"
            break;

        case ".py":
            return "python"
            break;
        
        case ".php":
            return "php"
            break;

        case ".sql":
            return "sql"
            break;  
            
        case ".db":
            return "sql"
            break;
        
        default:
            return "javascript" // TODO: Fix it.
    }
}