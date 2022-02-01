<?php
	// Get info as PHP object
	$inData = getRequestInfo();

	$id = $inData["ID"];
	$userId = $inData["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];

	$conn = new mysqli("localhost", "user16", "Group16", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		// Query to determine whether a contact exists with this set of IDs
		// This might not be necessary
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ss", $id, $userId);
		$stmt->execute();

		$result = $stmt->get_result();
		$stmt->close();

		if ($result->fetch_assoc())
		{
			// Query to update row with provided values
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?,LastName=?,Email=?,Phone=? WHERE ID=? AND UserID=?");
			$stmt->bind_param("ssssss", $firstName, $lastName, $email, $phone, $id, $userId);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}
		else
		{
			returnWithError("No Matching Records Found");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>