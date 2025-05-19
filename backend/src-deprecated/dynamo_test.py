import boto3

aws_access_key_id = "AKIA2S2Y4BH6XMVBVGAB"
aws_secret_access_key = "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"

# Initialize DynamoDB resource with hardcoded credentials
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

table = dynamodb.Table('MaayuBAI')

def table_counter():
    try:
        response = table.scan()
        table_size = len(response['Items'])
        return f"test_{table_size + 1}"
    except Exception as e:
        print(f"Error calculating next ResumeID: {e}")
        return "test_-1"

resume_id = table_counter()

item = {
    'ResumeID': resume_id,
    'Attribute1': 'Value1',
    'Attribute2': 'Value2'
}

try:
    table.put_item(Item=item)
    print("Item added successfully!")
except Exception as e:
    print(f"Error adding item: {e}")
