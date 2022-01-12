import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from google.cloud import storage

cloudStorageClient = storage.Client()
vector = TfidfVectorizer(min_df=1, stop_words="english")

def create():
    fileContents = []
    recipeFileNames = []

    # Get user uploaded recipe file
    userRecipeFileContent = ""
    userRecipeFiles = cloudStorageClient.list_blobs("csci-5410-s21-314709.appspot.com")
    for userRecipeFile in userRecipeFiles:
        userRecipeFileName = userRecipeFile.name
        userRecipeFileContent = userRecipeFile.download_as_string().decode("utf-8")

        recipeFileNames.append(userRecipeFileName)
        fileContents.append(userRecipeFileContent)

        userRecipeFile.delete()


    # Get existing recipe files to find similarity
    recipeFiles = cloudStorageClient.list_blobs("csci5410-recipe-files")
    for recipeFile in recipeFiles:
        recipeFileName = recipeFile.name
        recipeContent = recipeFile.download_as_string().decode("utf-8")

        recipeFileNames.append(recipeFileName)
        fileContents.append(recipeContent)

    # Vectorised file content into tfidf (term frequenct - inverse document frequency) form
    tfidf = vector.fit_transform(fileContents)

    # Generate sparse matrix for similarity between recipe
    pairwise_similarity = tfidf * tfidf.T
    sparse_metrix = pairwise_similarity.toarray()

    # Remove diagonal entries which performs comparison with itself
    np.fill_diagonal(sparse_metrix, np.nan)
    userDataIndex = fileContents.index(userRecipeFileContent)

    # Get classified recipe data index based on similarity
    classifiedDataIndex = np.nanargmax(sparse_metrix[userDataIndex])

    # Store classified recipe details in cloud storage
    classifiedRecipe = cloudStorageClient.get_bucket("csci5410-classified-files").blob("similar-recipe.json")
    classifiedRecipe.upload_from_string(json.dumps({'fileName': recipeFileNames[classifiedDataIndex], 'fileContent': fileContents[classifiedDataIndex]}, indent = 4))

    return fileContents[classifiedDataIndex]