import Product from "../Product/Product";

export default function ProductCard( {products} ) {

    return (
            <div className="product-main">
                {
                    products.map((obj, indice) => {
                            return <Product key={obj._id} product={obj} />
                    })
                }
            </div>
    )
}
