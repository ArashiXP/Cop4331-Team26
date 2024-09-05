
<?php

	$inData = getRequestInfo();
	
	$userid = $inData["userid"];
	$name = $inData["name"];
	$phone = $inData["phone"];
	$email = $inData["email"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (userid, name, phone, email) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("isss", $userid, $name, $phone, $email);
		$stmt->execute();

		returnWithInfo($userid, $name, $phone, $email);

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

	function returnWithInfo( $userid, $name, $phone, $email )
	{
		$retValue = '{"userid":' . $userid . ',"name":"' . $name . '","phone":"' . $phone .
			'","email":"'  . $email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
