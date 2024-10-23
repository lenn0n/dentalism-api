import { generateHash, signToken } from "@hooks/useJWT";
import useNodeMailer from "@hooks/useNodeMailer"
import {
  retrieveData,
  insertData
} from "@services/mongo.service"
import { generateHTMLForLogin } from "@utils/email.template"

type loginWithPasswordProp = { password: string, expiresIn?: string }

export const loginWithPassword = ({ password, expiresIn }: loginWithPasswordProp) => {
  if (btoa(password) !== btoa(process.env.PASSWORD as string) || !password) {
    return false
  }
  const userPublicData = {
    hash: btoa(String(process.env.ACCESS_TOKEN_SECRET))
  }
  let tokenOptions = {
    expiresIn: expiresIn || '24h'
  }
  return signToken({ payload: userPublicData, options: tokenOptions})
}

export const sendEmailMessage = async ({ sendTo, subject, html }: any) => {
  const { sendEmail } = await useNodeMailer({
    sendTo,
    subject,
    html,
  })
  return await sendEmail();
}

export const loginWithEmailService = async (email: string) => {
  // GENERATE HASH
  const hash = await generateHash(email)
  if (!hash) {
    return {
      code: 400,
      json: { message: "Failed to create hash." }
    }
  }

  // INSERT TO DATABASE
  const results = await insertData({
    collection: 'hashes',
    data: [{ 
      hash, 
      email,
      date: new Date()
    }]
  })

  // PREPARE FOR SENDING LOGIN LINK TO USER EMAIL ADDRESS
  if (results) {
    const loginLink = `${process.env.FRONTEND_CALLBACK_URI}?hash=${hash}`
    const messageStatus = await sendEmailMessage({
      sendTo: email,
      subject: 'Login via Email',
      html: generateHTMLForLogin({ login_link: loginLink }),
    })

    if (!messageStatus) {
      return {
        code: 400,
        json: { message: "There was an error occurred when sending you email." }
      }
    } else {
      return {
        code: 200,
        json: { message: 'The login link was successfully sent to your email address.' }
      }
    }

  } else {
    return {
      code: 500,
      json: { message: "An error occured while trying to fulfill your request." }
    }
  }
}

export const generateTokenService = async (hash: string) => {
  // CHECK IF HASH IS IN THE DATABASE
  const results = await retrieveData({
    collection: 'hashes',
    find: { hash },
    limit: 1
  })

  // GENERATE JWT 
  if (results.length > 0) {
    const email = results[0].email;
    const user_id = await retrieveOrCreateUser(email)
    
    let tokenOptions = {
      expiresIn: '24h'
    }

    const token = signToken({ payload: { email, user_id }, options: tokenOptions})
    return {
      code: 200,
      json: { token }
    }
  } else {
    return {
      code: 400,
      json: { message: "Unable to verify hash. Please request access again." }
    }
  }
}

export const retrieveOrCreateUser = async (email: string) => { 
  const userProfile = await retrieveData({
    collection: 'users',
    find: { email },
    limit: 1
  })
  
  if (userProfile?.length > 0){
    return String(userProfile[0]._id).replace("new ObjectId('", "").replace("')", "")
  } else {
    return await insertData({
      collection: 'users',
      data: [{ 
        email,
      }]
    }).then((data:any) => {
      return String(data.insertedIds['0']).replace("new ObjectId('", "").replace("')", "")
    }
    )
  }
}