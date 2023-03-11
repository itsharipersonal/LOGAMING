window.onload = function () {
  let rupees = document.getElementById("currency");
  let formatter1 = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  let amount = document.getElementById("currency").value;
  console.log(amount);
  rupees.innerHTML = `<span>Indian Rupees:</span>${formatter1.format(amount)}`;
};
