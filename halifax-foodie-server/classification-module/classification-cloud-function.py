import calendar
import time

from googleapiclient import discovery

def classify(event, context):
    jobInput = {
        "packageUris": [
            "gs://csci5410-project/ClassificationModule.tar.gz"
        ],
        "pythonModule": "trainer.task",
        "region": "us-west1",
        "runtimeVersion": "2.1",
        "jobDir": "gs://csci5410-classified-files",
        "pythonVersion": "3.7"
    }

    jobName = 'classification_test_' + str(calendar.timegm(time.gmtime()))
    request = discovery.build('ml', 'v1').projects().jobs().create(body={'jobId': jobName, 'trainingInput': jobInput}, parent='projects/csci-5410-s21-314709')
    response = request.execute()
    return response
