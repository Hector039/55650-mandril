const url = "http://localhost:8080/api/carts/65a57434d6d3c222f881cb0b/product/";

async function deleteItem(prodId) {
    await axios.delete(url + prodId)
        .then(async function (response) {
            console.log(response.data.msg);
            location.reload();
        })
        .catch(function (error) {
            console.log(error);
        });
};