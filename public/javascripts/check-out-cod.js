$("#checkout-form").submit((e)=>{
    e.preventDefault()
    $.ajax({
        url:'/place-order',
        method:'post',
        data:$('#checkout-form').serialize(),
        success:((res)=>{
            if(res.cod){
            swal({
                title: 'Item Placed Successfully',
                text:'Click Ok To See Your Orders',
                type: 'success'
              }).then(function() {
                  window.location.href = "/order-list";
              })
            }
            else if(res.error){
                swal({
                    title: 'SELECT PAYMENT METHOD',
                    type: 'error'
                  })
            }
            else if(res.noBal){
                swal({
                    title: 'WALLET BALANCE INSUFFICIANT',
                    text:'please select another method',
                    type: 'error'
                  })
            }
            else{
                razorpayPayment(res.response)
            }
           
        })
    })
 })

 function razorpayPayment(order) {
    var options = {
        "key": "rzp_test_2LtbQ9U70xjQCK", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "LOG",
        "description": "Test Transaction",
        "image": src = "/images/logo.png",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {

            verifyPayment(response, order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPayment(payment, order) {
    $.ajax({
        url: '/verify-payment',
        data: {
            payment, order
        },
        method: 'post',
        success: (respone) => {
            if (respone.status) {
                location.href = '/order-list'
            } else {
                location.href = '/view-cart'
            }
        }
    })
}

 