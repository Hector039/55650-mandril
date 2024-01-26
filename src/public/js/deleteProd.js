const url = "http://localhost:8080/api/carts/product/";
const urlEmptyCart = "http://localhost:8080/api/carts/";

async function deleteItem(prodId) {
    await axios.delete(url + prodId)
        .then(function (response) {
            console.log(response.data.msg);
            location.reload();
        })
        .catch(function (error) {
            console.log(error);
        });
};

async function emptyCart(userCartId) {
    console.log(userCartId);
    await axios.delete(urlEmptyCart + userCartId)
        .then(function (response) {
            console.log(response.data.msg);
            location.reload();
        })
        .catch(function (error) {
            console.log(error);
        });
};