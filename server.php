<?php
    $name = $_POST['user-name'];
    $phone = $_POST['user-phone'];
    $comment = $_POST['comment'];
    $mail_message = '
    <html>
        <head>
            <title>Заказ на бургер</title>
        </head>
        <body>
            <h2>Заказ</h2>
            <ul>
                <li>Имя: ' . $name . '</li>
                <li>Телефон: ' . $phone . '</li>
                <li>Комментарии к заказу: ' . $comment . '</li>
            </ul>
        </body>
    </html>';

    $headers = "From: Заказ с сайта мебели\r\n".
    "MIME-Version: 1.0" . "\r\n" .
    "Content-type: text/html; charset=UTF-8" . "\r\n";
    $mail = mail('timberwolf.max@gmail.com', 'Заказ', $mail_message, $headers);
    $data = [];
    if ($mail) {
        $data['status'] = "OK";
        $data['mes'] = "Письмо успешно отправлено";
    }else{
        $data['status'] = "NO";
        $data['mes'] = "На сервере произошла ошибка";
    }
    echo json_encode($data);
?>