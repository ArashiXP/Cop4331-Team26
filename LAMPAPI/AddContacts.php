
<?php

	$inData = getRequestInfo();
	
	$userid = $inData["userid"];
	$name = $inData["name"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$isValid = true;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		global $isValid;
		validateInformation($conn, $userid, $name, $phone, $email, $isValid);

		if ($isValid)
		{
			$stmt = $conn->prepare("INSERT into Contacts (userid, name, phone, email) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("isss", $userid, $name, $phone, $email);
			$stmt->execute();

			returnWithInfo($userid, $name, $phone, $email);

			$stmt->close();
		}
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

	function returnWithInfo( $userid, $name, $phone, $email )
	{
		$retValue = '{"userid":' . $userid . ',"name":"' . $name . '","phone":"' . $phone .
			'","email":"'  . $email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function validateInformation( $conn, $userid, $name, $phone, $email, $isValid )
	{
		global $isValid;
		//validation for user ID
		$stmt = $conn->prepare("SELECT Login FROM Users WHERE ID=?");
		$stmt->bind_param("i", $userid);
		$stmt->execute();
		$result = $stmt->get_result();
		if( !($result->fetch_assoc())  )
		{
			returnWithError("Invalid UserID");
			$isValid = false;
		}
		//validation for phone number
		if(!preg_match('/^\d{3}-\d{3}-\d{4}$/', $phone))
		{
			returnWithError("Invalid Phone Number");
			$isValid = false;
		}
		//validation for email address
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
		{
			returnWithError("Invalid Email Address");
			$isValid = false;
		}
		$stmt->close();
	}
	
?>
