
const CART = JSON.parse(localStorage.getItem("cart")) ?? []
async function getAllProducts() {
    return await fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.log(err))
}

async function getLimitedProducts(count = 4) {
    return await fetch(`https://fakestoreapi.com/products?limit=${count}`)
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.log(err))
}

async function getIdProduct(id) {
    return await fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.log(err))

}

const mobileMenuContainer = document.getElementById("mobile-menu")
const headerSlider = document.getElementById("header-slider")
let sliderContainer;
const root = document.getElementById("root")

let lastSlideElement;
let count = 0

let sliderInterval;

const slides = [
    {
        id: 1,
        title: "برای سوپرایز آماده شودی",
        img: "gholaam.webp",
        bg: "rgb(255, 255, 97)"

    },
    {
        id: 2,
        title: "مد برای هر زمان",
        img: "javad.webp",
        bg: "rgb(124, 218, 255)"
    },
    {
        id: 3,
        title: "مد برای هر مکان",
        img: "javad.webp",
        bg: "rgb(171, 245, 193)"
    }
]



function renderSlider(items) {
    let template = `
            <div id="slide" class=" w-full h-full  inline-block  absolute top-0 left-0">
                <img class="w-1/3 sm:w-1/5 absolute bottom-0 duration-1000 left-[-15.5rem]" src="./public/images/images/${items[count].img}" width="500" />

                <span class="absolute duration-1000 top-1/2 right-[-15.5rem] max-w-80">
                ${items[count].title}
                </span>

                <div id="dots" class="flex w-max justify-between items-center absolute bottom-6 right-8 ">
                    <div id="dot0"  class="w-1 p-1 cursor-pointer rounded-full bg-black border-4  "></div>
                    <div id="dot1"  class="w-1 p-1 cursor-pointer rounded-full bg-black border-4 "></div>
                    <div id="dot2"  class="w-1 p-1 cursor-pointer rounded-full bg-black border-4 "></div>


                
               </div>


            </div>
        `




    sliderContainer.innerHTML = template

    sliderContainer.style.backgroundColor = items[count].bg

    document.getElementById(`dot${count}`).classList.add("border-red-400")
    document.getElementById("dot0").addEventListener("click", dotClick)
    document.getElementById("dot1").addEventListener("click", dotClick)
    document.getElementById("dot2").addEventListener("click", dotClick)
    document.getElementById("slide").addEventListener("click", NextPrev)







    setTimeout(() => {
        document.querySelector("#slide > img").classList.remove("left-[-15.5rem]")
        document.querySelector("#slide > span").classList.remove("right-[-15.5rem]")


        document.querySelector("#slide > img").classList.add("left-[1.5rem]")
        document.querySelector("#slide > span").classList.add("right-[2.5rem]")
    }, 100)

}
function dotClick(evt) {
    evt.stopPropagation()
    let getId = evt.target.id
    count = Number(getId[3])
    renderSlider(slides)

    clearInterval(sliderInterval);

    sliderInterval = setInterval(() => {
        document.getElementById("slide").remove


        if (count === 2)
            count = 0
        else
            count++

        renderSlider(slides)
    }, 500000)

}

async function renderCart() {
    const cartData = []
    for (const cartItem of CART) {
        const result = await getIdProduct(cartItem);
        cartData.push(result)
    }
// .................................................
    const template = cartData.map((item) => {

        return `
        <div class="whr">
            <h3>${item.title}</h3>
            <img src='${item.image}' width="200" />
            
        </div>
        `
    }).join("");

    root.innerHTML = template
}

function renderProductCard({ id, price, image, title }) {

    const isLowPrice = price < 100;

    const template = `
    <a onclick="handleAClick(event, 'product/${id}')" href='product/${id}' class="w-full border rounded-xl overflow-hidden relative">
    <img class="object-contain rounded-xl w-full h-96" src="${image}" alt="">
    <div style="display:flex;flex-direction:column" class="p-2">
        <h4>${title}</h4>
        <span>${price}$</span>
    </div>

    ${isLowPrice ? (`
            <div class="text-white absolute top-2 right-2 w-max cursor-default rounded-full bg-red-500 px-2 py-1">
                فروش ویژه
            </div>
        `) : ""}
    <div  class="click  absolute p-2 rounded-full cursor-pointer top-2 left-2 bg-white shadow-xl hover:bg-red-500" >
        <svg width="26px" height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
    </div>
</a>
    `

    return template
}

