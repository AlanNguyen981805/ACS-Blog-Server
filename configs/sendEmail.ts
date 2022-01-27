const nodemailer = require('nodemailer')
import { OAuth2Client } from "google-auth-library";


const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const CLIENT_ID = `988937493398-jd19q8sh4ga85jho4nku6la1gh4hnq03.apps.googleusercontent.com`
const CLIENT_SECRET = `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`
const REFRESH_TOKEN = `1//047iEfigOoPytCgYIARAAGAQSNwF-L9Iroa4mZjTaygUJ-5Y5oz5B84xTpyCjxO5XcN8Nuuvw54CvaWgsr3fLnA5Q85i-Kng2PI8`
const SENDER_MAIL = `hiepdev.js@gmail.com`

const sendEmail = async (to: string, url: string, txt: string) => {
    const oAuth2Client = new OAuth2Client(
        CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGROUND
    )

    oAuth2Client.setCredentials({ refresh_token: '1//047iEfigOoPytCgYIARAAGAQSNwF-L9Iroa4mZjTaygUJ-5Y5oz5B84xTpyCjxO5XcN8Nuuvw54CvaWgsr3fLnA5Q85i-Kng2PI8' })
    
    try {
        const access_token = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: SENDER_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                access_token,
            },
        })

        const mailOption = {
            from: SENDER_MAIL,
            to: to,
            subject: 'ACS Company',
            html: `
                <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DevAT channel.</h2>
                <p>Congratulations! You're almost set to start using BlogDEV.
                    Just click the button below to validate your email address.
                </p>
                
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
            
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
            
                <div>${url}</div>
                </div>
            `
        }

        const result = await transport.sendMail(mailOption)
        return result
    } catch (error) {
        console.log(error)   
    }

}

export default sendEmail