angular.module('EZBudget').component('signin', {
	template: 'Hello, {{$ctrl.user}}!',
	controller: function GreetUserController() {
		this.user = 'world';
	}
});