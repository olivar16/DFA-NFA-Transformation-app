var myItems = [];
app.controller("mainController", function($scope, $mdDialog){
	console.log("Controller activated");
	$scope.message="This is the message variable in the controller";
	$scope.data  = "This is the data!";
	$scope.alphabet = "";
	$scope.readonly=false;
	$scope.Q1 = [];
	$scope.E1 = [];
	$scope.q01 = "";
	$scope.F1 = [];
	$scope.Q2 = [];
	$scope.E2 = [];
	$scope.q02 = "";
	$scope.F2 = [];
	$scope.transformation="";
	myItems = $scope.myItems;
	$scope.data = ""
	$scope.subsetWarning = ""; //warning to say that start state must be subset
	$scope.transformedStateSet = "" ;
	$scope.transformedAlphabet = "";
	$scope.transformedDelta = "";
	$scope.transformedStartState = "";
	$scope.transformedAcceptStates = "";

	Intro = $mdDialog.alert()
        .title("Welcome to the DFA/NFA transformation application")
        .content("Please enter the formal description of the DFA's that you want to transform. If you are doing a Kleen* transformation, please fill in the description of L1.")
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

		if ($scope.validate() == false){

		invalidAlert = $mdDialog.alert()
        .title("Invalid DFA's")
        .content("Please ensure that accept states are a subset of the state set.")
        .ok('Close');

   		$mdDialog
          .show( invalidAlert )
          .finally(function() {
            alert = undefined;
          });
		}
		else if ($scope.transformation == ""){
			console.log("No transformation selected. Please select a transformation");
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
			console.log("UNION L1 U L2");

			//Create new start state that does epsilon transitions into start states of both DFA's
			var newStart = "";
			if ($scope.Q1.indexOf("q0")==-1 && ($scope.Q2.indexOf("q0")==-1)){
				newStart="q0";
			}
			else{
				newStart="qStart";
			}

			//Q = Q0 U Q1 U Q2
			//Q.push(newStart);
			//Q.push($scope.Q1, $scope.Q2);
			Q = Q.concat(newStart, $scope.Q1, $scope.Q2);
			console.log("Q: " + Q);
			Q = $scope.removeDuplicates(Q);
			$scope.transformedDescription += ("Q: " + Q + "\n");
			$scope.transformedStateSet = "Q: {" + Q + " }";

			//E = E1 U E2
			//E.push($scope.E1, $scope.E2);
			E = E.concat($scope.E1, $scope.E2);
			E = $scope.removeDuplicates(E);
			console.log("E: " + E);
			$scope.transformedAlphabet = "E: {" + E  + " }";

			//alpha = (qStart -> q01) U (qStart->q) U alpha1 U alpha2
			console.log("alpha: (" + newStart + "-> q01) U (" + newStart + "->q02) U alpha1 U alpha2");
			$scope.transformedDescription += ("alpha: (" + newStart + "-> q01) U (" + newStart + "->q02) U alpha1 U alpha2 <br>");
			$scope.transformedDelta = "D: (" + newStart + "-> q01) U (" + newStart + "->q02) U D1 U D2";

			//F = F1 U F2
			//F.push($scope.F1, $scope.F2);
			F = F.concat($scope.F1, $scope.F2);
			F = $scope.removeDuplicates(F);
			console.log("F is now " + F);
			$scope.transformedDescription += ("F: " + F + "<br>");
			$scope.transformedAcceptStates = "F: {" + F + "}";

			//start state = new start state that points to the start states of the former DFA's
			console.log("q0: " + newStart);
			$scope.transformedStartState = "q0: " + newStart;
			$scope.transformedDescription = ("q0: " + newStart + "<br>");

		}
		//CONCANTENATION
		else if ($scope.transformation=="Concatenation"){
			console.log("CONCANTENATION L1 . L2");
			//Q = Q0 U Q2
			//Q.push($scope.Q1, $scope.Q2);
			Q = Q.concat($scope.Q1, $scope.Q2);
			console.log("Q: " + Q);
			Q = $scope.removeDuplicates(Q);
			$scope.transformedStateSet = "Q: {" + Q + " }";

			//E = E1 U E2
			//E.push($scope.E1, $scope.E2);
			E = E.concat($scope.E1, $scope.E2);
			console.log("E: " + E);
			E = $scope.removeDuplicates(E);
			$scope.transformedAlphabet = "E: {" + E  + " }";

			//Point all accept states in F1 to q02
			console.log("alpha: " + "alpha2 U alpha2"); 
			$scope.transformedDelta = "D: " + "D1 U D2";
			for (var i = 0; i<$scope.F1.length; i++) {
				console.log(" U " + $scope.F1[i] + "->" + $scope.q02);
				$scope.transformedDelta += " U " + $scope.F1[i] + "->" + $scope.q02;
			};

			
			//Point all accept states in F1 to q02
			// console.log("alpha: " + "alpha2 U alpha2"); 
			// for (var i = 0; i<$scope.F1.length; i++) {
			// 	console.log(" U " + $scope.F1[i] + "->" + $scope.q02);
			// };
		

			//F = F2
			console.log("F: " + $scope.F2)
			$scope.transformedAcceptStates = "F: { " + $scope.F2 + "}";

			//start state is start state of first DFA
			console.log("q0: " + $scope.q01);
			$scope.transformedStartState = "q0: " + $scope.q01;

		}
		else if ($scope.transformation=="Kleen*"){
			console.log("Doing Kleen* transformation");
			
			//Create new start state that does epsilon transitions into start states of both DFA's
			var newStart = "";
			if ($scope.Q1.indexOf("q0")==-1 && ($scope.Q2.indexOf("q0")==-1)){
				newStart="q0";
			}
			else{
				newStart="qStart";
			}

			//L1*

			//Q = Q1
			console.log("Q1: " + newStart + " U " + $scope.Q1);
			$scope.transformedStateSet = "Q1: " + newStart + " U " + "{ " + $scope.Q1 + " } ";

			//E = E1
			console.log("E1: " + $scope.E1);
			$scope.transformedAlphabet = "E1: " + "{ " + $scope.E1 + " }";

			//Alpha: Point all accept states in F1 to q02
			console.log("alpha: " + "alpha1"); 
			$scope.transformedDelta = "D: " + "D1";
			for (var i = 0; i<$scope.F1.length; i++) {
				$scope.transformedDelta += " U " + $scope.F1[i] + "->" + $scope.q01;
			};


			//F1 = newStart U F1
			console.log("F1: " + newStart + " U " + $scope.F1);
			$scope.transformedAcceptStates = "F1: " + "{ " + newStart + " }" + " U " + "{ " + $scope.F1 + " }";

			//q01 = q01
			console.log("q01: " + $scope.q01);
			$scope.transformedStartState = "q01: " + newStart;

			//L2*

			//Q = Q1
			console.log("Q2: " + newStart + " U " + $scope.Q2);

			//E = E1
			console.log("E2: " + $scope.E2);

			//Alpha: Point all accept states in F1 to q02
			console.log("alpha: " + "alpha1"); 
			for (var i = 0; i<$scope.F2.length; i++) {
				console.log(" U " + $scope.F2[i] + "->" + $scope.q02);
			};

			//F2 = newStart U F2
			console.log("F2: " + newStart + " U " + "{ " + $scope.F2 + " }");

			//q01 = q01
			console.log("q02: " + $scope.q01);
		}


	}


	$scope.removeDuplicates = function(transformedSet){
		console.log("Set parameter is " + transformedSet);
		console.log("Removing duplicates");
		var unique = [];

		//Ensure state set is unique
		for (var i  = 0; i < transformedSet.length; i++){
			if (unique.indexOf(transformedSet[i]) == -1){
				console.log(transformedSet[i] + " not in unique");
				unique.push(transformedSet[i]);
			}
		}
		console.log("Unique set is " + unique);

		return unique;
		
	}
	
	$scope.validate = function(){
		
		console.log("validating");

		if ($scope.Q1.length==0 || $scope.Q2.length==0){
			return false;
		}

		//L1
		console.log("F1 is " + $scope.F1);
		console.log("Q1 is " + $scope.Q1);
		var FsubsetCheck = true;
		//check that accept states are subset of state set
		for (var i = 0;i<$scope.F1.length; i++){
			if ($scope.Q1.indexOf($scope.F1[i])==-1){
				console.log($scope.F1[i] + "not a part of Q1");
				FsubsetCheck = false;
				return false;
				break;
			}
		}

		//chek 
		
		if (FsubsetCheck == true){
			console.log("F1 is a subset of Q1");
			valid  = true;
		}
		else{
			console.log("F1 is not a subset of Q1");
			valid = false;
		}
		
		//L2
		console.log("F2 is " + $scope.F2);
		console.log("Q2 is " + $scope.Q2);
		for (var i = 0;i<$scope.F2.length; i++){
			if ($scope.Q2.indexOf($scope.F2[i])==-1){
				console.log($scope.F2[i] + "not a part of Q2");
				FsubsetCheck = false;
				return false
				break;
			}
		}
		
		if ($scope.Q1.indexOf($scope.q01) == -1 || $scope.Q2.indexOf($scope.q02) == -1){
			return false;
		}

		return true;
	}
	
	//Ensure that given start states are part of state set
	$scope.subsetCheck = function(checkType, arrayToCheck, element){
		
		if (checkType=="startState"){
		if (arrayToCheck.indexOf(element) == -1){
			$scope.subsetWarning = "Start state must be part of Q";
		}
		else{
			console.log("q is part of Q!");
			$scope.subsetWarning="";
		}
		}
		else if (checkType=="acceptState"){
			
			console.log("validating acceptState input");
			
			for(var i = 0; i<arrayToCheck.length;i++){
				console.log(arrayToCheck[i]);
			}
			
		}
		
		
		console.log("model changed");
		
	}
});