async function renderMainPage() {
    const products = await getLimitedProducts(4)

    const template = products.map(product => {
        return renderProductCard(product)
    }).join("")

    const container = `
    <div id="slider" class="overflow-hidden duration-1000 relative h-[50vh] md:h-[70vh] w-full whitespace-nowrap">
    </div>
    <div style="margin-top:42px;" class="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4 ">
        ${template}
    </div>
    <div class="flex justify-center mt-10">
        <a onclick="handleAClick(event, 'all-products')" class="bg-blue-400 rounded-md px-4 py-2 text-white" href='all-products'>نمایش همه محصولات</a>
    </div>
    `

    root.innerHTML = container;

    sliderContainer = document.getElementById("slider")

    renderSlider(slides);

    sliderInterval = setInterval(() => {
        document.getElementById("slide").remove

        if (count === 2)
            count = 0
        else
            count++

        renderSlider(slides)
    }, 5000)


}

renderMainPage()

function handleAClick(evt, link) {
    evt.preventDefault();

    history.pushState({}, "", `${link}`);

    router();
}

async function renderAllProducts() {

    const result = await getAllProducts()

    const template = result.map(product => {
        return renderProductCard(product);
    }).join("");

    const container = `
    <div class=" grid grid-cols-1 md:grid-cols-4 gap-2">
        ${template}
    </div>
    `

    root.innerHTML = container;
}


function NextPrev(evt) {
    console.log(evt.clientX)
    if (evt.clientX < 1349 / 2) {
        if (count === 0)
            count = 2

        else
            count--

    }
    else {
        if (count === 2)
            count = 0

        else
            count++

    }

    renderSlider(slides)
}

