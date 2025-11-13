import boto3
import os

_minio_client = boto3.client(
    "s3",
    endpoint_url=os.environ["MINIO_INTERNAL_URL"],
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
    return get_file_url(filename)


def get_file_url(filename):
    presigned_url = _minio_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": os.environ["MINIO_BUCKET_NAME"],
            "Key": filename,
        },
        ExpiresIn=3600,  # 1 hour
    )

    return presigned_url.replace(
        os.environ["MINIO_INTERNAL_URL"], os.environ["MINIO_PUBLIC_URL"]
    )
