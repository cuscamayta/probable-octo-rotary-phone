app.directive('listModal', function($ionicModal, $location) {
    return {
        restrict: 'E',
        scope: {
            listData: '=',
            placeholder: '@',
            label: '@',
            itemSelected: '=',
            actionLoad: '&?',
            valuetext: '=',
            model: '='
        },
        template: '<label class="item item-input item-stacked-label" >' +
        '<span class="input-label">{{label}} :</span>' +
        '<input type="text"   placeholder="{{placeholder}}" ng-model="valuetext" name="selectModal" ng-click="opendateModal()"  readonly>' +
        '</label>',
        link: function($scope, element, attrs) {
            $ionicModal.fromTemplateUrl('./templates/directives/listModal.html',
                function(modal) {
                    $scope.listModal = modal;
                }, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }
            );
            $scope.opendateModal = function() {
                if ($scope.actionLoad) $scope.actionLoad({ item: $scope.itemSelected });
                if ($scope.listData && $scope.listData.length)
                    $scope.listModal.show();
                else {
                    toastr.warning("There is not data for display.")
                }

            };

            $scope.hideModal = function() {
                $scope.listModal.hide();
            };

            $scope.setItemSelected = function(item) {
                $scope.model = item;
                $scope.listModal.hide();
            }

            $scope.acceptItem = function() {
                $scope.listModal.hide();
            }

        }
    }
})
