const formatMoney = (money: number) => {
  
    function isNumber(n: number) {
      return !isNaN(n) && isFinite(n);
    }
  
    if (isNumber(money)) {
      return money.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    }
    return 0;
  };
  
  export default formatMoney;