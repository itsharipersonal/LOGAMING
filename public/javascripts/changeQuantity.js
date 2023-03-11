function changeQuantity(cartId, prodId, stock, userId, count) {
  let quantity = parseInt(document.getElementById(prodId).innerHTML);
  count = parseInt(count);
  quantityCheck = quantity + count;
  stock = parseInt(stock);
  if (quantityCheck <= stock && quantityCheck != 0) {
    document.getElementById("minus" + prodId).classList.remove("invisible");
    document.getElementById("plus" + prodId).classList.remove("invisible");
    $.ajax({
      url: "/change-product-quantity",
      data: {
        user: userId,
        cart: cartId,
        product: prodId,
        count: count,
      },
      type: "post",
      success: (response) => {
        document.getElementById(prodId).innerHTML = quantity + count;
        document.getElementById("total").innerHTML = response.total;
      },
    });
  }
  if (quantityCheck == 1) {
    document.getElementById("minus" + prodId).classList.add("invisible");
  }
  if (quantityCheck == stock) {
    document.getElementById("plus" + prodId).classList.add("invisible");
  }
}

// function deleteCart(prodId) {

//           $.ajax({
//             url: '/delete-cartProduct/'+ prodId,
//             method: 'get',
//             success: (response) => {
//               if (response) {

//                 location.reload()
//               }
//             }
//           })
//         }

function deleteCart(prodId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You will not be able to recover this item from your cart!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/delete-cartProduct/" + prodId,
        method: "get",
        success: (response) => {
          if (response) {
            location.reload();
          }
        },
      });
    }
  });
}

// function cancelOrder(orderId){

//   $.ajax({
//     url:'/cancel-order/'+orderId,
//     method:'get',
//     success:(response)=>{
//       if(response){
//         location.reload()
//       }
//     }
//   })
// }

function cancelOrder(orderId) {
  Swal.fire({
    title: "Are you sure you want to cancel this order?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/cancel-order/" + orderId,
        method: "get",
        success: (response) => {
          if (response) {
            location.reload();
          }
        },
      });
    }
  });
}

// function orderShipped(orderId){

//   $.ajax({
//     url:'/admin/shipped-order/'+orderId,
//     method:'get',
//     success:(response)=>{
//       if(response){
//         location.reload()
//       }
//     }
//   })
// }

function orderShipped(orderId) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to mark this order as shipped?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, ship it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/admin/shipped-order/" + orderId,
        method: "get",
        success: (response) => {
          if (response) {
            location.reload();
          }
        },
      });
    }
  });
}

function orderDelivered(orderId) {
  $.ajax({
    url: "/admin/delivered-order/" + orderId,
    method: "get",
    success: (response) => {
      if (response) {
        location.reload();
      }
    },
  });
}

function returnOrder(orderId) {
  Swal.fire({
    title: "Are you sure?",
    text: "This order will be marked as returned.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, return it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/return-order/" + orderId,
        method: "get",
        success: (response) => {
          if (response) {
            location.reload();
          }
        },
      });
    }
  });
}

// function returnOrderRecieved(orderId){

//   $.ajax({
//     url:'/admin/return-order-recieved/'+orderId,
//     method:'get',
//     success:(response)=>{
//       if(response){
//         location.reload()
//       }
//     }
//   })
// }

// function returnOrderRecieved(orderId){
//   if(confirm("Are you sure you want to mark this order as received?")){
//     $.ajax({
//       url:'/admin/return-order-recieved/'+orderId,
//       method:'get',
//       success:(response)=>{
//         if(response){
//           location.reload()
//         }
//       }
//     })
//   }
// }
function returnOrderRecieved(orderId) {
  Swal.fire({
    title: "Are you sure?",
    text: "Once marked as received, the order status cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, mark it as received!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/admin/return-order-recieved/" + orderId,
        method: "get",
        success: (response) => {
          if (response) {
            location.reload();
          }
        },
      });
    }
  });
}
