import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохранение анкеты регистрации нового члена ГСК в базу данных."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])

    try:
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')

            required = ['last_name', 'first_name', 'middle_name',
                        'phone',
                        'address_city', 'address_street',
                        'passport_series', 'passport_number',
                        'passport_issued', 'passport_date',
                        'module_name', 'garage_number',
                        'ownership_cert', 'cadastral_number']
            missing = [f for f in required if not body.get(f)]
            if missing:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': f'Не заполнены поля: {", ".join(missing)}'}),
                }

            cur = conn.cursor()
            cur.execute(f"""
                INSERT INTO {schema}.member_applications
                    (last_name, first_name, middle_name,
                     phone, email,
                     address_city, address_street, address_postal,
                     passport_series, passport_number, passport_issued, passport_date, passport_code,
                     module_name, garage_number,
                     ownership_cert, cadastral_number, status)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'pending')
                RETURNING id, created_at
            """, (
                body['last_name'], body['first_name'], body['middle_name'],
                body['phone'], body.get('email'),
                body['address_city'], body['address_street'], body.get('address_postal', ''),
                body['passport_series'], body['passport_number'],
                body['passport_issued'], body['passport_date'], body.get('passport_code', ''),
                body['module_name'], body['garage_number'],
                body['ownership_cert'], body['cadastral_number'],
            ))
            row = cur.fetchone()
            conn.commit()
            cur.close()

            return {
                'statusCode': 201,
                'headers': cors_headers,
                'body': json.dumps({'id': row[0], 'created_at': str(row[1]), 'status': 'pending'}),
            }

        if method == 'GET':
            cur = conn.cursor()
            cur.execute(f"""
                SELECT id, last_name, first_name, middle_name,
                       phone, email,
                       address_city, address_street,
                       module_name, garage_number,
                       ownership_cert, cadastral_number,
                       status, created_at
                FROM {schema}.member_applications
                ORDER BY created_at DESC
                LIMIT 100
            """)
            rows = cur.fetchall()
            cur.close()
            cols = ['id','last_name','first_name','middle_name',
                    'phone','email',
                    'address_city','address_street',
                    'module_name','garage_number',
                    'ownership_cert','cadastral_number',
                    'status','created_at']
            result = [dict(zip(cols, [str(v) if not isinstance(v, (str, int, type(None))) else v for v in r])) for r in rows]
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps(result, ensure_ascii=False),
            }

        return {'statusCode': 405, 'headers': cors_headers, 'body': json.dumps({'error': 'Method not allowed'})}

    finally:
        conn.close()