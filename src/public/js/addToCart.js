
const url = "http://localhost:8080/api/carts/65a57434d6d3c222f881cb0b/product/";
const urlToAdd = "http://localhost:8080/api/carts/65a57434d6d3c222f881cb0b/addproduct/";

const productId = document.getElementById("product-id").innerText;
const addToCart = document.getElementById("addToCart");

let add = document.getElementById("add");
let rest = document.getElementById("rest");
let pElement = document.getElementById("quantity");
let counter = 1;

add.onclick = function () {
    counter++;
    pElement.textContent = counter;
};

rest.onclick = function () {
    if (counter > 1) {
        counter--;
        pElement.textContent = counter;
    }
};

addToCart.addEventListener("click", async () => {
    await axios.post(urlToAdd + productId, {
        quantity: counter,
    })
        .then(function (response) {
            console.log(response.data.msg);
        })
        .catch(function (error) {
            console.log(error);
        });
});

