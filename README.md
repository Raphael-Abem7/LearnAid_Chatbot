# LearnAid
LearnAid is a web application powered by local Large Language models from Ollama. These AI models provide responses based on the GES-approved learning materials and, for that matter, is most helpful in guiding Senior High Schools with their studies. It is most suited for regular conversations and provides information with regards to the learning materials from which its results are derived, aiding students in their studies based on the nationally accepted curriculum. 
# How it works
This web app runs on local LLMs obtained from Ollama (an online site from which local AI models can be downloaded from), and the AI model receives and responds to questions sent to the backend through HTTP requests. When processed, the responses are then sent back to the frontend (the User Interface) to be displayed to the student.
# Its components
There are various packages and libraries necessary to ensure that the project fully functions, and they are as follows;
1. FastAPI (the API used to connect the backend to the frontend).
2. Uvicorn (the server which runs the backend and listens for HTTP requests)
3. Ollama (the package which enables us to communicate with Ollama's AI models)
4. Pydantic (the class used with FastAPI for data validation of the HTTP requests)
