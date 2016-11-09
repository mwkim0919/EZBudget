angular.module('EZBudget').controller('scheduleController',
  ['$scope', '$location', 'moment', 'calendarConfig',
  function($scope, $location, moment, calendarConfig, alert) {
  	
    var actions = [{
  		label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
  		onClick: function(args) {
  			$('#schedule-edit-form').modal('toggle');
  			// alert.show('Edited', args.calendarEvent);
  		}
  	}, {
  		label: '<i class=\'glyphicon glyphicon-remove\'></i>',
  		onClick: function(args) {
  			// alert.show('Deleted', args.calendarEvent);
  		}
  	}];

    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    $scope.cellIsOpen = true;
    $scope.categories = ['info', 'important', 'warning', 'inverse', 'special', 'success'];
    
    $scope.checkScheduleForm = function(start, end) {
      $scope.errMsg = '';
      if ($scope.schedule.startDate < $scope.schedule.endDate) {
        $scope.errMsg = 'End date must be later than start date.';
        $scope.disabled = true;
        return false;
      } else {
        $scope.disabled = false;
        return true;
      }
    }

  	// $scope.events = [
   //    {
   //      title: 'An event',
   //      color: calendarConfig.colorTypes.warning,
   //      startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
   //      endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
   //      draggable: true,
   //      resizable: true,
   //      actions: actions
   //    }, {
   //      title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
   //      color: calendarConfig.colorTypes.info,
   //      startsAt: moment().subtract(1, 'day').toDate(),
   //      endsAt: moment().add(5, 'days').toDate(),
   //      draggable: true,
   //      resizable: true,
   //      actions: actions
   //    }, {
   //      title: 'This is a really long event title that occurs on every year',
   //      color: calendarConfig.colorTypes.important,
   //      startsAt: moment().startOf('day').add(7, 'hours').toDate(),
   //      endsAt: moment().startOf('day').add(19, 'hours').toDate(),
   //      recursOn: 'year',
   //      draggable: true,
   //      resizable: true,
   //      actions: actions
   //    }
   //  ];


}]);