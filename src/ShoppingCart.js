export default class ShoppingCart {
    constructor(){
        // initialize the shopping cart
        this.ss = null;
        this.initializeCart()
    }
    
    initializeCart () {
        if (typeof (Storage) != undefined){
            this.ss= sessionStorage;
        }  else {
            console.log('Cody says you need a new browser! boo');
            return
        }
    }
    
    addItemToCart(qty=0, item){
        if (this.ss == null ) {return};
        if (qty<=0) {return;}
        if (item == null || typeof (item)=='undefined') {return;}
        
        //console.log('the # of items in storage session is ' + this.ss.length);
        let numberOfItemsInCart = this.ss.length;
        
        // case: we're the 1st product
        if (numberOfItemsInCart == 0){
            this.ss.setItem(item.toString(), qty.toString());
            return;
        } else {
            let numMatches = 0;
            for (let theKey in this.ss) {
                console.log('the Key =' + theKey);
                if (theKey == item.toString()) {
                    // update quantity value;
                    let newValue = (parseInt(this.ss.getItem(theKey)) + parseInt(qty)).toString();
                    this.ss.setItem(theKey, newValue);
                    numMatches = 1;
                } else {
                    console.log('no match');
                }
            }
            if (numMatches == 0) {
                this.ss.setItem(item.toString(), qty.toString());
            }
        }
    }
    
    deleteItemFromCart(qty=0, item){        
        if (this.ss == null ) {return};
        if (qty<=0) {return;}
        if (item == null || typeof (item)=='undefined') {return;}
        // check for ss
        
        let numberOfItemsInCart = this.ss.length;
        if (numberOfItemsInCart == 0) {return;}
        // check that there are items
        let numMatches = 0;
        for (let theKey in this.ss){
            if (theKey == item.toString()) {
                // update quantity value;
                let newValue = (parseInt(this.ss.getItem(theKey)) - parseInt(qty)).toString();
                this.ss.setItem(theKey, newValue.toString());
                numMatches = 1; 
                // update the input value
                let currentInputValue = $('#input-'+theKey).attr('value');
                currentInputValue = currentInputValue - 1;
                $('#input-'+theKey).attr('value',currentInputValue);
                $('#input-'+theKey).val(currentInputValue);
                if (newValue == 0){
                    this.ss.removeItem(theKey);
                    $('#input-'+theKey).parent().remove();
                    break;
                    //return;
                }
            } else {
                console.log('no match');
            }
        }
        if (numMatches == 0) {return;}
    }
    
    updateCart(localCart, context) {
        console.log('you are in the update cart button function');
        for (var i=0; i<localCart.length; i++){
            let currentProduct = new Object( localCart[i] );
            console.log('currentProduct: '+currentProduct);
            //let currentProduct = localCart[i];
            let itemSku = currentProduct['sku'];
            console.log('itemSku: '+itemSku);
            //let itemSku = currentProduct.sku; *
            let newQty = currentProduct['qty'];
            console.log('quantity: '+newQty);
            for (let theKey in context.shoppingCart.ss){
                if (theKey == itemSku){
                    context.shoppingCart.ss.setItem(itemSku, newQty);
                } else {
                    console.log('not a match');
                } 
            }
        }   
    }  

    showCart(evt, context){
        //console.log('you made it to the shopping cart!');
        $('#content').html("");
        let cartContent = "";
        let cartQty = this.ss.length;
        //console.log('cart-Qty: '+cartQty);
        if (this.ss == null || cartQty<=0) {
            cartContent = "<li><b>You have no items in the shopping cart.</b></li>";
        }else {
            cartContent = "<h1>Shopping Cart</h1>";
            for(let theKey in this.ss){
                let criteriaFn = function(product){
                    return product['sku'] == theKey;
                };
                let result = context.products.filter(criteriaFn);
                console.log(result);
                let qty = parseInt(this.ss.getItem(theKey));
                console.log(qty);
                cartContent += "<li><img src='"+result[0].thumbnailImage+"' alt='"+result[0].name+"' title='"+result[0].name+"'><h2 class='prodName'>"+result[0].name+"</h2><p>$"+result[0].salePrice+"</p><input id='input-"+result[0].sku+"' data-sku='"+result[0].sku+"'type='number' value='"+qty+"'><button id='delete-"+result[0].sku+"' data-sku='"+result[0].sku+"'>Remove Item</button></li>"
            }
            $('#shoppingCartContent').append(cartContent);
            
            // SET UP LOCAL CART
            let localCart = [];
            localCart = setUpLocalCart();
            function setUpLocalCart(){
                let counter = 0;
                console.log(context.shoppingCart.ss);
                for (let theKey in context.shoppingCart.ss){
                    let qty = context.shoppingCart.ss.getItem(theKey);
                    localCart[counter] = {'sku': theKey, 'qty': qty};
                    counter++;
                }  
                return localCart;
            }
            //console.log(localCart);
            
            // ADDING EVENT HANDLERS
            for(let btnCount=0; btnCount<context.products.length; btnCount++){
                let currentItem = context.products[btnCount];
                // DELETE BUTTONS
                $("#delete-"+currentItem['sku']).on('click',null,{},function(event){
                    let item = $("#delete-"+currentItem['sku']).data('sku');
                    context.shoppingCart.deleteItemFromCart(1, item);
                })
                // TEXT FIELDS
                $('#input-'+currentItem['sku']).on('change',function(evt){
                    //console.log("you changed something");
                    let targetSku = $(evt.target).data('sku');
                    let grabbedValue = $(this).val();
                    //console.log(grabbedValue);
                   // TODO: need to change the input value='' to the .val
                    for(let iCount=0; iCount<localCart.length; iCount++){
                        let localCartItem = localCart[iCount];
                        if (localCartItem.sku == targetSku){
                            localCartItem.qty = grabbedValue;
                        }
                    } 
                    console.log(localCart);
                })
            }
            let updateBtn = "<button id='updateBtn'>Update Cart</button><button>Checkout</button>";
            $('#shoppingCartContent').append(updateBtn);
            $('#updateBtn').on('click',null,{localCart:localCart} ,function(event){
                context.shoppingCart.updateCart(event.data.localCart, context);
            })
        }
    }
}