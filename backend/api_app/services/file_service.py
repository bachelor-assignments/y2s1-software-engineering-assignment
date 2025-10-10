import boto3
import os
from django.conf import settings

_minio_client = boto3.client(
    "s3",
    endpoint_url=f"http://{os.environ['MINIO_CONTAINER_NAME']}:9000",  # 9000 is MinIO's internal container port
    aws_access_key_id=os.environ["MINIO_ROOT_USER"],
    aws_secret_access_key=os.environ["MINIO_ROOT_PASSWORD"],
)


def upload_file_to_minio(file_obj, filename):
    try:
        _minio_client.head_bucket(Bucket=os.environ["MINIO_BUCKET_NAME"])
    except _minio_client.exceptions.ClientError:
        _minio_client.create_bucket(Bucket=os.environ["MINIO_BUCKET_NAME"])

    _minio_client.upload_fileobj(
        Fileobj=file_obj,
        Bucket=os.environ["MINIO_BUCKET_NAME"],
        Key=filename,
        ExtraArgs={"ContentType": file_obj.content_type},
    )
    return f"http://{os.environ['MINIO_CONTAINER_NAME']}/{os.environ['MINIO_BUCKET_NAME']}/{filename}"
