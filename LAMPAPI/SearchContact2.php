<?php

   	$inData = getRequestInfo();


	// $search = $inData["search"];
   	$userID = $inData["userID"];
    $str = "%" . $inData["search"] . "%"; //using wildcards

   	$searchResults = "";
   	$searchCount = 0;

	$conn = new mysqli("localhost", "user16", "Group16", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
        // If empty string in the search field, return all contact of userID
        if($inData["search"] == "")
        {
            $stmt = $conn->prepare("SELECT ID,FirstName,LastName,Email,Phone FROM Contacts WHERE UserID=?");
            $stmt->bind_param("i", $userID);
        }
        else
        {
            $stmt = $conn->prepare("SELECT ID,FirstName,LastName,Email,Phone FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
            $stmt->bind_param("ssi", $str, $str, $userID);
        }

        $stmt->execute();
		$result = $stmt->get_result();

        while ($row = $result->fetch_assoc())
		{
			if ($searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
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



		// // Query to locate matching rows
		// // Matches on any first or last name containing
		// // the search string at any position
		// $stmt = $conn->prepare("SELECT ID,FirstName,LastName,Email,Phone FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
		// // $search = "%" . $search . "%";
		// $stmt->bind_param("sss", $search, $search, $userID);
		// // $stmt->bind_param("sss", $firstName, $lastName, $userID);
		// $stmt->execute();
		// $result = $stmt->get_result();

		// while ($row = $result->fetch_assoc())
		// {
		// 	if ($searchCount > 0)
		// 	{
		// 		$searchResults .= ",";
		// 	}

		// 	$searchCount++;

		// 	// Append current row as single JSON object
		// 	// I'm pretty sure this is wildly inefficient
		// 	// and would scale horribly
		// 	$searchResults .= '{';
		// 	$searchResults .= '"id":' . $row["ID"] . ',';
		// 	$searchResults .= '"firstName":"' . $row["FirstName"] . '",';
		// 	$searchResults .= '"lastName":"' . $row["LastName"] . '",';
		// 	$searchResults .= '"email":"' . $row["Email"] . '",';
		// 	$searchResults .= '"phone":"' . $row["Phone"]. '"';
		// 	$searchResults .= '}';
		// }

		// if ($searchCount == 0)
		// {
		// 	returnWithError("No Records Found");
		// }
		// else
		// {
		// 	returnWithInfo($searchResults);
		// }

		// $stmt->close();
		// $conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

 	function returnWithInfo( $searchResults )
	{
		// Return search results as array of JSON objects
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}