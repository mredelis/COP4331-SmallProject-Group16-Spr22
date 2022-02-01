<?php
	$inData = getRequestInfo();
	
	// $userID = $inData["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
    $password = $inData["password"];
	
	$conn = new mysqli("localhost", "user16", "Group16", "COP4331");
	
	if ($conn->connect_error) {
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// SQL statement to search for duplicate username
		// $sqlquery= "SELECT Login FROM Users WHERE Login = ?"; 
		$stmt = $conn->prepare("SELECT Login FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();

		$result = $stmt->get_result();

		if ($result->fetch_assoc())
		{
			$stmt->close();
			$conn->close();
			returnWithError("Username already taken");
		}
		else
		{
			$stmt->close();

			// SQL statement to add User
			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
			
		}
	}


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}


	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
?>
