<?php

$inData = getRequestInfo();

$userid = $inData["userid"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("SELECT id, userid, name, phone, email FROM Contacts WHERE UserID=?");
    $stmt->bind_param("i", $userid);
    $stmt->execute();
    $result = $stmt->get_result();

    $contacts = array(); // Array to hold all contacts

    if( $result->num_rows > 0 ) {
        while ($row = $result->fetch_assoc())
        {
            $contacts[] = $row; // Push each row (contact) into the contacts array
        }
        sendResultInfoAsJson($contacts); // Encode the array of contacts as JSON
    }
    else
    {
        returnWithError("No Records Found");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj); // Encode the object as JSON
}

function returnWithError( $err )
{
    $retValue = array("error" => $err);
    sendResultInfoAsJson( $retValue );
}

?>
