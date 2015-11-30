
app.controller("mainController", function($scope, $mdDialog){
	$scope.Q1 = [];
	$scope.E1 = [];
	$scope.q01 = "";
	$scope.F1 = [];
	$scope.Q2 = [];
	$scope.E2 = [];
	$scope.q02 = "";
	$scope.F2 = [];
	$scope.transformation="";
	$scope.subsetWarning = ""; //warning to say that start state must be subset
	$scope.transformedStateSet = "" ;
	$scope.transformedAlphabet = "";
	$scope.transformedDelta = "";
	$scope.transformedStartState = "";
	$scope.transformedAcceptStates = "";

	Intro = $mdDialog.alert()
        .title("Welcome to Paul's NFA transformation app")
        .content("Please enter the formal description of the NFA's that you want to transform. If you are doing a Kleene* transformation, please fill in the description of L1.")
        .ok('Close');

    $mdDialog
          .show( Intro )
          .finally(function() {
            alert = undefined;
          });


	$scope.transform = function(){
		
		var Q=[];
		var F=[];
		var E=[];

		if ($scope.validate() == false && $scope.transformation!="Kleene*"){

		invalidAlert = $mdDialog.alert()
        .title("Invalid NFA's")
        .content("Please ensure that accept states are a subset of the state set.")
        .ok('Close');

   		$mdDialog
          .show( invalidAlert )
          .finally(function() {
            alert = undefined;
          });
		}
		else if ($scope.transformation == ""){
		noTransformationAlert = $mdDialog.alert()
        .title("No transformation selected")
        .content("Please select a transformation.")
        .ok('Close');

   		$mdDialog
          .show( noTransformationAlert )
          .finally(function() {
            alert = undefined;
          });
		}
		//UNION
		else if ($scope.transformation=="Union"){

			//Create new start state that does epsilon transitions into start states of both DFA's
			var newStart = "";
			if ($scope.Q1.indexOf("q0")==-1 && ($scope.Q2.indexOf("q0")==-1)){
				newStart="q0";
			}
			else{
				newStart="qStart";
			}

			//Q = newStart U Q1 U Q2
			Q = Q.concat(newStart, $scope.Q1, $scope.Q2);
			Q = $scope.removeDuplicates(Q);
			$scope.transformedDescription += ("Q: " + Q + "\n");
			$scope.transformedStateSet = "Q: { " + Q + " }";

			//E = E1 U E2
			E = E.concat($scope.E1, $scope.E2);
			E = $scope.removeDuplicates(E);
			$scope.transformedAlphabet = "E: { " + E  + " }";

			//alpha = (qStart -> q01) U (qStart->q) U alpha1 U alpha2
			$scope.transformedDescription += ("alpha: (" + newStart + "->"+ $scope.q01 + ") U (" + newStart + "->" + $scope.q02 +") U alpha1 U alpha2 <br>");
			$scope.transformedDelta = ("D: (" + newStart + "->"+ $scope.q01 + ") U (" + newStart + "->" + $scope.q02 +") U D1 U D2");

			//F = F1 U F2
			F = F.concat($scope.F1, $scope.F2);
			F = $scope.removeDuplicates(F);
			$scope.transformedDescription += ("F: " + F + "<br>");
			$scope.transformedAcceptStates = "F: { " + F + " }";

			//start state = new start state that points to the start states of the former NFA's
			$scope.transformedStartState = "q0: " + newStart;
			$scope.transformedDescription = ("q0: " + newStart + "<br>");

		}
		//CONCANTENATION
		else if ($scope.transformation=="Concatenation"){

			//Q = Q1 U Q2
			Q = Q.concat($scope.Q1, $scope.Q2);
			Q = $scope.removeDuplicates(Q);
			$scope.transformedStateSet = "Q: { " + Q + " }";

			//E = E1 U E2
			//E.push($scope.E1, $scope.E2);
			E = E.concat($scope.E1, $scope.E2);
			E = $scope.removeDuplicates(E);
			$scope.transformedAlphabet = "E: { " + E  + " }";

			//Point all accept states in F1 to q02
			$scope.transformedDelta = "D: " + "D1 U D2";
			for (var i = 0; i<$scope.F1.length; i++) {
				console.log(" U " + $scope.F1[i] + "->" + $scope.q02);
				$scope.transformedDelta += " U " + $scope.F1[i] + "->" + $scope.q02;
			};


			//F = F2
			$scope.transformedAcceptStates = "F: { " + $scope.F2 + " }";

			//start state is start state of first DFA
			$scope.transformedStartState = "q0: " + $scope.q01;

		}
		else if ($scope.transformation=="Kleene*"){
			
			//Create new start state that does epsilon transitions into start states of both DFA's
			var newStart = "";
			if ($scope.Q1.indexOf("q0")==-1 && ($scope.Q2.indexOf("q0")==-1)){
				newStart="q0";
			}
			else{
				newStart="qStart";
			}

			//Q = Q1
			$scope.transformedStateSet = "Q1: " + newStart + " U " + "{ " + $scope.Q1 + " } ";

			//E = E1
			$scope.transformedAlphabet = "E1: " + "{ " + $scope.E1 + " }";

			//Alpha: Point all accept states in F1 to q02
			$scope.transformedDelta = "D: " + "D1" + " U " + newStart + "->" + $scope.q01 ;
			for (var i = 0; i<$scope.F1.length; i++) {
				$scope.transformedDelta += " U " + $scope.F1[i] + "->" + $scope.q01;
			};

			//F1 = newStart U F1
			$scope.transformedAcceptStates = "F1: " + "{ " + newStart + " }" + " U " + "{ " + $scope.F1 + " }";

			//q01 = q01
			$scope.transformedStartState = "q01: " + newStart;
		}


	}


	$scope.removeDuplicates = function(transformedSet){

		//Unique set to be returned
		var unique = [];

		//Ensure state set is unique
		for (var i  = 0; i < transformedSet.length; i++){
			if (unique.indexOf(transformedSet[i]) == -1){
				console.log(transformedSet[i] + " not in unique");
				unique.push(transformedSet[i]);
			}
		}

		return unique;
		
	}
	
	$scope.validate = function(){
		
		//Check if state sets are empty
		if ($scope.Q1.length==0 || $scope.Q2.length==0){
			return false;
		}

		//L1

		//Check if accept states are subset of state set
		for (var i = 0;i<$scope.F1.length; i++){
			if ($scope.Q1.indexOf($scope.F1[i])==-1){
				return false;
				break;
			}
		}

		
		//L2
		for (var i = 0;i<$scope.F2.length; i++){
			if ($scope.Q2.indexOf($scope.F2[i])==-1){
				return false
				break;
			}
		}
		
		//Check if start states are in state set
		if ($scope.Q1.indexOf($scope.q01) == -1 || $scope.Q2.indexOf($scope.q02) == -1){
			return false;
		}

		return true;
	}
	
});