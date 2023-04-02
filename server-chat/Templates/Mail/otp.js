module.exports = (name, otp) => {
  return `
  <!DOCTYPE HTML>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="date=no">
    <meta name="format-detection" content="telephone=no">
    <style type="text/CSS"></style>
    <style @import url('https://dopplerhealth.com/fonts/BasierCircle/basiercircle-regular-webfont.woff2');></style>
    <title></title>
    <!--[if mso]>
    <style>
      table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
      div, td {padding:0;}
      div {margin:0 !important;}
    </style>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      table,
      td,
      div,
      h1,
      p {
        font-family: 'Basier Circle', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      }
  
      @media screen and (max-width: 530px) {
        .unsub {
          display: block;
          padding: 8px;
          margin-top: 14px;
          border-radius: 6px;
          background-color: #FFEADA;
          text-decoration: none !important;
          font-weight: bold;
        }
  
        .button {
          min-height: 42px;
          line-height: 42px;
        }
  
        .col-lge {
          max-width: 100% !important;
        }
      }
  
      @media screen and (min-width: 531px) {
        .col-sml {
          max-width: 27% !important;
        }
  
        .col-lge {
          max-width: 73% !important;
        }
      }
    </style>
  </head>
  
  <body style="margin:0;padding:0;word-spacing:normal;background-color:#FDF8F4;">
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#FDF8F4;">
      <table role="presentation" style="width:100%;border:none;border-spacing:0;">
        <tr>
          <td align="center" style="padding:0;">
            <!--[if mso]>
            <table role="presentation" align="center" style="width:600px;">
            <tr>
            <td>
            <![endif]-->
            <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:'Basier Circle', 'Roboto', 'Helvetica', 'Arial', sans-serif;font-size:1em;line-height:1.37em;color:#384049;">
              <!--      Logo headder -->
              <tr>
                <td style="padding:40px 30px 30px 30px;text-align:center;font-size:1.5em;font-weight:bold;">
                <a href="https://github.com/imsagarkheni/Sagar" target="_blank">
                <img align="center" border="0" src="https://media.licdn.com/dms/image/C560BAQEaEblV_yqOjg/company-logo_200_200/0/1632923521522?e=2147483647&v=beta&t=cltdJEBYBx_LuLvH52cd2C8zW71mhMQGrKAR3NVzgEE" alt="Sagar" title="Sateeq Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 19%;max-width: 106.4px;"
                  width="106.4" />
              </a>
                </td>
              </tr>
              <!--      Intro Section -->
              <tr>
                <td style="padding:30px;background-color:#ffffff;">
                  <h1 style="margin-top:0;margin-bottom:1.38em;font-size:1.953em;line-height:1.3;font-weight:bold;letter-spacing:-0.02em;">Welcome to Chatzzy</h1>
                  <p style="margin:0;">Hi ${name},</p>
                  <p>OTP for verification is ${otp}.</p>
                  <p>Note: This OTP is valid for next 10 mins.</p>
                 
                  <p>Thanks & Regards
                  Team Chatzzy</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;text-align:center;font-size: 0.75em;background-color:#ffeada;color:#384049;border: 1em solid #fff;">
                  <p style="font-size: 14px; line-height: 170%;">Love 💙 Team Chatzzy</p>
                  <p style="margin:0;font-size:.75rem;line-height:1.5em;text-align: center;">
                  For any assistance and queries write to us at </p>
                  <p style="font-size: 14px; line-height: 170%;"><a rel="noopener" href="mailto:sagarkheni34@gmail.com?" target="_blank">sagarkheni34@gmail.com</a><br /><br /></p>
                </td>
              </tr>
            </table>
            <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </div>
  </body>
  
  </html>
    `;
};