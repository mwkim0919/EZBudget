angular.module('EZBudget').controller('scheduleController',
  ['$scope', '$location', 'moment', 'calendarConfig', 'scheduleService',
  function($scope, $location, moment, calendarConfig, scheduleService) {
  	
    var actions = [{
  		label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
  		onClick: function(args) {
        fetchSchedule(args.calendarEvent.id);
  			$('#schedule-edit-form').modal('toggle');
  		}
  	}, {
  		label: '<i class=\'glyphicon glyphicon-remove\'></i>',
  		onClick: function(args) {
        removeSchedule(args.calendarEvent.id);
  		}
  	}];

    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    $scope.cellIsOpen = true;
    $scope.categories = ['blue', 'red', 'yellow', 'black', 'purple', 'green'];
    $scope.colors = [];
    $scope.colors['blue'] = calendarConfig.colorTypes.info;
    $scope.colors['red'] = calendarConfig.colorTypes.important;
    $scope.colors['yellow'] = calendarConfig.colorTypes.warning;
    $scope.colors['black'] = calendarConfig.colorTypes.inverse;
    $scope.colors['purple'] = calendarConfig.colorTypes.special;
    $scope.colors['green'] = calendarConfig.colorTypes.success;
    
    $scope.eventClicked = function(event) {
      fetchSchedule(event.id);
      $('#schedule-edit-form').modal('toggle');
    }

    $scope.checkErr = function(startDate, endDate, startTime, endTime) {
      $scope.errMessage = '';
      $scope.err = false;
      if(startDate <= endDate) {
        if (startTime > endTime) {
          $scope.err = true;
          $scope.errMessage = 'End Date should be greater than Start Date';
          return false;
        }
      } else {
        $scope.err = true;
        $scope.errMessage = 'End Date should be greater than Start Date';
        return false;
      }
      $scope.err = false;
      return true;
    };

    $scope.schedules = [];
    $scope.upcomingEvents = [];
    
    $scope.getSchedules = function() {
      scheduleService.getSchedules()
        .then(function(response) {
          if (response.data.obj.length != 0) {
            for (var i = 0; i < response.data.obj.length; i++) {
              var schedule = {
                id: response.data.obj[i]._id,
                title: response.data.obj[i].title,
                color: $scope.colors[response.data.obj[i].category],
                startsAt: new Date(response.data.obj[i].startDate),
                endsAt: new Date(response.data.obj[i].endDate),
                description: response.data.obj[i].description,
                actions: actions,
              };
              $scope.schedules.push(schedule);
            }
          }
          $scope.upcomingEvents = getUpcoming($scope.schedules);    
        })
        .catch(function() {
          // DO something
        });
    };

    $scope.closeUpcoming = function(index) {
      $scope.upcomingEvents.splice(index, 1);
    };

    $scope.addSchedule = function(schedule) {
      var start, end, allday;
      if (schedule.startTime) {
        start = new Date(
          schedule.startDate.getFullYear(), 
          schedule.startDate.getMonth(), 
          schedule.startDate.getDate(),
          schedule.startTime.getHours(),
          schedule.startTime.getMinutes()
        );
      } else {
        start = schedule.startDate;
      }
      if (schedule.endTime) {
        end = new Date(
          schedule.endDate.getFullYear(), 
          schedule.endDate.getMonth(), 
          schedule.endDate.getDate(),
          schedule.endTime.getHours(),
          schedule.endTime.getMinutes()
        );
      } else {
        end = schedule.endDate;
      }
      if (!schedule.startTime && !schedule.endTime) {
        allday = true;
      }
      scheduleService.addSchedule(schedule.title, schedule.category, start, end, schedule.description)
        .then(function(response) {
          var schedule = {
            id: response.data.obj._id,
            title: response.data.obj.title,
            color: $scope.colors[response.data.obj.category],
            startsAt: start,
            endsAt: end,
            allday: allday,
            description: response.data.obj.description,
            actions: actions
          };
          $scope.schedules.push(schedule);

          $scope.upcomingEvents = getUpcoming($scope.schedules);

          $('#schedule-form').modal('toggle');
          $scope.schedule = {};
        })
        .catch(function() {

        });
    };

    $scope.editSchedule = function(id) {
      var start, end;
      if ($scope.scheduleEdit.startTime) {
        start = new Date(
          $scope.scheduleEdit.startDate.getFullYear(), 
          $scope.scheduleEdit.startDate.getMonth(), 
          $scope.scheduleEdit.startDate.getDate(),
          $scope.scheduleEdit.startTime.getHours(),
          $scope.scheduleEdit.startTime.getMinutes()
        );
      } else {
        start = $scope.scheduleEdit.startDate;
      }
      if ($scope.scheduleEdit.endTime) {
        end = new Date(
          $scope.scheduleEdit.endDate.getFullYear(), 
          $scope.scheduleEdit.endDate.getMonth(), 
          $scope.scheduleEdit.endDate.getDate(),
          $scope.scheduleEdit.endTime.getHours(),
          $scope.scheduleEdit.endTime.getMinutes()
        );
      } else {
        end = $scope.scheduleEdit.endDate;
      }
      scheduleService.editSchedule(
        id, 
        $scope.scheduleEdit.title, 
        $scope.scheduleEdit.category,
        start, 
        end, 
        $scope.scheduleEdit.description
        )
        .then(function(response) {
          var editedSchedule = $scope.schedules.filter(function (schedule) {
            return schedule.id == id;
          });
          // UPDATE THE TABLE
          editedSchedule[0].title = $scope.scheduleEdit.title;
          editedSchedule[0].color.primary = $scope.colors[$scope.scheduleEdit.category].primary;
          editedSchedule[0].color.secondary = $scope.colors[$scope.scheduleEdit.category].secondary;
          editedSchedule[0].startsAt = start;
          editedSchedule[0].endsAt = end;
          editedSchedule[0].description = $scope.scheduleEdit.description;

          $scope.upcomingEvents = getUpcoming($scope.schedules);

          // RESET
          $scope.scheduleEdit = {};
          $('#schedule-edit-form').modal('toggle');
          $location.path('/schedules');
        })
        .catch(function() {

        });
    };

    function removeSchedule(id) {
      scheduleService.removeSchedule(id)
        .then(function(response) {
          // REMOVE THE DATA FROM TRANSACTIONS ARRAY
          $scope.schedules = $scope.schedules.filter(function(obj) {
            return obj.id != id;
          });

          $scope.upcomingEvents = getUpcoming($scope.schedules);
        })
        .catch(function() {

        });
    };

    function fetchSchedule(id) {
      var result = $scope.schedules.filter(function (schedule) {
        return schedule.id == id;
      });
      var start = new Date(JSON.parse(JSON.stringify(result[0].startsAt)));
      var end = new Date(JSON.parse(JSON.stringify(result[0].endsAt)));
      $scope.scheduleEdit = {
        id: result[0].id,
        title: result[0].title,
        color: result[0].color,
        startDate: start,
        startTime: start,
        endDate: end,
        endTime: end,
        description: result[0].description,
      };
    };

    function getUpcoming(arr) {
      var result = [];
      console.log(typeof(arr[0].startsAt), arr[0].startsAt);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].startsAt > new Date()) {
          var upcoming = {
            type: getType(arr[i].startsAt - new Date()),
            title: arr[i].title,
            start: arr[i].startsAt,
          }
          result.push(upcoming);
        }
      }
      return result;
    }

    function getType(dif) {
      if (dif < 8.64e+7) {
        return 'danger';
      } else if (dif < 2.592e+8) {
        return 'warning';
      } else {
        return 'info';
      }
    }
}]);