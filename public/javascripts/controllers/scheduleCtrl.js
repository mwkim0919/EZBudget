angular.module('EZBudget').controller('scheduleController',
  ['$scope', '$location', 'moment', 'calendarConfig', 'scheduleService',
  function($scope, $location, moment, calendarConfig, alert, scheduleService') {
  	
    var actions = [{
  		label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
  		onClick: function(args) {
  			$('#schedule-edit-form').modal('toggle');
  		}
  	}, {
  		label: '<i class=\'glyphicon glyphicon-remove\'></i>',
  		onClick: function(args) {

  		}
  	}];

    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    $scope.cellIsOpen = true;
    $scope.categories = ['info', 'important', 'warning', 'inverse', 'special', 'success'];

    $scope.checkErr = function(startDate, endDate, startTime, endTime) {
      $scope.errMessage = '';
      $scope.err = false;
      if(startDate <= endDate) {
        if (startTime > endTime) {
          $scope.err = true;
          $scope.errMessage = 'End Date should be greater than start date';
          return false;
        }
      } else {
        $scope.err = true;
        $scope.errMessage = 'End Date should be greater than start date';
        return false;
      }
      return true;
    }

    $scope.schedules = [];
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
   $scope.getSchedules = function() {
      scheduleService.getSchedules()
        .then(function(response) {
          if (response.data.obj.length != 0) {
            for (var i = 0; i < response.data.obj.length; i++) {
              var schedule = {
                id: response.data.obj[i]._id,
                title: response.data.obj[i].title,
                color: response.data.obj[i].category,
                startsAt: response.data.obj[i].startDate,
                endsAt: response.data.obj[i].endDate,
                description: response.data.obj[i].description,
              }
              $scope.schedules.push(schedule);
            }
          }    
        })
        .catch(function() {
          // DO something
        });
    };
    var dateParts = $scope.sdate.split('-');
            var timeParts = $scope.stime.split(':');
            if(dateParts && timeParts) {
                dateParts[1] -= 1;
                $scope.fullDate = new Date(Date.UTC.apply(undefined,dateParts.concat(timeParts))).toISOString(

    $scope.addSchedule = function(schedule) {
      if (schedule.startTime) {
        var start = new Date(
          schedule.startDate.getFullYear(), 
          schedule.startDate.getMonth(), 
          schedule.startDate.getDate(),
          schedule.startTime.getHours(),
          schedule.startTime.getMinutes()
        );
      }
      if (schedule.endTime) {
        var end = schedule.endDate + schedule.endTime;
      }
    };

}]);