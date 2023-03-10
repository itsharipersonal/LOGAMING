

$("#addProfileDetails").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/add-profileDetails',
        method: 'post',
        data: $('#addProfileDetails').serialize(),
        success: ((res) => {
            swal({
                title: 'PERSONAL INFO IS UPDATED',
                type: 'success'
            })
        })
    })
})


$("#changePwd").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/verify-pwd',
        method: 'post',
        data: $('#changePwd').serialize(),
        success: ((res) => {
            if (res.status) {
                location.href = '/change-pwd'
            }
            else {
                Swal.fire({
                    title: 'PASSWORD INCORECT!!!',
                    text: 'Do Check Your Password',
                    icon: 'error',
                    confirmButtonText: 'back'
                })
            }
        })
    })
})


$("#changePassword").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/change-pwd',
        method: 'post',
        data: $('#changePassword').serialize(),
        success: ((res) => {
            if (res.status) {
                location.href = '/'
            }
            else {
                Swal.fire({
                    title: 'PASSWORD DO NOT MATCH!!!',
                    text: 'Please Check Your Password',
                    icon: 'error',
                    confirmButtonText: 'back'
                })
            }
        })
    })
})


function addToWish(proId) {
    $.ajax({
        url: '/add-to-wish/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Adedd to WISH list!!!",
                    text: "You Can See Items In WISH LIST!!!",
                    type: 'success',
                    timer: 500
                });
                // let count = $('#cartCount').html()
                // count = parseInt(count)+1
                // $('#cartCount').html(count)
                document.getElementById("wishbtn").style.display = "none";
                document.getElementById("dltbtnwish").style.visibility = "";
            }
            else {
                location.href = '/signin'
            }
        }
    })
}

function deleteWish(prodId) {

    $.ajax({
        url: '/delete-wishProduct/' + prodId,
        method: 'delete',
        success: (response) => {
            if (response) {

                location.reload()
            }
        }
    })
}

function deleteProdOffer(proId) {
    $.ajax({
        url: '/admin/delete-prod-offer/' + proId,
        method: 'delete',
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Delete the Offer!!!",
                    type: 'success',
                    timer: 500
                });
                location.reload()
            }
            else {
                alert('dfghj')
            }
        }
    })
}
function deleteCatOffer(proId) {
    $.ajax({
        url: '/admin/delete-cat-offer/' + proId,
        method: 'delete',
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Delete the Offer!!!",
                    type: 'success',
                    timer: 500
                });
                location.reload()
            }
            else {
                alert('dfghj')
            }
        }
    })
}


function deleteCouponCode(proId) {
    $.ajax({
        url: '/admin/delete-coupon-offer/' + proId,
        method: 'delete',
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Delete the Offer!!!",
                    type: 'success',
                    timer: 500
                });
                location.reload()
            }
            else {
                alert('dfghj')
            }
        }
    })
}


$("#addAddress").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/addSecondaryAddress',
        method: 'post',
        data: $('#addAddress').serialize(),
        success: ((res) => {
            if (res) {
                location.href = '/'
            }
            else {
                Swal.fire({
                    title: 'PASSWORD DO NOT MATCH!!!',
                    text: 'Please Check Your Password',
                    icon: 'error',
                    confirmButtonText: 'back'
                })

            }
        })
    })
})

$("#addNewAddress").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/addAditionalAddress',
        method: 'post',
        data: $('#addNewAddress').serialize(),
        success: (() => {
            location.reload()
        })
    })
})



function makeAddressDefault(addressId) {
    $.ajax({
        url: '/makeAddressDefault/' + addressId,
        method: 'get',
        success: (response) => {
            if (response) {
                location.reload()
            }
        }
    })
}

function deleteAddress(addressId) {
    $.ajax({
        url: '/deleteAddress/' + addressId,
        method: 'delete',
        success: (response) => {
            if (response) {
                location.reload()
            }
        }
    })
}

function deleteCategory(id) {
    $.ajax({
        url: '/admin/delete-category/' + id,
        method: 'delete',
        success: () => {
            location.reload()
        }
    })
}

function deleteProd(id) {
    $.ajax({
        url: '/admin/delete-product/' + id,
        method: 'delete',
        success: () => {
            location.reload()
        }
    })
}


function setBannerFirst(id) {
    $.ajax({
        url: '/admin/setBannerFirst/' + id,
        method: 'post',
        success: (response) => {
            setTimeout(()=>{
                location.reload()
            },500)
            Swal.fire({
                title: 'POSITION FIRST BANNER ADDED!!!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
           
        }
    })
}

function setBannerSecond(id) {
    $.ajax({
        url: '/admin/setBannerSecond/' + id,
        method: 'post',
        success: (response) => {
            setTimeout(()=>{
                location.reload()
            },500)
            Swal.fire({
                title: 'POSITION SECOND BANNER ADDED!!!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
           
        }
    })
}

function setBannerThird(id) {
    $.ajax({
        url: '/admin/setBannerThird/' + id,
        method: 'post',
        success: (response) => {
            setTimeout(()=>{
                location.reload()
            },500)
            Swal.fire({
                title: 'POSITION THIRD BANNER ADDED!!!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
           
        }
    })
}

function deleteBanner(id) {
    $.ajax({
        url: '/admin/deleteBanner/' + id,
        method: 'delete',
        success: (response) => {
            setTimeout(()=>{
                location.reload()
            },500)
            Swal.fire({
                title: 'DELETED!!!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
           
        }
    })
}


function deleteBannerU(id) {
    $.ajax({
        url: '/admin/deleteBannerU/' + id,
        method: 'delete',
        success: (response) => {
            setTimeout(()=>{
                location.reload()
            },500)
            Swal.fire({
                title: 'DELETED!!!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
           
        }
    })
}
