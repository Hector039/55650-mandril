
const url = "http://localhost:8080/api/carts/65a5783b2c2447f4db024e85/product/";
const productId = document.getElementById("product-id").innerText;
const addToCart = document.getElementById("addToCart");

addToCart.addEventListener("click", async () => {
    await axios.post(url + productId)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

});