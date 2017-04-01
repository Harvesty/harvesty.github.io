var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        apiUrl: 'data/base.json'
    },
    ready: function () {
        this.getCustomers()
    },
    methods: {
        getCustomers: function () {
            this.$http.get(this.apiUrl)
                .then((response) => {
                    this.$set('message', response.data)
                })
                .catch(function (response) {
                    console.log(response)
                })
        }
    }
})