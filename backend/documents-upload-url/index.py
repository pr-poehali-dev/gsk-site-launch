import json
import os
import uuid
import boto3

BUCKET = 'files'
CDN_BASE = f"https://cdn.poehali.dev/projects/{os.environ.get('AWS_ACCESS_KEY_ID', '')}/bucket"

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
}


def handler(event: dict, context) -> dict:
    """Генерирует presigned URL для прямой загрузки файла в S3."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    file_name = body.get('file_name', 'document.bin')
    content_type = body.get('content_type', 'application/octet-stream')

    ext = file_name.rsplit('.', 1)[-1] if '.' in file_name else 'bin'
    key = f"documents/{uuid.uuid4().hex}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': BUCKET, 'Key': key, 'ContentType': content_type},
        ExpiresIn=300,
    )

    cdn_url = f"{CDN_BASE}/{key}"

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'upload_url': presigned_url, 'cdn_url': cdn_url, 'key': key}),
    }
