<?php
	// Get info as PHP object
	$inData = getRequestInfo();
	
	$contactID = $inData["ID"];
	// $FirstName = $inData["FirstName"];
	// $LastName = $inData["LastName"];
	// $Email = $inData["Email"];
	// $Phone = $inData["Phone"];
	
	$conn = new mysqli("localhost", "user16", "Group16", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// SQL statement to remove an entry from Contacts table
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
		$stmt->bind_param("i", $contactID);
		$stmt->execute();
		$stmt->close();
		
		$conn->close();

		returnWithError("");
	}
	

	function getRequestInfo()
	{
        // Takes the raw data from the request. 
        $json = file_get_contents('php://input');

        // Converts it into PHP object
        $data = json_decode($json, true);

        return $data;
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
