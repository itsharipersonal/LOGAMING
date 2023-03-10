


function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){ 
                swal({
                    title: "Adedd to Cart!!!",
                    text: "You Can See Items In Cart!",
                    type:'success',
                    timer: 1000
                  });
                let count = $('#cartCount').html()
                count = parseInt(count)+1
                $('#cartCount').html(count)
               
            }
            else{
                location.href= '/signin'
            }
        }
    })
}