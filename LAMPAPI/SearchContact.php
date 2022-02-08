<?php
	// Get info as PHP object
   	$inData = getRequestInfo();

	$search = $inData["search"];
   	$userID = $inData["userID"];
	
	// breaks down search into first name and last name
	list($firstName, $lastName) = explode(" ", $search); // added this line because when searching for a full name, API endpoint was not working

	// searchResults will be a stringified, comma-separated list of JSON objects
   	$searchResults = "";
   	$searchCount = 0;

	$conn = new mysqli("localhost", "user16", "Group16", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		// Query to locate matching rows
		// Matches on any first or last name containing
		// the search string at any position
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName,Email,Phone FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
		$search = "%" . $search . "%";
		$stmt->bind_param("sss", $firstName, $lastName, $userID);
		$stmt->execute();
		$result = $stmt->get_result();

		while ($row = $result->fetch_assoc())
		{
			if ($searchCount > 0)
			{
				$searchResults .= ",";
			}

			$searchCount++;

			// Append current row as single JSON object
			// I'm pretty sure this is wildly inefficient
			// and would scale horribly
			$searchResults .= '{';
			$searchResults .= '"id":' . $row["ID"] . ',';
			$searchResults .= '"firstName":"' . $row["FirstName"] . '",';
			$searchResults .= '"lastName":"' . $row["LastName"] . '",';
			$searchResults .= '"email":"' . $row["Email"] . '",';
			$searchResults .= '"phone":"' . $row["Phone"]. '"';
			$searchResults .= '}';
		}

		if ($searchCount == 0)
		{
			returnWithError("No Records Found");
		}
		else
		{
			returnWithInfo($searchResults);
		}

		$stmt->close();
		$conn->close();
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

 	function returnWithInfo( $searchResults )
	{
		// Return search results as array of JSON objects
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
