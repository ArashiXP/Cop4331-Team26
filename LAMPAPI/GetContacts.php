
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
        $stmt = $conn->prepare("SELECT userid, name, phone, email FROM Contacts WHERE UserID=?");
        $stmt->bind_param("i", $userid);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $result->num_rows > 0 ) {
            while ($row = $result->fetch_assoc())
            {
                returnWithInfo($row['userid'], $row['name'], $row['phone'], $row['email']);
            }
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
