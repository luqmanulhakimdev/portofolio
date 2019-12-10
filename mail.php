<?php

$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$content = "From: $name - $email \nMessage: $message";
$recipient = "luqmanulhakim.dev@gmail.com";
$subject = "Portfolio - Contact: $subject";
$mailheader = "From: $email \r\n";

mail($recipient, $subject, $content, $mailheader) or die("Error!");
header("Location: index.html");