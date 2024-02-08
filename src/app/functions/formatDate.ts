function adicionaZero(numero:number){
    if (numero <= 9) 
        return "0" + numero;
    else
        return numero; 
}

export default function formatDate(date: any){
    let dt = new Date(date)
    return `${adicionaZero(dt.getDay())}/${adicionaZero(dt.getMonth() + 1)}/${dt.getFullYear()} ${dt.getHours()}h${dt.getMinutes()}`
}