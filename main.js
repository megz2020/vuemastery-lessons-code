var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
      <div>
        <div>
        <div class="product flex-parent">
            <div class="product-image ">
                <img :src="image" alt="">
            </div>
            <div class="product-info">
                <h1> {{ title  }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else> Out of Stock</p>
                <p> Shipping:{{ shipping }} </p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants"
                     :key="variant.variantId"
                 class="color-box"
                :style="{background:variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>
                <div>
                <v-btn class="mx-2" fab dark  color="primary" 
                         v-on:click="removeFromCart"
                 >
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
       <v-btn class="mx-2" fab dark color="primary"
                      v-on:click="addToCart"
                        :disabled="!inStock">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
      </div>
            </div>
            </div>
            <div class="review-tab">
            <product-tabs  :reviews="reviews"></product-tabs>
            </div>
            <div>

            
</div>
        </div>
    </div>
    `,
    data(){
        return {
            brand: "Vue Mastery",
            product: 'Socks',
            selectedVariant:0,
            details: ["80% cotton", "20% polyester", "Gender-neutural"],
            variants: [
                {
                    variantId:2234,
                    variantColor: "green",
                    variantImage: "./asset/vmSocks-green-onWhite.jpg",
                    variantQuantity:10
                },
                {
                    variantId:2235,
                    variantColor: "blue",
                    variantImage: "./asset/vmSocks-blue-onWhite.jpg",
                    variantQuantity:0
                }
            ],
            reviews:[],

        }
    } ,
    methods: {
        addToCart(){
            this.$emit('cart-status', this.variants[this.selectedVariant].variantId,true)

        },
        removeFromCart(){
            this.$emit('cart-status', this.variants[this.selectedVariant].variantId,false)

        },
        updateProduct(index){

            this.selectedVariant = index

        },
    },
    computed : {
        title(){
            return this.brand + " " + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity

        },
        shipping(){
            if (this.premium){
                return "Free"
            }
            return 2.29
        }

    },
    mounted(){
        eventBus.$on('review-submitted', productReview =>{ this.reviews.push(productReview)
        } )

    }

})

Vue.component("product-review", {
    template: `
<form class="review-form" @submit.prevent="onSubmit">
<p v-if="errors.length">
<b>Please correct the flowing error(S)></b>
<ul>
<li v-for="error in errors">{{ error}}</li>
</ul>
</p>
<div class="reveiw-group">
<p class="form-group">
<label for="name">Name: </label>
<input id="name" v-model="name">
</p>
<p class="form-group">
<label for="review">Review: </label>
<textarea id="review" v-model="review" required></textarea>
</p>
<p class="form-group">
<label for="rating">Rating: </label>
<select id="rating" v-model.number="rating" >
  <option value="5">5</option>
  <option value="4">4</option>
  <option value="3">3</option>
  <option value="2">2</option>
   <option value="2">1</option>
</select>
</p>

<p>
<input type="submit" value="Submit">
</p>
</div>
</form>
    
    `,
    data() {
        return {
            name:null,
            review:null,
            rating:null,
            errors:[],
        }
    },
    methods:{
        onSubmit(){
            if(this.name && this.review && this.rating){
                let  productReview= {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit("review-submitted", productReview)
                this.name =null
                this.review = null
                this.rating =null

            }
            else {
                if(!this.name) this.errors.push("Name Required")
                if(!this.review) this.errors.push("Review Required")
                if(!this.rating) this.errors.push("Rating Required")
            }


        }
    }
})
Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: true
        }

},
    template: `
    <div >
    <span class="tab"
    :class="{activeTab: selectedTab === tab}"
    v-for="(tab, index) in tabs"
    :key="index"
    @click="selectedTab = tab"
    >
      <v-btn small color="primary" dark> {{ tab }} </v-btn>
    </span>
                <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet</p>
            <ul>
            <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>{{ review.review }}</p>
            <p>{{ review.rating }}</p>

            </li>
</ul>
</div>
<product-review v-show="selectedTab === 'Make a Review'"></product-review>

    </div>
    `,
    data(){
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        }
    }

})
var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),

    data: {
        premium : false,
        cart: [],

    },
    methods: {
        updateCart(id, add) {
            if(add) {
                this.cart.push(id)}
            else{
                this.cart.pop(id)}



        }


        },

})