// REQUIRE
const config = require("config");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
require('dotenv').config();

module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
    var add_user_module = {

        // Start of verify_user_details module
        verify_user_details: function (client_token, callBack) {
            try {    
                    if (client_token.startsWith('Bearer ')) {
                        client_token = client_token.slice(7, client_token.length);
                    }

                    // If client token exists, then verify it
                    if (client_token) {
                        jwt.verify(client_token, config.get('secret'), (err, decoded) => {
                            if (err) {
                                callBack(null, true, "Invalid token");
                            } else {
                                const user_id = decoded.data[0]._id;
                                callBack(user_id, false, "Token Verified");
                            }
                        });
                    }
                
            } catch (error) {
                callBack(null, true, error);
            }
        },
        // End of verify_user_details module

        // Start of add_user module
        add_user: function (new_user, callBack) {
            try {
                db.db().collection(dbb.USERDETAILS).insertOne(new_user, function (err, response) {
                        if (err) {
                            callBack(null, true, "User cannot be added");
                        } else {
                            callBack(response, false, "User added successfully");
                        }     
                });
            } catch (error) {
                callBack(null, true, error);
            }
        },
        // End of add_user module

        // Start of check an existing google user
        check_existing_google_user: function (googleID, callBack) {
            try {
                db.db().collection(dbb.USERDETAILS).find({
                    "googleID": googleID
                }).toArray((err, response) => {
                    if (err) {
                        callBack(null, true, "Google user already exists");  
                    } else {
                        if (response.length > 0)
                            callBack(null, true, "Google user already exist");
                        else 
                            callBack(null, false, "Google user does not exist");
                    }
                });
            } catch (error) {
                callBack(null, true, error);
            }
        },   
        // End of check an existing google user

        // Start of send_mail module
        send_mail: function (receiver_name, receiver_email, callBack) {
            const OAuth2 = google.auth.OAuth2;
            const oauth2_client = new OAuth2(
                process.env.client_id,
                process.env.client_secret,
                process.env.redirect_url
            );

            oauth2_client.setCredentials({
                 refresh_token: process.env.refresh_token
            });

            const access_token = oauth2_client.getAccessToken();

            const smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                     type: "OAuth2",
                     user: process.env.user,
                     clientId: process.env.client_id,
                     clientSecret: process.env.client_secret, 
                     refreshToken: process.env.refresh_token,
                     accessToken: access_token
                }
            });
            
            const mailOptions = {
                from: process.env.user,
                to: receiver_email,
                subject: "User Added",
                generateTextFromHTML: true,
                html: `Hello ${receiver_name}, <br/> You have been added as a new user. <br/>Regards, <br/>API Documentation Tool`
            };
            
            smtpTransport.sendMail(mailOptions, (err, response) => {
                if (err) {
                    callBack(null, true, "Mail not sent");      
                } else {
                    callBack(null, false, "Mail sent and user added");
                }
            });
        }
        // End of send_mail module
    }
    return add_user_module;
}