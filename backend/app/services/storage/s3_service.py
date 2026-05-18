import logging
import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        self.bucket = settings.S3_BUCKET
        self.cdn_url = settings.CLOUDFRONT_URL
        if settings.AWS_ACCESS_KEY_ID:
            self.client = boto3.client("s3", region_name=settings.AWS_REGION,
                                       aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                       aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        else:
            self.client = None

    async def upload_bytes(self, data: bytes, key: str, content_type: str = "application/octet-stream") -> str:
        if not self.client:
            logger.info(f"S3 mock: {key}")
            return f"https://storage.orto-ia.com.br/{key}"
        try:
            self.client.put_object(Bucket=self.bucket, Key=key, Body=data, ContentType=content_type)
            if self.cdn_url:
                return f"{self.cdn_url}/{key}"
            return f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
        except ClientError as e:
            logger.error(f"S3 error: {e}")
            return f"https://storage.orto-ia.com.br/{key}"