async function renderSingleProduct() {
    root.innerHTML = `
        <div class="p-10 w-fit mx-auto">
            LOADING
        </div>
    `

    clearInterval(sliderInterval)
    root.classList.add("flex", "gap-[20px]", "sm:w-full", "sm:items-center", "flex-col", "sm:flex-row", "items-center")
    const { title, image, price, id, description } = await getIdProduct(Number(location.pathname.split("/").at(-1)))
    const isLowPrice = price < 100
    const template = `<div class="root mr-auto ml-auto ">
        <img style="object-fit: contain;width:50%; height:30%;" src="${image}" alt="">
        <div class="title">
            <h6>${title}</h6>
            <h1>${description}</h1>
            <div style="text-align: end;">
                <h3 style="background-color: #d2ef9a;border: solid #d2ef9a;">${price}$</h3>
            </div>
            <hr>
            <div class="all">
                <p id="demo"></p>
                <div style="margin-top: 20px;">:offer end in</div>
            </div>
            <p class="mojood">موجود</p>
            <div class="sm:w-1/3 w-4/5 h-max  sm:h-[200px] flex flex-col justify-between sm:items-start items-center gap-5 sm:gap-0 ">
        
        ${CART.includes(id) ? (
            `
            <div style="margin-bottom:50px" onclick='removeFromCart(${id})' class="w-max cursor-pointer rounded-lg bg-red-500 py-2 px-3" > حذف از سبد خرید</div>
            `
        ) : (`<div style="margin-bottom:50px" onclick='addToCart(${id})' class="w-max cursor-pointer rounded-lg bg-blue-500 py-2 px-3" > اضافه کردن به سبد خرید</div>`)
        }
        
        </div >
            <hr>
            <p style="text-align: end;">شناسه محصول: FASHION123</p>
            <p style="text-align: end;">تحویل تخمینی:
                03 فوریه - 07 فوریه</p>
            <div style="text-align: end;font-size: 30px; margin-bottom: 2rem;">همین امروز آن را دریافت کنید</div>
            <div style="display: flex;flex-direction: row-reverse;gap: 1rem;">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 28.6667H3.768C2.79333 28.6667 2 27.8733 2 26.8987V10.6667C2 10.2987 2.29867 10 2.66667 10H28C28.368 10 28.6667 10.2987 28.6667 10.6667V16C28.6667 16.368 28.368 16.6667 28 16.6667C27.632 16.6667 27.3333 16.368 27.3333 16V11.3333H3.33333V26.8987C3.33333 27.1387 3.528 27.3333 3.768 27.3333H24C24.368 27.3333 24.6667 27.632 24.6667 28C24.6667 28.368 24.368 28.6667 24 28.6667Z" fill="#1F1F1F"/>
                    <path d="M28 11.3333C27.7653 11.3333 27.5373 11.2093 27.416 10.988L23.3893 3.67867C23.2733 3.46533 23.0493 3.33333 22.8053 3.33333H7.86133C7.61733 3.33333 7.39332 3.46533 7.27732 3.67867L3.25066 10.988C3.07332 11.312 2.66532 11.4253 2.34532 11.2507C2.02266 11.0733 1.90532 10.6667 2.08266 10.3453L6.10932 3.036C6.45999 2.396 7.13199 2 7.86133 2H22.8067C23.536 2 24.208 2.396 24.5587 3.03467L28.584 10.344C28.7627 10.6667 28.6453 11.072 28.3227 11.2493C28.22 11.3067 28.1093 11.3333 28 11.3333Z" fill="#1F1F1F"/>
                    <path d="M15.3346 11.3333C14.9666 11.3333 14.668 11.0347 14.668 10.6667V2.66667C14.668 2.29867 14.9666 2 15.3346 2C15.7026 2 16.0013 2.29867 16.0013 2.66667V10.6667C16.0013 11.0347 15.7026 11.3333 15.3346 11.3333Z" fill="#1F1F1F"/>
                    <path d="M33.3333 34C32.9653 34 32.6667 33.7013 32.6667 33.3333V30.6667C32.6667 26.6227 29.376 23.3333 25.3333 23.3333H22.6667C22.2987 23.3333 22 23.0347 22 22.6667C22 22.2987 22.2987 22 22.6667 22H25.3333C30.112 22 34 25.888 34 30.6667V33.3333C34 33.7013 33.7013 34 33.3333 34Z" fill="#1F1F1F"/>
                    <path d="M27.3333 27.3334C27.18 27.3334 27.0253 27.2801 26.9 27.1721L22.2333 23.172C22.084 23.0467 22 22.8614 22 22.6667C22 22.472 22.084 22.2867 22.2333 22.1614L26.9 18.1614C27.1787 17.9227 27.5973 17.9534 27.84 18.2334C28.08 18.512 28.0467 18.9334 27.7667 19.1734L23.692 22.6667L27.768 26.1614C28.048 26.4014 28.08 26.8214 27.8413 27.1014C27.7067 27.2547 27.5213 27.3334 27.3333 27.3334Z" fill="#1F1F1F"/>
                    </svg>
                    <p>30 - روز بازگشت</p>
            </div>
            <div style="display: flex;flex-direction: row-reverse;gap: 1rem;">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.2203 13.7446H28.0452L25.7879 18.8796M19.9273 17.364H16.7027C16.7027 17.364 18.41 14.2694 18.6918 13.9237C18.9767 13.5742 19.2464 13.7922 19.2722 14.1005C19.2979 14.4088 19.2593 18.8796 19.2593 18.8796M15.8678 18.918C15.8678 18.918 13.3694 18.9494 13.251 18.91C13.1327 18.8705 13.4407 18.6621 15.0788 16.3217C15.3847 15.8846 15.5531 15.5159 15.6247 15.2069L15.6501 15.0083C15.6501 14.2826 15.0618 13.6943 14.3361 13.6943C13.6976 13.6943 13.1654 14.1498 13.0469 14.7536M23.4625 13.7446L21.4002 18.9298" stroke="#1F1F1F" stroke-width="1.1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.01753 19.3831C3.31733 17.8079 2.88104 16.149 3.02868 14.5886C3.06544 14.2005 3.24514 13.8398 3.52081 13.5642L5.7953 11.2897C6.44612 10.6389 7.52298 10.7172 8.07269 11.4554L10.6418 14.8706C10.7745 15.047 10.8382 15.2658 10.8209 15.4859C10.8036 15.7059 10.7065 15.9121 10.5479 16.0656L8.88371 17.6761C8.78456 17.772 8.72128 17.8991 8.7044 18.036C8.68752 18.1729 8.71806 18.3115 8.79093 18.4287V18.4287C11.0059 21.9897 14.0099 24.9938 17.5709 27.2087C17.6881 27.2816 17.8267 27.3121 17.9636 27.2952C18.1005 27.2783 18.2275 27.2151 18.3235 27.1159L19.934 25.4518C20.0875 25.2932 20.2936 25.1961 20.5137 25.1788C20.7337 25.1615 20.9525 25.2252 21.1289 25.3578L24.5441 27.927C25.2824 28.4767 25.3607 29.5535 24.7099 30.2043L22.4354 32.4788C22.1496 32.7641 21.7726 32.9396 21.3703 32.9747C15.8889 33.4574 9.21558 26.7841 9.21558 26.7841C9.21558 26.7841 6.78825 24.3568 4.96732 21.2275" stroke="#1F1F1F" stroke-width="1.1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.1631 7.90171C16.5943 3.92955 23.4103 4.0729 27.6693 8.33185C32.0767 12.7392 32.0767 19.8849 27.6693 24.2923C26.4407 25.5208 24.9995 26.4069 23.464 26.9505M9.03711 12.5754C9.44604 11.4068 10.0458 10.314 10.812 9.3414" stroke="#1F1F1F" stroke-width="1.1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M29.7075 7.54503C34.2924 12.7739 34.0907 20.7362 29.1023 25.7245C27.921 26.9059 26.5728 27.8188 25.1336 28.4632M7.54688 10.8479C8.19081 9.41618 9.10077 8.07489 10.2767 6.89892C15.208 1.96766 23.0457 1.71408 28.2758 6.1383" stroke="#1F1F1F" stroke-width="1.1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>پشتیبانی اختصاصی</p>
            </div>
            <div style="display: flex;flex-direction: row-reverse;gap: 1rem;">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.9066 13.5229H25.892L26.499 6.51232C26.5001 6.49962 26.5003 6.48711 26.5003 6.4746C26.5003 6.47353 26.5005 6.47253 26.5005 6.47146C26.5005 6.47127 26.5005 6.47115 26.5005 6.47096C26.5005 6.28015 26.386 6.11197 26.2178 6.03885C26.2164 6.03822 26.215 6.03747 26.2136 6.03684C26.2032 6.03244 26.1923 6.02867 26.1815 6.02502C26.1774 6.0237 26.1735 6.02207 26.1695 6.02081C26.1606 6.01811 26.1515 6.01597 26.1424 6.01377C26.136 6.01226 26.1299 6.01044 26.1235 6.00918C26.1155 6.00761 26.1073 6.0066 26.0991 6.00541C26.0915 6.00428 26.084 6.00296 26.0763 6.00226C26.075 6.00214 26.0738 6.00189 26.0725 6.00176C26.0643 6.00101 26.0562 6.00113 26.048 6.00082C26.0425 6.00063 26.0371 6 26.0316 6H26.0257C26.0252 6 26.0247 6 26.0243 6H16.4384C16.1796 6 15.9696 6.21124 15.9696 6.47152C15.9696 6.73117 16.1796 6.94304 16.4384 6.94304H25.5206L24.5877 17.7173C24.5876 17.7181 24.5876 17.719 24.5875 17.7198L24.3521 20.4383H8.06374L8.33618 17.6093H11.4376C11.6965 17.6093 11.9063 17.3982 11.9063 17.1378C11.9063 16.8774 11.6965 16.6663 11.4376 16.6663H8.42706L9.00232 10.694H13.9384C14.1973 10.694 14.4071 10.4829 14.4071 10.2224C14.4071 9.96204 14.1973 9.75093 13.9384 9.75093H9.0932L9.3637 6.94304H14.5634C14.8215 6.94304 15.0321 6.73117 15.0321 6.47152C15.0321 6.21124 14.8215 6 14.5634 6H8.93826C8.93801 6 8.93782 6.00006 8.93757 6.00006C8.71738 6 8.52638 6.15592 8.48019 6.37206C8.47987 6.37363 8.47931 6.37514 8.479 6.37672C8.47662 6.38847 8.47506 6.40048 8.4735 6.41255C8.47306 6.41639 8.47225 6.42003 8.47187 6.42387C8.47181 6.42462 8.47162 6.42531 8.47156 6.42607L8.15131 9.75093H2.46876C2.20982 9.75093 2 9.96204 2 10.2224C2 10.4829 2.20982 10.694 2.46876 10.694H8.06043L7.48517 16.6663H5.8127C5.55376 16.6663 5.34394 16.8774 5.34394 17.1378C5.34394 17.3982 5.55376 17.6093 5.8127 17.6093H7.39435L7.0811 20.861C7.08103 20.8615 7.08104 20.862 7.08097 20.8624L6.59665 25.8907C6.59659 25.8913 6.59653 25.8919 6.59646 25.8924L6.59628 25.8942C6.59565 25.9007 6.59571 25.9072 6.59534 25.9137C6.5949 25.9224 6.59403 25.9309 6.59403 25.9397C6.59403 25.94 6.59409 25.9404 6.59409 25.9409C6.59409 25.953 6.59496 25.9649 6.59584 25.9769C6.59621 25.9807 6.59609 25.9846 6.59653 25.9884C6.59778 26.0006 6.59984 26.0126 6.60203 26.0245C6.60265 26.0281 6.60296 26.0316 6.60365 26.0351C6.60546 26.0442 6.60803 26.0529 6.6104 26.0618C6.61203 26.068 6.61334 26.0743 6.61521 26.0804C6.61578 26.0821 6.61653 26.0838 6.61703 26.0855C6.63971 26.1557 6.67821 26.2187 6.72847 26.2701C6.7294 26.2711 6.73015 26.2721 6.73109 26.273C6.73609 26.278 6.74153 26.2826 6.74678 26.2873C6.77909 26.3171 6.81559 26.3424 6.85553 26.3622C6.86384 26.3664 6.87203 26.3707 6.88053 26.3743C6.88309 26.3754 6.88584 26.3762 6.88847 26.3772C6.90022 26.3819 6.91203 26.3864 6.92422 26.3903C6.92534 26.3906 6.92641 26.3908 6.92753 26.3911C6.94141 26.3953 6.95541 26.3989 6.96972 26.4019C6.9716 26.4023 6.97353 26.4024 6.97535 26.4028C6.98897 26.4053 7.00266 26.4075 7.0166 26.4089C7.01691 26.4089 7.01716 26.409 7.01747 26.409C7.03285 26.4106 7.0481 26.4113 7.06322 26.4113C7.06341 26.4113 7.06366 26.4112 7.06391 26.4112H9.1507C9.38114 28.1686 10.879 29.5298 12.6881 29.5298C14.4971 29.5298 15.9949 28.1686 16.2253 26.4112H23.7442C23.9747 28.1686 25.4725 29.5298 27.2815 29.5298C29.0905 29.5298 30.5884 28.1686 30.8189 26.4112H32.9062C32.9065 26.4112 32.9069 26.4113 32.9072 26.4113C32.9228 26.4113 32.9382 26.4104 32.9535 26.4089C32.9562 26.4086 32.9588 26.408 32.9616 26.4077C32.9738 26.4063 32.9859 26.4046 32.9978 26.4022C33.0029 26.4012 33.0078 26.3998 33.0129 26.3986C33.0221 26.3965 33.0313 26.3942 33.0403 26.3915C33.0465 26.3897 33.0524 26.3875 33.0584 26.3855C33.0661 26.3828 33.0738 26.3801 33.0813 26.377C33.0878 26.3744 33.094 26.3716 33.1003 26.3687C33.1072 26.3655 33.1141 26.3623 33.1208 26.3588C33.1272 26.3555 33.1333 26.3522 33.1394 26.3486C33.1458 26.3449 33.1522 26.341 33.1585 26.3369C33.1644 26.3332 33.1703 26.3293 33.1759 26.3253C33.1823 26.3208 33.1883 26.3161 33.1945 26.3113C33.1997 26.3073 33.2048 26.3032 33.2098 26.299C33.2163 26.2935 33.2223 26.2878 33.2285 26.2819C33.2327 26.2778 33.2372 26.2738 33.2413 26.2695C33.2478 26.2629 33.254 26.2558 33.2602 26.2487C33.2635 26.2449 33.2669 26.2412 33.2701 26.2373C33.277 26.2287 33.2832 26.2199 33.2895 26.2111C33.2916 26.208 33.294 26.2051 33.296 26.202C33.3037 26.1905 33.3109 26.1786 33.3175 26.1664C33.318 26.1657 33.3185 26.165 33.3188 26.1642C33.3259 26.1511 33.3324 26.1377 33.3382 26.1239C33.3398 26.1199 33.341 26.1158 33.3426 26.1119C33.3464 26.1021 33.3502 26.0924 33.3534 26.0823C33.3554 26.0757 33.3569 26.069 33.3587 26.0624C33.3608 26.0545 33.363 26.0467 33.3647 26.0387C33.3663 26.0316 33.3673 26.0243 33.3685 26.0171C33.3695 26.0108 33.3709 26.0045 33.3717 25.9981C33.3916 25.8379 33.7587 22.8755 33.9226 20.96C33.9228 20.9582 33.9229 20.9563 33.923 20.9545C33.9702 20.4023 34.0005 19.9373 34.0005 19.6526C34.0005 16.2727 31.2668 13.5229 27.9066 13.5229ZM25.8103 14.466H27.728L27.4831 17.2949H25.5653L25.8103 14.466ZM12.6882 28.5867C11.2371 28.5867 10.0566 27.3992 10.0566 25.9396C10.0566 24.48 11.2372 23.2925 12.6882 23.2925C14.1392 23.2925 15.3198 24.48 15.3198 25.9396C15.3198 27.3992 14.1392 28.5867 12.6882 28.5867ZM27.2815 28.5867C25.8305 28.5867 24.65 27.3992 24.65 25.9396C24.65 24.48 25.8305 23.2925 27.2815 23.2925C28.7326 23.2925 29.9131 24.48 29.9131 25.9396C29.9131 27.3992 28.7326 28.5867 27.2815 28.5867ZM32.492 25.4679H30.8191C30.5887 23.7104 29.0908 22.3492 27.2816 22.3492C25.4726 22.3492 23.9747 23.7104 23.7443 25.4679H16.2255C15.9951 23.7104 14.4973 22.3492 12.6882 22.3492C10.8791 22.3492 9.38114 23.7104 9.15076 25.4679H7.57923L7.97293 21.3811H24.7817V21.3814C24.7819 21.3814 24.7821 21.3814 24.7824 21.3814C24.7981 21.3814 24.8136 21.3805 24.829 21.3789C24.8319 21.3787 24.8347 21.378 24.8376 21.3777C24.8498 21.3762 24.862 21.3744 24.874 21.3721C24.8792 21.371 24.8843 21.3695 24.8894 21.3683C24.8988 21.366 24.9081 21.3638 24.9173 21.3611C24.9235 21.3592 24.9294 21.3569 24.9355 21.3548C24.9434 21.352 24.9513 21.3493 24.9589 21.3462C24.9654 21.3435 24.9718 21.3404 24.9781 21.3374C24.9851 21.3342 24.992 21.331 24.9987 21.3275C25.0051 21.3241 25.0113 21.3204 25.0176 21.3168C25.0241 21.313 25.0304 21.3092 25.0367 21.3052C25.0428 21.3012 25.0485 21.2971 25.0543 21.2929C25.0605 21.2885 25.0665 21.284 25.0725 21.2793C25.0779 21.2749 25.0832 21.2705 25.0884 21.2659C25.0944 21.2607 25.1002 21.2554 25.1058 21.25C25.1106 21.2454 25.1153 21.2407 25.1199 21.2358C25.1256 21.2299 25.131 21.2238 25.1364 21.2176C25.1406 21.2127 25.1447 21.2078 25.1487 21.2028C25.1539 21.1962 25.1588 21.1894 25.1637 21.1825C25.1674 21.1774 25.1709 21.1722 25.1744 21.1669C25.179 21.1598 25.1834 21.1525 25.1876 21.1451C25.1908 21.1396 25.194 21.134 25.1969 21.1284C25.2008 21.121 25.2042 21.1134 25.2078 21.1058C25.2105 21.0997 25.2133 21.0937 25.2158 21.0874C25.2189 21.08 25.2214 21.0724 25.2241 21.0648C25.2264 21.0581 25.2289 21.0514 25.2309 21.0444C25.233 21.0372 25.2347 21.0297 25.2366 21.0223C25.2384 21.0148 25.2404 21.0074 25.2418 20.9997C25.2433 20.9923 25.2441 20.9848 25.2453 20.9772C25.2464 20.9694 25.2477 20.9618 25.2484 20.9539C25.2486 20.9527 25.2488 20.9517 25.2489 20.9505L25.4838 18.2377H27.9065C29.3427 18.2377 29.9905 18.9862 30.6762 19.7788C31.242 20.4327 31.8737 21.1623 32.9475 21.3403C32.8111 22.7907 32.5907 24.6526 32.492 25.4679ZM33.0276 20.3953C32.331 20.2525 31.9024 19.7599 31.3833 19.1599C30.7339 18.4095 29.9412 17.4938 28.4216 17.3232L28.6641 14.5225C31.1494 14.8922 33.063 17.0517 33.063 19.6528C33.063 19.8295 33.0498 20.0863 33.0276 20.3953Z" fill="#1F1F1F" stroke="#1F1F1F" stroke-width="0.2"/>
                    <path d="M12.6875 24.2109C11.7398 24.2109 10.9688 24.9865 10.9688 25.9399C10.9688 26.8932 11.7398 27.6688 12.6875 27.6688C13.6352 27.6688 14.4063 26.8932 14.4063 25.9399C14.4063 24.9866 13.6352 24.2109 12.6875 24.2109ZM12.6875 26.7257C12.2567 26.7257 11.9063 26.3732 11.9063 25.9399C11.9063 25.5065 12.2567 25.154 12.6875 25.154C13.1184 25.154 13.4688 25.5065 13.4688 25.9399C13.4688 26.3732 13.1183 26.7257 12.6875 26.7257Z" fill="#1F1F1F"/>
                    <path d="M27.2813 24.2109C26.3336 24.2109 25.5625 24.9865 25.5625 25.9399C25.5625 26.8932 26.3336 27.6688 27.2813 27.6688C28.229 27.6688 29.0001 26.8932 29.0001 25.9399C29.0001 24.9866 28.229 24.2109 27.2813 24.2109ZM27.2813 26.7257C26.8505 26.7257 26.5 26.3732 26.5 25.9399C26.5 25.5065 26.8505 25.154 27.2813 25.154C27.7121 25.154 28.0625 25.5065 28.0625 25.9399C28.0625 26.3732 27.7121 26.7257 27.2813 26.7257Z" fill="#1F1F1F"/>
                    <path d="M6.43816 13.5225H4.14649C3.88755 13.5225 3.67773 13.7336 3.67773 13.994C3.67773 14.2544 3.88755 14.4655 4.14649 14.4655H6.43816C6.6971 14.4655 6.90692 14.2544 6.90692 13.994C6.90692 13.7336 6.6971 13.5225 6.43816 13.5225Z" fill="#1F1F1F" stroke="#1F1F1F" stroke-width="0.2"/>
                    </svg>
                    <p>ارسال رایگان!</p>
            </div>
        </div>

    </div>
    

    <a style="border: solid;background-color: chartreuse;border-radius: 10px;
    padding: 2px 4px;position:fixed;top:20%;left:2%;" onclick="handleAClick(event, 'cart')" href='cart'><svg fill="#000000" height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 483.688 483.688" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M473.6,92.43c-8.7-10.6-21.9-16.5-35.6-16.5H140.7c-8.5,0-16.6,2.4-23.6,6.7l-15.2-53.1c-2.5-8.7-10.4-14.7-19.4-14.7H59.4 H15.3c-8.4,0-15.3,6.8-15.3,15.3v1.6c0,8.4,6.8,15.3,15.3,15.3h57.8l29.5,104.3l40.6,143.9c-23.1,5.8-40.2,26.7-40.2,51.5 c0,28.1,21.9,51.2,49.6,53c-2.3,6.6-3.4,13.9-2.8,21.4c2,25.4,22.7,45.9,48.1,47.6c30.3,2.1,55.6-22,55.6-51.8c0-6-1-11.7-2.9-17.1 h60.8c-2.5,7.1-3.5,15-2.6,23.1c2.8,24.6,23.1,44,47.9,45.8c30.3,2.1,55.7-21.9,55.7-51.8c0-28.9-24-52-52.8-52H156.5 c-9.9,0-18.3-7.7-18.7-17.5c-0.4-10.4,7.9-18.9,18.2-18.9h30.5h165.3h46.5c20.6,0,38.6-14.1,43.6-34.1l40.4-162.6 C485.8,117.83,482.6,103.53,473.6,92.43z M360.5,399.73c9.4,0,17.1,7.7,17.1,17.1s-7.7,17.1-17.1,17.1s-17.1-7.7-17.1-17.1 S351,399.73,360.5,399.73z M201.6,399.73c9.4,0,17.1,7.7,17.1,17.1s-7.7,17.1-17.1,17.1c-9.4,0-17.1-7.7-17.1-17.1 C184.5,407.43,192.1,399.73,201.6,399.73z M138.8,151.13l-7.8-27.5c-1.2-4.2,0.5-7.3,1.7-8.8c1.1-1.5,3.7-4,8-4h32.6l8.9,40.4 h-43.4V151.13z M148.6,185.93h41.2l8.2,37.4h-38.9L148.6,185.93z M186.5,293.53c-4.5,0-8.5-3-9.7-7.4l-7.9-28h36.7l7.8,35.3h-26.9 V293.53z M273.6,293.53H249l-7.8-35.3h32.3v35.3H273.6z M273.6,223.33h-40l-8.2-37.4h48.2V223.33z M273.6,151.13h-55.8l-8.9-40.4 h64.7V151.13z M336,293.53h-27.5v-35.3h34.9L336,293.53z M350.8,223.33h-42.3v-37.4h50.2L350.8,223.33z M308.5,151.13v-40.4h66 l-8.5,40.4H308.5z M408.2,285.93c-1.1,4.5-5.1,7.7-9.8,7.7h-26.8l7.5-35.3h36L408.2,285.93z M423.7,223.33h-37.3l7.9-37.4H433 L423.7,223.33z M448.5,123.23l-6.9,27.8h-40l8.5-40.4h28.6c4.3,0,6.8,2.4,7.9,3.9C447.8,116.03,449.6,119.13,448.5,123.23z"></path> </g> </g></svg></a>
`
    root.innerHTML = template
}

