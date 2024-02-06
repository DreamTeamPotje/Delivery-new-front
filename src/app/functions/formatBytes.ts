const formatBytes = (bytes: number, decimal:number = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimal < 0 ? 0 : decimal;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  
  export default formatBytes;
  