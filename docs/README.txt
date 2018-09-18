Bridge app and website docs
---------------------------

Welcome to the documentation for the app and the website (front-end).

Both folders contain individual files for the most complex components, and a "misc" file that contains information for the rest of the components.

I wrote the website docs before the app docs, so I recommend that you read the website docs first.

I used NPM as a package manager.


Installation
------------

For some reason the package.json file doesn't actually contain all of the package dependencies, and the .gitignore file excludes them from the repository, so you will have to install all of the packages manually.

You can look through all of the files and look at the "import" statements (and install the required npm packages manually), or use perhaps use a tool like "npm-install-all" to automatically detect dependencies in the files.


Running
-------

You can use the standard React/React Native tools for running the website/app. The Xcode project is included in the git repository, so you receive this when you clone the repository (but be sure to open up the project in Xcode and fix any settings as required before running it).


Deploying the website to AWS
----------------------------

When in the website directory, you should be able to use "npm run build" and then "npm run deploy" to deploy the website to AWS, but there will be some credentials to save on your machine before this works. You can also host the website locally using "npm start" (this will work, but of course any emails you receive will contain links that point to the actual website on AWS).

