<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];
    $isValid = true;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        global $isValid;
        validateInformation($conn, $login, $isValid);

        if($isValid)
        {
            $stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();

            $result = $stmt->get_result();
            returnWithInfo($firstName, $lastName, $login, $password);


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

    function returnWithInfo( $firstName, $lastName, $login, $password)
    {
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":"' . $login . '","password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
    function validateInformation( $conn, $login, $isValid )
    {
        global $isValid;
        //validation for username
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();
        if( $result->fetch_assoc() )
        {
            returnWithError("Username already taken!");
            $isValid = false;
        }
        $stmt->close();
    }

?>