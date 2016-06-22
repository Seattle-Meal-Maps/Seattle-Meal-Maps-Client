'use strict'

const angular = require('angular');
require('angular-route');

angular.module('FoodApp', ['ngRoute'])
  .controller('MapController', ['$http', function($http) {
    let vm = this;
    vm.message = 'loading...';
    vm.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    // vm.mapOptions = {
    //     zoom: 4,
    //     center: new google.maps.LatLng(40.0000, -98.0000),
    //     mapTypeId: google.maps.MapTypeId.TERRAIN
    // }
    // vm.map = new google.maps.Map(document.getElementById('map'), vm.mapOptions);

    vm.getInfo = function() {
      $http.get('https://fb-mp-api.herokuapp.com/api/v1/services/')
        .then((res) => {
          vm.message = res.data;
        }, err => console.log('GET ERROR! ', err))
    }
  }])
