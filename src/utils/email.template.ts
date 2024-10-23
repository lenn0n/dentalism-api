export const generateHTMLForLogin = ({ login_link } : { login_link: string}) => {

  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .header h1 {
      color: #2d8ccf;
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px 0;
      text-align: left;
      color: #333333;
    }
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.6;
    }
    .content a {
      display: inline-block;
      padding: 10px 20px;
      color: #ffffff;
      background-color: #2d8ccf;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LOGIN TO DENTALISM</h1>
    </div>
    <div class="content">
      <p>Dear Valued Customer,</p>
      <p>We have received your request to access your account on the Dentalism platform. For your convenience, we have provided you with a secure link to log in to your account. Please note that this link is unique to your request and is time-sensitive, so we recommend using it as soon as possible to avoid any disruptions in accessing your account.</p>
      <p>To proceed, simply click the button below, which will redirect you to our secure login page where you can enter your credentials and continue using the Dentalism services.</p>
      <p><a href="${login_link}" target="_blank">Access Your Account</a></p>
      <p>As a reminder, for your security and privacy, please do not share this link with anyone else. Sharing your login link may compromise the security of your personal information. If you did not request this login or feel that this email has been sent to you in error, please disregard it or contact our support team immediately for assistance.</p>
      <p>Thank you for trusting Dentalism with your dental care needs, and we look forward to continuing to serve you.</p>
    </div>
    <div class="footer">
      <p>If you have any questions or require further assistance, please feel free to reach out to our customer support team.</p>
    </div>
  </div>
</body>
</html>

  `
}


export const generateHTMLForBooking = ({ login_link } : { login_link: string}) => {

  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .header h1 {
      color: #2d8ccf;
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px 0;
      text-align: left;
      color: #333333;
    }
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.6;
    }
    .content a {
      display: inline-block;
      padding: 10px 20px;
      color: #ffffff;
      background-color: #2d8ccf;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BOOKING WITH DENTALISM</h1>
    </div>
    <div class="content">
      <p>Dear Valued Customer,</p>
      <p>Congratulations! Your appointment has been successfully booked. For your convenience, we have provided you with a secure link to log in to your account. Please note that this link is unique to your request and is time-sensitive, so we recommend using it as soon as possible to avoid any disruptions in accessing your account.</p>
      <p>To proceed, simply click the button below, which will redirect you to our secure login page where you can enter your credentials and continue using the Dentalism services.</p>
      <p><a href="${login_link}" target="_blank">Access Your Account</a></p>
      <p>As a reminder, for your security and privacy, please do not share this link with anyone else. Sharing your login link may compromise the security of your personal information. If you did not request this login or feel that this email has been sent to you in error, please disregard it or contact our support team immediately for assistance.</p>
      <p>Thank you for trusting Dentalism with your dental care needs, and we look forward to continuing to serve you.</p>
    </div>
    <div class="footer">
      <p>If you have any questions or require further assistance, please feel free to reach out to our customer support team.</p>
    </div>
  </div>
</body>
</html>

  `
}