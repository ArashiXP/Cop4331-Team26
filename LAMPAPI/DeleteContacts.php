
<?php

    $inData = getRequestInfo();

    $id = $inData["id"];
    $isValid = true;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        global $isValid;
        validateInformation($conn, $id, $isValid);

        if ($isValid)
        {
            $stmt = $conn->prepare("DELETE from Contacts WHERE ID=(?)");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            returnWithInfo( $id );
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

    function returnWithInfo( $id )
    {
        $retValue = '{"id":' . $id . ',"error":"successfully deleted"}';
        sendResultInfoAsJson( $retValue );
    }

    function validateInformation( $conn, $id, $isValid )
    {
        global $isValid;
        //validation for ID
        $stmt = $conn->prepare("SELECT name FROM Contacts WHERE ID=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if( !($result->fetch_assoc())  )
        {
            returnWithError("Invalid ID");
            $isValid = false;
        }
        $stmt->close();
    }

?>