import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: ''
});

const invokeLambda = (functionName, payload) => {
    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: functionName,
        Payload: JSON.stringify(payload),
    };
    return lambda.invoke(params).promise();
};