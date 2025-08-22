# Serverless Tic-Tac-Toe Game

This project is a full-stack serverless tic-tac-toe game where players compete against an intelligent computer opponent. The AI is designed to never lose, it will either win or force a draw. Built using AWS Serverless Application Model (SAM), the application features a React-based frontend for gameplay and AWS Lambda functions for game logic and AI decision-making. For local testing and development, the project uses [LocalStack](https://github.com/localstack/localstack) to emulate AWS services such as API Gateway and DynamoDB.

---

## Project Structure

- **/backend/src**: Lambda function source code for game logic and AI algorithms.
- **/frontend/src**: React frontend code for the interactive tic-tac-toe game interface.
- **template.yaml**: AWS SAM template defining Lambda, API Gateway, and DynamoDB resources.
- **README.md**: Project documentation and setup instructions.

---

## Features

- **RESTful API**: API Gateway provides endpoints for game moves and AI responses.
- **Intelligent Computer Opponent**: Computer that implements optimal tic-tac-toe strategy using minimax algorithm. The computer opponent will never lose - it either wins or forces a draw.
- **CloudWatch Logging**: All Lambda logs are sent to CloudWatch for monitoring and debugging.

---

## Prerequisites

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js 22+](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [LocalStack](https://github.com/localstack/localstack)
- [LocalStack AWS CLI (awslocal)](https://docs.localstack.cloud/aws/integrations/aws-native-tools/aws-cli/#localstack-aws-cli-awslocal)

---

## Steps to run locally

```bash
1. Run Docker Desktop app

2. Open terminal 

3. localstack start

4. awslocal dynamodb create-table --table-name GameTable --key-schema AttributeName=id,KeyType=HASH --attribute-definitions AttributeName=id,AttributeType=S --billing-mode PAY_PER_REQUEST --region us-west-2

6. Open new terminal tab

7. cd backend

8. npm install

9. cd ../

10. sam build

11. sam local start-api

12. Open new terminal tab 

13. cd frontend

14. npm install

15. npm start

16. In the browser play the game

17. Open new terminal tab

19. awslocal dynamodb scan --table-name GameTable --region us-west-2

