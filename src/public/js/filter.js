const urlFilter = "http://localhost:8080";

async function postFilter(sortPrice, sortCategory, lim) {
    window.location.href = `${urlFilter}/?sortcategory=${sortCategory}&sortprice=${sortPrice}&lim=${lim}`;
}

const categorySelect = document.getElementById("category-select");
const priceSelect = document.getElementById("filter-select");
const limitSelect = document.getElementById("limit-select");

categorySelect.addEventListener("change", async (e) => {
    const sortCategory = e.target.value;
    const sortPrice = document.getElementById("filter-select").value;
    const lim = document.getElementById("limit-select").value;
    await postFilter(sortPrice, sortCategory, lim);
});

priceSelect.addEventListener("change", async (e) => {
    const sortCategory = document.getElementById("category-select").value;
    const sortPrice = e.target.value;
    const lim = document.getElementById("limit-select").value;
    await postFilter(sortPrice, sortCategory, lim);
});

limitSelect.addEventListener("change", async (e) => {
    const sortCategory = document.getElementById("category-select").value;
    const sortPrice = document.getElementById("filter-select").value;
    const lim = e.target.value;
    await postFilter(sortPrice, sortCategory, lim);
});