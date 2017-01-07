angular.module('myApp').
controller('HelloController', HelloController);

function HelloController() {
    console.log('Hello');
    this.message = 'Hello World!';
}
