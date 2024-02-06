const capitalizeText = (text: string) =>{
    const arr:string[] = text.toLowerCase().split(" ");
    for(let i:number = 0; i < arr.length; i++){
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
} 

export default capitalizeText;