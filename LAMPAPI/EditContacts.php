<?php

    $inData = getRequestInfo();

    $userid = $inData["userid"];
    $contactid = $inData["contactid"];
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
        // Validate that the contact exists and belongs to the user
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE id=? AND userid=?");
        $stmt->bind_param("ii", $contactid, $userid);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $result->num_rows == 0 )
        {
            returnWithError("Contact not found or does not belong to the user");
        }
        else
        {
            // Update the contact information
            $stmt = $conn->prepare("UPDATE Contacts SET name=?, phone=?, email=? WHERE id=? AND userid=?");
            $stmt->bind_param("sssii", $name, $phone, $email, $contactid, $userid);
            $stmt->execute();
            
            if ($stmt->affected_rows > 0)
            {
                returnWithInfo($contactid, $userid, $name, $phone, $email);
            }
            else
            {
                returnWithError("No changes were made");
            }

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

    function returnWithInfo( $contactid, $userid, $name, $phone, $email )
    {
        $retValue = '{"contactid":' . $contactid . ',"userid":' . $userid . ',"name":"' . $name . '","phone":"' . $phone . '","email":"'  . $email . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>
