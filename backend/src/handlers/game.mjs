import crypto from 'crypto';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const clientCreds = {
  endpoint: 'http://host.docker.internal:4566', 
  region: 'us-west-2', 
  forcePathStyle: true,
  aws_access_key_id: "anything",
  aws_secret_access_key: "anything"
}

function getResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    body: body,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Optional, for CORS
    }
  };
}

/**
 * @function gameHandler
 * @param {object} event - API Gateway Lambda event contains game board
 * @returns {object} response - returns board, id and success or error response
**/
export const gameHandler = async (event) => {
  try {
    // All log statements are written to CloudWatch LogGroupName Game
    console.info('received:', event);

    // create DynamoDB client & responses
    const client = new DynamoDBClient(clientCreds);

    

    const statusCode = errorMessages.length ? 400 : 200;
    const body = JSON.stringify({
      board: [],
      id: "",
      message: ""
    })
    
    console.info(`response from: ${event.path} statusCode: ${statusCode} body: ${body}`);
    const response = getResponse(statusCode, body);
    return response;
  } catch (error) {
    const errorMessage = `Unexpected error processing request: ${error.message}`;
    const body = JSON.stringify({
      board: [],
      id: "",
      message: errorMessage
    });
    console.error(errorMessage);
    return getResponse(400, body);
  }
};
