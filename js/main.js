Vue.component('v-select', VueSelect.VueSelect);

new Vue({
    el: '#app',
    data() {
        return{
            options: [],
            room: [],
            selectedRoom: "",
            hotelsList: [],
            namesOfHotels: [],
            namesOfCountries: [],
            descriptions: [],
            countries: [],
            selectCountry: '',
            numberOfStars: [],
            numberOfReviews: 0,
            prices: [],
            rangeValue: 0,
            filteredHotels: [],
            noHotels: "Записей не найдено",
            areThereHotels: true,
            onlyThreeItems: [],
            eventPriceRange: false,
        }
    },
    mounted() {
        //запрос базы отелей
        fetch('./hotels/hotels.json')
            .then(response => response.json())
            .then((response)=>{

                var hotels = response.hotels;
                var prices = [];
                this.hotelsList = hotels;
                this.filteredHotels = hotels;
                this.onlyThreeItems = this.filteredHotels.slice(0, 3);
                for(var i = 0; i < hotels.length; i++){

                    this.pushIfNotContains(this.room, hotels[i], 'type');
                    this.pushIfNotContains(this.options, hotels[i], 'country');
                    this.pushIfNotContains(this.countries, hotels[i], 'country');
                    this.pushIfNotContains(prices, hotels[i], 'min_price');

                }
                prices.sort();
                if(!this.prices.includes(prices[0]) && !this.prices.includes(prices[prices.length - 1])) {
                    this.prices.push(prices[0]);
                    this.prices.push(prices[prices.length - 1]);
                    this.rangeValue = this.prices[0];
                }
            }).catch(error => console.log("Error while getting base" + error));
    },
    methods:{
        //функция добавляет свойство объекта/объект в массив, если такой позиции в массиве еще нет
    	pushIfNotContains: function(arr, obj, sub){
    	    if(sub){
                if(!arr.includes(obj[sub])){
                    return arr.push(obj[sub]);
                }
            } else{
                if(!arr.includes(obj)){
                    return arr.push(obj);
                }
            }
    	},
        //функции фильтров по различным опциям
        filterByCountries: function() {
            var filtered = [];
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].country.includes(this.selectCountry)){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        filterByRooms: function() {
            var filtered = [];
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].type.includes(this.selectedRoom)){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        filterByStars: function() {
            var filtered = [];
            var stars = this.numberOfStars.sort();
            for(var i = 0; i < this.hotelsList.length; i++){
                for(var j = 0; j < stars.length; j++){
                    if(this.hotelsList[i].stars === Number(stars[j])){
                        filtered.push(this.hotelsList[i]);
                    }
                }
            }
            return (stars.length) ? filtered : this.hotelsList;
        },
        filterByPrice: function() {
            var filtered = [];
            if(this.eventPriceRange){
                var price = this.rangeValue;
            } else{
                var price = this.prices[1];
            }
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].min_price <= price){
                    filtered.push(this.hotelsList[i]);
                }
            }

            return (filtered.length) ? filtered : this.hotelsList;
        },
        filterByReviewNumber: function() {
            var filtered = [];
            var reviewNumber = this.numberOfReviews;
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].reviews_amount >= reviewNumber){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        //функция, собирающая позиции со всех фильтров и возвращающая результат
        totalFilter: function(){
            this.areThereHotels = true;
            var filteredByCountries = this.filterByCountries();
            var filteredByRooms = this.filterByRooms();
            var filteredByStars = this.filterByStars();
            var filteredByReviewNumber = this.filterByReviewNumber();
            var filteredByPrice = this.filterByPrice();
            var arrayOfFilteredResults = [filteredByCountries, filteredByRooms, filteredByStars, filteredByReviewNumber, filteredByPrice];
            var result = [];
            checkResultInAllFilters: for(var i = 0; i < this.hotelsList.length; i++){
                for(var j = 0; j < arrayOfFilteredResults.length; j++){
                    if(!arrayOfFilteredResults[j].includes(this.hotelsList[i])){
                        continue checkResultInAllFilters;
                    }
                }
                this.pushIfNotContains(result, this.hotelsList[i]);

            }
            this.filteredHotels = [];
            result.length ? this.filteredHotels = result : this.areThereHotels = false;
            this.firstPage();
        },
        firstPage: function(){
            this.onlyThreeItems = this.filteredHotels.slice(0, 3);
        },
        nextPage: function(){
            this.onlyThreeItems = this.filteredHotels.slice(3, 6);
        },
        clearAll:  function(){
            this.selectedRoom = "";
            this.selectCountry = '';
            this.numberOfStars = [];
            this.numberOfReviews = 0;
            this.rangeValue = this.prices[0];
            this.filteredHotels = this.hotelsList;
            this.areThereHotels = true;
            this.firstPage();
            this.eventPriceRange = false;
        }
    }
}).$mount('#app');