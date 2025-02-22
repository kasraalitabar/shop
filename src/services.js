export async function getAllProducts() {
    return await fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.log(err))
}

export async function getLimitedProducts(count = 4) {
    return await fetch(`https://fakestoreapi.com/products?limit=${count}`)
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.log(err))
}