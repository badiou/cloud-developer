import { SignedUrlRequest } from '../requests/SignedUrlRequest';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

export default class TodosStorage {
    constructor(
      
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'})
    ) {}

    getPresignedUploadURL(SignedUrlRequest: SignedUrlRequest) {
        return this.s3.getSignedUrl('putObject', SignedUrlRequest);
    }
}
