import json
import os
import base64
import uuid
import psycopg2
import boto3
from datetime import datetime

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p1160872_gsk_site_launch')
BUCKET = 'files'
CDN_BASE = f"https://cdn.poehali.dev/projects/{os.environ.get('AWS_ACCESS_KEY_ID', '')}/bucket"

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
}


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Управление документами ГСК: загрузка файлов в S3 и хранение метаданных в БД."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, category, file_url, file_size, uploaded_at FROM {SCHEMA}.documents ORDER BY uploaded_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        docs = [
            {
                'id': r[0],
                'name': r[1],
                'category': r[2],
                'file_url': r[3],
                'file_size': r[4],
                'uploaded_at': r[5].strftime('%d.%m.%Y') if r[5] else '',
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'documents': docs}, ensure_ascii=False)}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '').strip()
        category = body.get('category', 'Прочее').strip()
        file_data = body.get('file_data', '')
        file_name = body.get('file_name', 'document')
        content_type = body.get('content_type', 'application/octet-stream')

        if not name or not file_data:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'name и file_data обязательны'})}

        raw = base64.b64decode(file_data)
        size_bytes = len(raw)
        if size_bytes < 1024:
            size_str = f"{size_bytes} Б"
        elif size_bytes < 1024 * 1024:
            size_str = f"{round(size_bytes / 1024)} КБ"
        else:
            size_str = f"{round(size_bytes / 1024 / 1024, 1)} МБ"

        ext = file_name.rsplit('.', 1)[-1] if '.' in file_name else 'bin'
        key = f"documents/{uuid.uuid4().hex}.{ext}"

        s3 = get_s3()
        s3.put_object(Bucket=BUCKET, Key=key, Body=raw, ContentType=content_type)
        file_url = f"{CDN_BASE}/{key}"

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.documents (name, category, file_url, file_size) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, category, file_url, size_str),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'id': new_id, 'file_url': file_url}, ensure_ascii=False)}

    if method == 'DELETE':
        params = event.get('queryStringParameters') or {}
        doc_id = params.get('id')
        if not doc_id:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'id обязателен'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT file_url FROM {SCHEMA}.documents WHERE id = %s", (doc_id,))
        row = cur.fetchone()
        if row:
            file_url = row[0]
            key = file_url.replace(f"{CDN_BASE}/", '')
            try:
                s3 = get_s3()
                s3.delete_object(Bucket=BUCKET, Key=key)
            except Exception:
                pass
            cur.execute(f"DELETE FROM {SCHEMA}.documents WHERE id = %s", (doc_id,))
            conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}
