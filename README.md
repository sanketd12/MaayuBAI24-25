# Project README

## Git Strategy

**Always do work and run the development server in your virtual environment**

### 1. Checkout `main` and pull the latest changes:

    git checkout main
    git pull


### 2. Create feature branch off `main` for the feature you are working on and push to set up remote feature branch:

    git checkout -b feature/branch-name main
    git push -u origin feature/branch-name

**OR create a new branch from an existing remote feature branch:**

    git checkout -b feature/branch-name origin/remote-branch-name


### 3. Within your virtual environment, install any packages that may have been added:
    pip install -r requirements.txt


### 4. Make changes to implement the feature, add files and commit changes:

    git add .
    git commit -m “your commit message”


### 5. Push changes to the remote feature branch:

    git push


### 6. When the feature is complete, make a pull request into the test branch. If the feature works in the test environment and does not cause any breaking changes or bugs, make a pull request into `main`.



## Virtual Environments + Package Management

**Virtual envs do NOT get committed/pushed to the remote repository to prevent exposed API keys. Make sure the virtual env (`venv/`) on your local machine is included in the `.gitignore` file.**

### 1. Create a virtual env on your local machine in the project root folder with:

-    Windows/Linux/Mac: `python3 -m venv .venv`


### 2. Activate the virtual env:

-   Windows: `.venv\Scripts\activate`
-   Linux/Mac: `source .venv/bin/activate`

### 3. Install necessary dependencies:

`pip install -r requirements.txt`


<!-- ### 4. Update requirements.txt dependency list:
<!-- -   If you install any additional packages while implementing a feature, install (if you have not already) and run the `pipreqs` command in the project root folder to generate a `requirements.txt` file that lists all of the projects dependencies

    pip install pipreqs
    pipreqs /path/to/project/root --> -->
