#You should use awscli to set up your account info in your terminal first

import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

table = dynamodb.Table('MaayuBAI')

item = {
    'ResumeID': 'test1',
    'Attribute1': 'Value1',
    'Attribute2': 'Value2'
}

try:
    table.put_item(Item=item)
    print("Item added successfully!")
except Exception as e:
    print(f"Error adding item: {e}")