function removeFromCart(pId) {
    const foundIndex = CART.findIndex(item => item === pId)
    CART.splice(foundIndex, 1);
    localStorage.setItem("cart", JSON.stringify(CART))
    renderSingleProduct();
}

const addToCart = (pId) => {
    CART.push(pId);
    localStorage.setItem("cart", JSON.stringify(CART))
    renderSingleProduct();
}

function toggleMobileMenu() {
    mobileMenuContainer.classList.toggle("!hidden")
}
headerSlider.scrollLeft = headerSlider.scrollWidth

function animateHeaderSlider() {
    if (headerSlider.scrollLeft >= (headerSlider.scrollWidth / 2) * -1)
        headerSlider.scrollLeft = (headerSlider.scrollWidth * -1);
    else
        headerSlider.scrollLeft += 1
}

setInterval(animateHeaderSlider, 20);

function router() {
    let currentAddress = location.pathname;
    currentAddress = currentAddress.split('/').at(-1)

    switch (true) {
        case currentAddress === 'all-products':
            renderAllProducts()
            break;
        case currentAddress === 'index.html':
            renderMainPage();
            break;
        case (location.pathname.match(/[/]src[/]product[/][0-9]{1,}/) !== null):
            renderSingleProduct();
            break;
        case currentAddress === 'cart':
            renderCart();
            break;
        default:
            break;
    }


}

window.addEventListener("popstate", router)




var countDownDate = new Date("feb 30, 2025 15:37:25").getTime();
var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "FINISHED";
  }
}, 1000);


const red =document.getElementsByClassName("click");
red.addEventListener("click",()=>{
    red.classList.toggle("red-background");
});