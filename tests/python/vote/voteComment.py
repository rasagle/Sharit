import requests
import json
import sys

jsonBody = {
	"vote": 1,
	"comment_id": 2
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
res = requests.post('http://localhost:3000/voteComment', data = json.dumps(jsonBody), headers = headers)
print(res.json())