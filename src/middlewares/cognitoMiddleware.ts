const { CognitoJwtVerifier } = require("aws-jwt-verify");
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } = process.env;

if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) {
    throw new Error("Missing required .env variables: COGNITO_USER_POOL_ID and/or COGNITO_CLIENT_ID");
}
const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",                  
  clientId: COGNITO_CLIENT_ID,            
});



export const validateCognitoToken = async (req:AuthRequest, res:Response, next:NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autorización requerida. Token Bearer ausente.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifier.verify(token);

    req.user = payload; 
    console.log("Token verificado con éxito. Payload:", payload);
    
    next();

  } catch (error) {
    console.error("Error al verificar el token de Cognito:", (error as Error).message);
    return res.status(401).json({ error: 'Token inválido o expirado. Acceso denegado.' });
  }
};